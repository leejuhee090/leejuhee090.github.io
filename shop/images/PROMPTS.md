# 상품 이미지 프롬프트 (AI 생성 샘플)

샘플 쇼핑몰에 쓰는 이미지는 AI로 생성한 이미지입니다. 실제 브랜드나 제품 사진을 참고하지 않았습니다.
페이지에도 "AI로 작업된 이미지입니다"로 표기합니다.

공통 조건: 제품 사진 스타일, 부드러운 자연광, 단색 밝은 배경, 글자와 로고 없음, 3:4 세로 비율

| 파일명 | 상품 | 프롬프트 |
|---|---|---|
| product-1.jpg | 원목 라운지 의자 | original wooden lounge chair with a curved oak frame and a soft beige cushion, product photo, soft daylight, plain light background, no text, no logo, 3:4 |
| product-2.jpg | 패브릭 2인 소파 | original two-seat fabric sofa in light gray upholstery, low backrest, slim wooden legs, product photo, soft daylight, plain light background, no text, no logo, 3:4 |
| product-3.jpg | 화이트 수납 침대 프레임 | original white storage bed frame with two drawers at the base and a low headboard, product photo, soft daylight, plain light background, no text, no logo, 3:4 |
| product-4.jpg | 슬림 협탁 | original slim bedside table with one drawer in light wood finish, product photo, soft daylight, plain light background, no text, no logo, 3:4 |
| product-5.jpg | 월넛 다이닝 테이블 | original walnut dining table with a rectangular top and four legs, product photo, soft daylight, plain light background, no text, no logo, 3:4 |
| product-6.jpg | 모던 책장 | original modern bookshelf with open and closed compartments in a gray finish, product photo, soft daylight, plain light background, no text, no logo, 3:4 |
| product-7.jpg | 리넨 수납함 | original folding linen storage box in beige, product photo, soft daylight, plain light background, no text, no logo, 3:4 |
| product-8.jpg | 스탠드 조명 | original floor standing lamp with a fabric shade and a minimal stand, product photo, soft daylight, plain light background, no text, no logo, 3:4 |

생성 후 `shop/images/` 폴더에 위 파일명으로 저장하면, 상품 데이터(`shop/js/data.js`)의 `image` 경로가 자동으로 연결됩니다.

## 현재 적용된 이미지

현재 페이지에는 위 프롬프트 방식이 아니라, 원본 사진 없이 Claude가 직접 그린 SVG 일러스트(`product-1.svg` ~ `product-8.svg`)가 쓰입니다.
나중에 AI 이미지 생성 도구로 사진을 만들면 같은 파일명으로 교체하면 됩니다. 이 경우 `shop/js/data.js`의 확장자만 `.jpg` 등으로 바꾸면 됩니다.
