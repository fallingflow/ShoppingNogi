import { searchItemList } from './info.js'

let APIKEY = "test_3aea5b595556584ab54c0245a7e2a9ea6147d1642ba5988c6308cf189a253d7cefe8d04e6d233bd35cf2fabdeb93fb0d"
let searchItemURL = 'https://open.api.nexon.com/mabinogi/v1/auction/list'


function createCategoryTooltip(element) {
    let tooltip = document.createElement('div')
    console.log(element)

    return tooltip
}

$(document).ready(function () {

    let items= []
    document.getElementById('inputForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const article = document.getElementById('content-article')
        article.style.display='none'

        items = [] // initialize itmes array

        let word = document.getElementById('search').value
        let itemListTitle = document.getElementById('item-list-title')
        itemListTitle.innerText = '\"'+word+'\"의 검색 결과'

        searchItemList(word, 'name', searchItemURL, APIKEY)

    });

    document.querySelectorAll('.navigator-category-upper').forEach(element => {
        element.addEventListener('click', function(event) {
            let tooltip = document.createElement('div');
            tooltip.className = 'category-tooltip';

            let tooltipWrapper = document.createElement('ul');
            let tooltipCategory = []
            switch(event.target.innerText){
                case '근거리 장비':
                    tooltipCategory = ['한손 장비', '양손 장비','검','도끼','둔기','랜스','너클','체인 블레이드']
                    break;
                case '원거리 장비':
                    tooltipCategory = ['활','석궁','듀얼건','수리검','아틀라틀','원거리 소모품']
                    break;
                case '마법 장비':
                    tooltipCategory = ['실린더','스태프','원드','마도서','오브']
                    break;
                case '갑옷 장비':
                    tooltipCategory = ['중갑옷','경갑옷','천옷']
                    break;
                case '액세서리':
                    tooltipCategory = ['얼굴 장식','액세서리','날개','꼬리']
                    break;
                case '특수 장비':
                    tooltipCategory = ['악기','생활 도구','에코스톤']
                    break;
                case '인챈트 용품':
                    tooltipCategory = ['인챈트 스크롤']
                    break;
                case '기타':
                    tooltipCategory = ['뷰티 쿠폰']
                    break;
                default:
                    break;
            }
            tooltipCategory.forEach(category => {
                let tooltipItem = document.createElement('li');
                tooltipItem.className='category-tooltip-item';
                tooltipItem.innerText = category;

                tooltipItem.addEventListener('click', function(event) {
                    const article = document.getElementById('content-article')
                    article.style.display='none'
                    searchItemList(category, 'category', searchItemURL, APIKEY)
                    tooltipItem.remove()
                })

                tooltipWrapper.appendChild(tooltipItem);
            })
            tooltipWrapper.style.paddingRight = '1.5rem';
            tooltipWrapper.style.paddingLeft = '1.5rem';
            tooltipWrapper.style.marginBottom = '5px';
            tooltip.appendChild(tooltipWrapper);

            // tooltip.innerText = event.target.innerText;
            document.body.appendChild(tooltip);

            tooltip.style.left = element.offsetLeft + element.offsetWidth + 45 + 'px';
            tooltip.style.top = element.offsetTop + 70+ 'px';
            tooltip.style.display = 'block';

            tooltipWrapper.style.listStyle = 'none';

            function hideTooltip(event) {
                if (!tooltip.contains(event.target) && event.target !== element) {
                    tooltip.remove();
                    document.removeEventListener('click', hideTooltip);
                }
            }

            document.addEventListener('click', hideTooltip);
        });
    });

});

