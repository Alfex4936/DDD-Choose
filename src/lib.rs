use gloo_utils::format::JsValueSerdeExt;
use wasm_bindgen::prelude::*;
use web_sys::console;
mod gpt;
mod place;

use gpt::*;
use place::*;

#[derive(Debug)]
pub enum SystemErr {
    RequestError,
    ResponseError,
    ParseError,
    JsConversionError,
    OpenAIError,
}

// Convert errors to strings for JsValue
impl From<SystemErr> for JsValue {
    fn from(err: SystemErr) -> JsValue {
        match err {
            SystemErr::RequestError => JsValue::from_str("Failed to send request"),
            SystemErr::ResponseError => JsValue::from_str("Failed to get text from response"),
            SystemErr::ParseError => JsValue::from_str("Failed to parse response text"),
            SystemErr::JsConversionError => JsValue::from_str("Failed to convert data to JS value"),
            SystemErr::OpenAIError => JsValue::from_str("Failed to request to OpenAI"),
        }
    }
}

// function to convert `Vec<String>` to `JsValue`
fn vec_to_js_value(v: Vec<String>) -> JsValue {
    let serialized = serde_json::to_string(&v).unwrap();
    JsValue::from_str(&serialized)
}

#[wasm_bindgen]
extern "C" {
    // Use `js_namespace` here to bind `console.log(..)` instead of just
    // `log(..)`
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &JsValue);

}

#[wasm_bindgen]
pub fn get_places(search_string: String) -> js_sys::Promise {
    let future = get_places_rs(search_string);

    let future = async move {
        let body = future.await?;
        let js_value = serde_wasm_bindgen::to_value(&body.documents)
            .map_err(|_| SystemErr::JsConversionError)?;
        Ok(js_value)
    };

    wasm_bindgen_futures::future_to_promise(future)
}

#[wasm_bindgen]
pub async fn get_places_by_gpt(keywords: String) -> Result<js_sys::Array, JsValue> {
    let mut keywords: Vec<String> = keywords
        .split(", ")
        .map(|s: &str| s.trim().to_string())
        .collect();

    if let Some(last) = keywords.last_mut() {
        *last = last.trim_end_matches('.').to_string();
    }

    let results = js_sys::Array::new();
    for keyword in keywords {
        match get_places_rs(keyword).await {
            Ok(body) => {
                if !body.documents.is_empty() {
                    let place = &body.documents[0];
                    results.push(&JsValue::from_serde(&place).unwrap());

                    if body.documents.len() > 1 {
                        let place = &body.documents[1];
                        results.push(&JsValue::from_serde(&place).unwrap());
                    }
                }
            }
            Err(err) => {
                console::log_1(&format!("Error: {:#?}", err).into());
            }
        }
    }
    Ok(results)
}

#[wasm_bindgen]
pub fn get_interests(api: String, model: String, interest: String) -> js_sys::Promise {
    console::log_1(&format!("Model: {:#?}, interest: {:#?}", model, interest).into());
    let future = get_openai_response_rs(api, model, interest);

    let future = async move {
        let body = future.await?;
        let js_value =
            serde_wasm_bindgen::to_value(&body).map_err(|_| SystemErr::JsConversionError)?;
        Ok(js_value)
    };

    wasm_bindgen_futures::future_to_promise(future)
}
