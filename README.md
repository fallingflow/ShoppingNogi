# What is ShoppingNogi?
![ShoppingNogi Logo](https://raw.githubusercontent.com/fallingflow/ShoppingNogi/refs/heads/main/templates/public/icon.ico)

ShoppingNogi는 (주)넥슨에서 2003년부터 서비스되고 있는 MMORPG 장르 온라인 게임 '마비노기'의 아이템 거래 시스템, '경매장'에 현재 등록되어 있는 아이템을 검색할 수 있는 서비스입니다.

단순히 현재 등록된 아이템 목록을 열람하는 것 외에도, 최근 1일 안에 판매된 아이템의 목록을 열람할 수 있습니다.
- 단, 목록은 API 호출 한계 때문에 3시간에 한 번 업데이트됩니다.

또한 타 유사 서비스와 다르게, 아이템의 툴팁을 실제 인게임 구조와 비슷하게 구현하여 게임 내에서 경매장을 열람하는 것과 크게 다르지 않은 경험을 할 수 있도록 구현하였습니다.

# How to Use
1. 검색창에 아이템 이름을 입력하여 등록 정보를 검색할 수 있습니다. 
    - 단, 부분검색은 지원하지 않으며 전체 검색어를 정확히 입력해야 합니다.
   - 예시: '부러진 통나무', '블루 에코스톤', '페른의 의상(여성용)'
2. 표의 맨 위 '시간'과 '가격'을 누르면 내림차순 혹은 오름차순으로 데이터를 정렬하여 볼 수 있습니다.
    ![정렬 메뉴](https://i.postimg.cc/Wb02jvHk/img-01.png)
    - 초기 정렬 방법은 경매장에 등록된 아이템 순입니다. 가장 최근에 등록되었을수록 가장 앞에 출력되고, 가장 나중에 등록되었을수록 가장 뒤에 출력됩니다.
3. 아이템명을 클릭 시 해당 아이템의 속성이 툴팁 형태로 표시됩니다. 표시 형태는 인게임 UI에 최대한 가깝도록 구현되었습니다.  
    ![툴팁 예시](https://i.postimg.cc/QN0zTnKy/img-02.png)

# Road to Development (Notion Blog)
![강아지](https://i.postimg.cc/brLb6B2C/img-03.png)  
[2024 2nd Semester Term Project “ShoppingNogi”](https://spicy-juniper-8d2.notion.site/2024-2nd-Semester-Term-Project-ShoppingNogi-14822f5338c38052a9a7d167907dcbf9)

# Libraries, Frameworks
- node.js
- express
- MySQL
- axios
- bootstrap
- jquery

# Licence
This project is licensed under the MIT License
