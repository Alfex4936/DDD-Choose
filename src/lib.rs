use js_sys::Array;
use wasm_bindgen::prelude::*;

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
pub fn get_interests(api: String, interest: String) -> js_sys::Promise {
    let future = get_openai_response_rs(api, interest);

    let future = async move {
        let body = future.await?;
        let js_value =
            serde_wasm_bindgen::to_value(&body).map_err(|_| SystemErr::JsConversionError)?;
        Ok(js_value)
    };

    wasm_bindgen_futures::future_to_promise(future)
}
