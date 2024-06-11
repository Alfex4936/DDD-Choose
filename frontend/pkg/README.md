![image](https://github.com/Alfex4936/DDD-Choose/assets/2356749/25bafd2c-f75a-4aed-8060-484561f3ae3a)

![demo](https://github.com/Alfex4936/DDD-Choose/assets/2356749/c6f32170-4da0-4ffb-8ed9-90f586b60636)

![image](https://github.com/Alfex4936/DDD-Choose/assets/2356749/61ad56ce-8f36-48d6-867c-fdaef208601d)

# 딩동댕 선택기 위치 검색

딩동댕 선택기는 사용자가 키워드를 입력하면 해당 키워드와 관련된 위치들을 지도 위에 표시하는 웹 애플리케이션입니다.

이 프로젝트는 Rust, WebAssembly (Wasm), JavaScript, HTML, CSS, GPT-4 API 그리고 카카오맵 API를 이용하여 만들어졌습니다.


## TODO

- [x] React.js frontend
- [x] GPT-4 API 연동
- [x] Rust WASM
- [x] 카카오맵 API + WASM 연동
- [ ] Better GPT prompt


## 기술 스택

- **Rust & WebAssembly (Wasm):** 주요 로직은 Rust로 작성되었으며, WASM을 통해 웹에서 실행됩니다. Rust의 WASM 바인딩은 JavaScript와의 상호 작용을 가능하게 합니다.

- **JavaScript:** HTML 요소와 이벤트를 처리하고 Rust 함수를 호출합니다.

- **HTML & CSS:** 사용자 인터페이스를 제공하며, 위치를 검색할 수 있는 검색창과 위치를 표시할 지도를 포함합니다.

- **Kakao Map API:** 사용자가 검색한 키워드의 위치를 찾고, 지도를 생성하며, 검색 결과에 대한 마커를 지도 위에 표시합니다.

## 프로젝트 설명

이 프로젝트는 사용자가 웹사이트에서 키워드를 검색하면, 이 키워드와 관련된 장소들을 카카오맵 위에 표시하는 기능을 가지고 있습니다. Rust 및 WASM을 사용하여 위치 데이터를 검색하고 처리하며, 카카오맵 API를 통해 지도를 표시하고, 검색한 위치의 마커를 만듭니다.

주요 구성 요소는 다음과 같습니다:

1. **장소 정보를 담기 위한 Rust 구조체(Place):** 장소의 이름, 주소, 위도와 경도를 저장합니다.

2. **장소 검색 함수(get_places):** 카카오맵 API를 사용하여 사용자가 입력한 키워드를 기반으로 장소를 검색하고, 이를 Rust 구조체로 변환하여 반환합니다.

3. **HTML & CSS:** 웹사이트의 헤더에는 로고와 검색창이 있으며, 나머지 부분은 지도로 채워져 있습니다.

4. **JavaScript 함수(run & renderMap):** 웹사이트가 로드될 때 WASM 모듈을 초기화하고, 사용자가 검색창에서 'Enter' 키를 누르면 해당 키워드를 기반으로 위치를 검색하고 지도를 렌더링합니다.


## 참고

WASM 바이너리와 JavaScript 바인딩은 `pkg` 디렉토리에 위치해 있습니다. WASM 바이너리는 Rust 코드를 컴파일한 결과이며, JavaScript 바인딩은 JavaScript가 Rust 코드를 호출할 수 있게 해주는 코드입니다.


## 라이센스

이 프로젝트는 [MIT 라이센스](LICENSE)하에 제공됩니다.
