import { searchItemList } from './info.js'

let APIKEY = "test_3aea5b595556584ab54c0245a7e2a9ea6147d1642ba5988c6308cf189a253d7cefe8d04e6d233bd35cf2fabdeb93fb0d"
let searchItemURL = 'https://open.api.nexon.com/mabinogi/v1/auction/list'


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

        searchItemList(word, searchItemURL, APIKEY)

    });


});

