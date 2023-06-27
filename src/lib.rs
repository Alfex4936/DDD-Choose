use reqwest::header::{HeaderMap, HeaderValue, AUTHORIZATION};
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

// Define an error type
#[derive(Debug)]
enum GetPlacesError {
    RequestError,
    ResponseError,
    ParseError,
    JsConversionError,
}

// Convert errors to strings for JsValue
impl From<GetPlacesError> for JsValue {
    fn from(err: GetPlacesError) -> JsValue {
        match err {
            GetPlacesError::RequestError => JsValue::from_str("Failed to send request"),
            GetPlacesError::ResponseError => JsValue::from_str("Failed to get text from response"),
            GetPlacesError::ParseError => JsValue::from_str("Failed to parse response text"),
            GetPlacesError::JsConversionError => {
                JsValue::from_str("Failed to convert data to JS value")
            }
        }
    }
}

#[derive(Serialize, Deserialize)]
struct Place {
    address_name: String,
    place_name: String,
    x: String,
    y: String,
}

#[derive(Deserialize)]
struct Body {
    documents: Vec<Place>,
}

async fn get_places_rs(search_string: String) -> Result<Body, GetPlacesError> {
    let url = format!(
        "https://dapi.kakao.com/v2/local/search/keyword.json?query={}",
        search_string
    );

    let mut headers = HeaderMap::new();
    headers.insert(
        AUTHORIZATION,
        HeaderValue::from_str("KakaoAK f297e2664b54a8bbaf5ef274d0cf3911").unwrap(),
    );

    let client = reqwest::Client::new();

    let response = client
        .get(&url)
        .headers(headers)
        .send()
        .await
        .map_err(|_| GetPlacesError::RequestError)?
        .text()
        .await
        .map_err(|_| GetPlacesError::ResponseError)?;

    let body: Body = serde_json::from_str(&response).map_err(|_| GetPlacesError::ParseError)?;

    Ok(body)
}

#[wasm_bindgen]
pub fn get_places(search_string: String) -> js_sys::Promise {
    let future = get_places_rs(search_string);

    let future = async move {
        let body = future.await?;
        let js_value = serde_wasm_bindgen::to_value(&body.documents)
            .map_err(|_| GetPlacesError::JsConversionError)?;
        Ok(js_value)
    };

    wasm_bindgen_futures::future_to_promise(future)
}
