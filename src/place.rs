use reqwest::header::{HeaderMap, HeaderValue, AUTHORIZATION};
use serde::{Deserialize, Serialize};
use std::hash::{Hash, Hasher};

use crate::SystemErr;

#[derive(Clone, Serialize, Deserialize)]
pub struct Place {
    pub address_name: String,
    pub place_name: String,
    pub x: String,
    pub y: String,
    pub category_name: String,
}

impl PartialEq for Place {
    fn eq(&self, other: &Self) -> bool {
        self.place_name == other.place_name && self.x == other.x && self.y == other.y
    }
}

impl Eq for Place {}

impl Hash for Place {
    fn hash<H: Hasher>(&self, state: &mut H) {
        self.place_name.hash(state);
        self.x.hash(state);
        self.y.hash(state);
    }
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
