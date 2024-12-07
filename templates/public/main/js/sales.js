import {Pagination} from "./info.js";

URL = '/api/sales'

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

            let pagination = new Pagination(res, 20);
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

    document.getElementById('inputForm').addEventListener('submit', function (e) {
        e.preventDefault();
        items = []

        let word = document.getElementById('search').value;
        getSalesDataByName(word)
    });

})