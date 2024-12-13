import { searchItemList } from './info.js'

let APIKEY = "test_3aea5b595556584ab54c0245a7e2a9ea6147d1642ba5988c6308cf189a253d7cefe8d04e6d233bd35cf2fabdeb93fb0d"
let searchItemURL = 'https://open.api.nexon.com/mabinogi/v1/auction/list'

function showSubCategory(){
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

                tooltipItem.addEventListener('click', function(e) {
                    document.getElementById('item-list-chart').style.display='none'
                    document.getElementById('message').innerText = ''
                    const article = document.getElementById('content-article')
                    article.style.display='none'

                    let word = e.target.innerText
                    let itemListTitle = document.getElementById('item-list-title')
                    itemListTitle.innerText = '\"'+word+'\"의 카테고리의 결과'

                    searchItemList(word, 'name', searchItemURL, APIKEY)

                    searchItemList(category, 'category', searchItemURL, APIKEY)
                    tooltipItem.remove()
                })

                tooltipItem.style.paddingLeft = '1rem';
                tooltipItem.style.paddingRight = '1rem';

                tooltipWrapper.appendChild(tooltipItem);
            })
            tooltipWrapper.style.paddingLeft = 0;
            tooltipWrapper.style.marginBottom = '5px';
            tooltipWrapper.style.listStyle = 'none';
            tooltip.appendChild(tooltipWrapper);

            // tooltip.innerText = event.target.innerText;
            document.body.appendChild(tooltip);
            const windowWidth = window.innerWidth;
            const tooltipWidth = tooltip.offsetWidth;
            const centerPosition = (windowWidth - tooltipWidth) / 2;
            const newPositionX = centerPosition - 380;

            if(newPositionX < 30) tooltip.style.left = '30px';
            else tooltip.style.left = `${newPositionX}px`;

            tooltip.style.top = `${element.offsetTop+70}px`;
            tooltip.style.display = 'block';


            function hideTooltip(event) {
                if (!tooltip.contains(event.target) && event.target !== element) {
                    tooltip.remove();
                    document.removeEventListener('click', hideTooltip);
                }
            }

            document.addEventListener('click', hideTooltip);
        });
    });
}

function updateNavPosition(){
    const nav = document.getElementById('navigator')
    const windowWidth = window.innerWidth;
    const navWidth = nav.offsetWidth;
    const centerPosition = (windowWidth - navWidth) / 2;
    const newPositionX = centerPosition - 480;

    if(newPositionX < 30) nav.style.left = '30px';
    else nav.style.left = `${newPositionX}px`;
}

function updateTooltipPosition(){
    const tooltip = document.getElementsByClassName('category-tooltip')[0];
    const windowWidth = window.innerWidth;
    const tooltipWidth = tooltip.offsetWidth;
    const centerPosition = (windowWidth - tooltipWidth) / 2;
    const newPositionX = centerPosition - 330;

    if(newPositionX < 30) tooltip.style.left = '30px';
    else tooltip.style.left = `${newPositionX}px`;
}

$(document).ready(function () {
    window.addEventListener('resize', updateNavPosition);
    window.addEventListener('load', updateNavPosition);

    window.addEventListener('resize', updateTooltipPosition);
    window.addEventListener('load', updateTooltipPosition);

    $('#header-left-title').click(function(){
        window.location.href = '/'
    })

    showSubCategory()


    let items= []
    document.getElementById('inputForm').addEventListener('submit', function (e) {
        e.preventDefault();
        document.getElementById('item-list-chart').style.display='none'
        document.getElementById('message').innerText = ''
        const article = document.getElementById('content-article')
        article.style.display='none'

        items = [] // initialize itmes array

        let word = document.getElementById('search').value
        let itemListTitle = document.getElementById('item-list-title')
        itemListTitle.innerText = '\"'+word+'\"의 검색 결과'

        searchItemList(word, 'name', searchItemURL, APIKEY)

    });

});

