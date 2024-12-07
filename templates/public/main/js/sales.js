import {Pagination} from "./info.js";
URL = '/api/sales'

class SalesPagination extends Pagination {
    drawTablePrice(item){
        let td = document.createElement('td')
        td.classList.add('item-list-price')
        let span = document.createElement('span')
        span.innerText = "개당: "+this.parsePrice(item['auction_price_per_unit'])
        span.classList.add('item-list-price-per-unit')

        if(item['auction_price_per_unit'] >= 100000000){
            span.style.color = '#e88d90';
            // span.style.fontWeight = 'bold';
            span.style.textShadow = '0 0 5px #9b3e42';
        } else if(item['auction_price_per_unit'] >= 10000){
            span.style.color = '#94c1dd';
            // span.style.fontWeight = 'bold';
            span.style.textShadow = '0 0 5px #69889C';
        }

        td.appendChild(span)
        span = document.createElement('span')
        span.innerText = "전체: "+this.parsePrice(item['auction_price_per_unit'] * item['item_count'])
        span.classList.add('item-list-price-total')
        if(item['auction_price_per_unit'] * item['item_count'] >= 100000000) {
            span.style.color = '#e88d90';
            // span.style.fontWeight = 'bold';
            span.style.textShadow = '0 0 5px #9b3e42';
        } else if(item['auction_price_per_unit'] * item['item_count'] >= 10000){
            span.style.color = '#94c1dd';
            // span.style.fontWeight = 'bold';
            span.style.textShadow = '0 0 5px #69889C';
        }
        td.style.width='250px'
        td.appendChild(span)
        span.style.display = 'block'

        return td
    }
    drawTableTime(item){
        let td = document.createElement('td')
        td.classList.add('item-list-time')
        td.innerText = this.parseTime(item['date_auction_buy'])
        td.style.width='120px'
        return td
    }
    parseTime(time){
        let date = new Date;
        let timeDate = new Date(time);
        let diff = date - timeDate
        if(diff < 0) return "만료"
        let diffSec = diff / 1000;
        let diffMin = Math.floor(diffSec / 60);
        let diffHour = Math.floor(diffMin / 60);

        if(diffHour < 1) return Math.ceil(diffMin) + "분 전"
        else return diffHour + "시간 전"
    }
}


let items = []
function getSalesDataByName(){
    let name = window.location.pathname;
    name = name.replace('/sales/', '')

    const requestURL = URL + '/' + name

    $.ajax({
        method: "GET",
        url: requestURL,
        success: function(res){
            console.log(res)

            let pagination = new SalesPagination(res, 20);
            pagination.renderPagination(1);
            pagination.drawTable(1);
        }
    })
}

function getItemSaleDetailInfo(itemsArray){
    let itemInfos = []
    itemsArray.forEach(i => {
        i.forEach(item => {
            itemInfos.push({
                "auction_buy_id": item['auction_buy_id'],
                "auction_price_per_unit": item['auction_price_per_unit'],
                "date_auction_buy": item['date_auction_buy'],
                "item_count": item['item_count'],
                "item_display_name": item['item_display_name'],
                "item_name": item['item_name'],
                "item_option": item['item_option']
            })
        })
    })
    return itemInfos
}




$(document).ready(function(){
    getSalesDataByName('쥬얼러 밸류 글라스')


    let nav = document.getElementById('navigator')
    nav.style.display = 'none'

    let word = window.location.pathname;
    word = word.replace('/sales/', '')
    word = decodeURIComponent(word);
    let itemListTitle = document.getElementById('item-list-title')
    itemListTitle.innerText = '\"'+word+'\"의 최근 판매 기록'

    document.getElementById('inputForm').addEventListener('submit', function (e) {
        e.preventDefault();
        items = []

    });

})