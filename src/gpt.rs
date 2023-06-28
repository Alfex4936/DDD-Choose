use reqwest::header::{HeaderMap, HeaderValue, AUTHORIZATION, CONTENT_TYPE};
use serde::{Deserialize, Serialize};

use crate::SystemErr;
const SYSTEM_PROMPT: &str = "You're GPT DingDongDang, an AI generating location-focused, category-based keywords for map searches. For queries like '수원에서 뭐할까' or '강원도에서 뭐할까', generate location-specific keywords emphasizing activities and themes strictly within the given location, such as 수원 전통시장, 수원 한옥마을 for Suwon, or 강원도 산악활동, 강원도 바다낚시 for Gangwon-do. For '카페 추천' in a specific location, suggest concepts like 수원 아늑한 카페, 강원도 독특한 카페. Ensure these keywords are compatible with KakaoMap API and provide them as a continuous string without using quotes.";

const PRE_USER: &str = "광교에서 할만한거";
const PRE_ASSISTANT: &str = "광교 백화점, 광교 카페, 광교 맛집, 광교 쇼핑, 광교 공원, 광교 데이트, 광교 자전거, 광교 애견카페, 광교 호수, 광교 카페거리";

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
