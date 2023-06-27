use reqwest::header::{HeaderMap, HeaderValue, AUTHORIZATION, CONTENT_TYPE};
use serde::{Deserialize, Serialize};

use crate::SystemErr;
const SYSTEM_PROMPT: &str = "You're GPT DingDongDang, an AI producing category-based keywords for map searches. Create keywords that align with user inquiries, emphasizing activities and themes over specific locations. For '서울에서 뭐할까?', generate keywords such as '이태원 맛집', '홍대 클럽', '강남 쇼핑', '명동 뷰티샵'. If a user asks for '카페 추천', recommend concepts like '분위기 좋은 카페', '이색 카페', '서울 카페거리', '파주 책 카페'. Generate such keywords compatible with KakaoMap API as a continuous string.";

const PRE_USER: &str = "부산에서 뭐할까?";
const PRE_ASSISTANT: &str = "해운대 해변, 국제시장, 남포동거리, 동백섬 산책로, 감천문화마을, 센텀시티 쇼핑, 누리마루APEC하우스, 해동 용궁사";

#[derive(Serialize, Deserialize)]
struct OpenAIRequest {
    model: String,
    messages: Vec<Message>,
    max_tokens: u32,
}

#[derive(Serialize, Deserialize)]
struct Message {
    role: String,
    content: String,
}

/*
{
  "id": "chatcmpl-7W35sNG2ryAdvKMEnyKM2G9G1iXrx",
  "object": "chat.completion",
  "created": 1687872744,
  "model": "gpt-4-0314",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "화성행궁, 수원화성, 이야기의거리, 평택호 국립수목원, 경기박물관, 수원천, 팔달문, 카페거리 산책, 수원 월드컵 경기장, 수원장앤할마레아이스하키경기장"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 391,
    "completion_tokens": 100,
    "total_tokens": 491
  }
}
*/
pub async fn get_openai_response_rs(api: String, interest: String) -> Result<String, SystemErr> {
    let url = "https://api.openai.com/v1/chat/completions";

    let mut headers = HeaderMap::new();
    headers.insert(CONTENT_TYPE, HeaderValue::from_static("application/json"));
    headers.insert(
        AUTHORIZATION,
        HeaderValue::from_str(&format!("Bearer {}", api)).unwrap(),
    );

    let client = reqwest::Client::new();

    let request_body = OpenAIRequest {
        model: "gpt-4".to_string(),
        messages: vec![
            Message {
                role: "system".to_string(),
                content: SYSTEM_PROMPT.to_string(),
            },
            Message {
                role: "user".to_string(),
                content: PRE_USER.to_string(),
            },
            Message {
                role: "assistant".to_string(),
                content: PRE_ASSISTANT.to_string(),
            },
            Message {
                role: "user".to_string(),
                content: interest,
            },
        ],
        max_tokens: 150,
    };

    let response = client
        .post(url)
        .headers(headers)
        .json(&request_body)
        .send()
        .await
        .map_err(|_| SystemErr::RequestError)?
        .text()
        .await
        .map_err(|_| SystemErr::ResponseError)?;

    Ok(response)
}
