URL = 'https://open.api.nexon.com/mabinogi/v1/auction/history'
APIKEY = 'test_3aea5b595556584ab54c0245a7e2a9ea6147d1642ba5988c6308cf189a253d7cefe8d04e6d233bd35cf2fabdeb93fb0d'

function getSalesDataByCategory(){
    return 0
}


items = []
function getSalesDataByName(name, cursor=null, paging=0){
    requestURL = URL + '?item_name=' + name

    if(cursor != null){
        url += '&cursor=' + cursor
    }
    $.ajax({
        method: "GET",
        url: requestURL,
        beforeSend: function(xhr){
            xhr.setRequestHeader("x-nxopen-api-key", APIKEY)
        },
        success: function(res){
            items.push(res['auction_history']);
            if(paging < 2 && res['cursor'] != null){
                getSalesDataByName(name, res['cursor'], ++paging)
            }else {
                let infos = getItemDetailInfo(items);

                console.log(infos)

                document.getElementById('paging').innerHTML = ""

                let pagination = new Pagination(infos, 20);
                pagination.renderPagination(1);
                pagination.drawTable(1);


                return infos
            }
        }
    })
}

function getItemSaleDetailInfo(itemsArray){
    let itemInfos = []
    itemArray.forEach(i => {
        i.forEach(item => {
            itemInfos.push({

                "item_name": item['item_name'],
                "item_display_name": item['item_display_name'],
                "item_count": item['item_count'],
                "auction_price_per_unit": item['auction_price_per_unit'],
                "date_auction_expire": item['date_auction_expire'],
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