use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use wasm_bindgen_futures::JsFuture;
use web_sys::{Headers, Request, RequestInit, Response};

// 장소 정보를 담기 위한 구조체
#[derive(Serialize, Deserialize)]
struct Place {
    address_name: String,
    place_name: String,
    x: String,
    y: String,
}

// 외부 JavaScript fetch 함수와의 인터페이스 (비동기임)
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = window, catch)]
    async fn fetch(url: &str, headers: JsValue) -> Result<JsValue, JsValue>;
}

// 장소 검색 함수
#[wasm_bindgen]
pub async fn get_places(search_string: &str) -> Result<JsValue, JsValue> {
    // 검색 쿼리를 사용해 URL 생성
    let url = format!(
        "https://dapi.kakao.com/v2/local/search/keyword.json?query={}",
        search_string
    );

    let mut opts = RequestInit::new();
    opts.method("GET");

    let headers = Headers::new().unwrap();
    // Kakao API를 사용하기 위해 필요한 Authorization 헤더 설정
    headers
        .set("Authorization", "KakaoAK REST_API_KEY")
        .unwrap();

    opts.headers(&headers);

    let request = Request::new_with_str_and_init(&url, &opts).unwrap();

    let window = web_sys::window().unwrap();
    // fetch 요청 보내기
    let resp_value = JsFuture::from(window.fetch_with_request(&request))
        .await
        .map_err(|_| "Failed to fetch data")?;

    let resp: Response = resp_value.dyn_into().unwrap();

    let json_value = JsFuture::from(resp.json().unwrap()).await.unwrap();

    // 응답 바디를 자료형으로 변환
    #[derive(Deserialize)]
    struct Body {
        documents: Vec<Place>,
    }

    let body: Body = serde_wasm_bindgen::from_value(json_value.clone())
        .map_err(|_| "Failed to parse response data")?;

    // 변환된 자료형에서 장소 데이터 추출
    let places_js: JsValue = serde_wasm_bindgen::to_value(&body.documents)
        .map_err(|_| "Failed to convert data to JS value")?;

    Ok(places_js)
}
