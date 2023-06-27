use reqwest::header::{HeaderMap, HeaderValue, AUTHORIZATION};
use serde::{Deserialize, Serialize};

use crate::SystemErr;

#[derive(Serialize, Deserialize)]
pub struct Place {
    pub address_name: String,
    pub place_name: String,
    pub x: String,
    pub y: String,
}

#[derive(Deserialize)]
pub struct Body {
    pub documents: Vec<Place>,
}

pub async fn get_places_rs(search_string: String) -> Result<Body, SystemErr> {
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
        .map_err(|_| SystemErr::RequestError)?
        .text()
        .await
        .map_err(|_| SystemErr::ResponseError)?;

    let body: Body = serde_json::from_str(&response).map_err(|_| SystemErr::ParseError)?;

    Ok(body)
}
