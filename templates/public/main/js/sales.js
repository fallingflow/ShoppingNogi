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
            span.style.textShadow = '0 0 2px #9b3e42';
        } else if(item['auction_price_per_unit'] >= 10000){
            span.style.color = '#94c1dd';
            // span.style.fontWeight = 'bold';
            span.style.textShadow = '0 0 2px #69889C';
        }

        td.appendChild(span)
        span = document.createElement('span')
        span.innerText = "전체: "+this.parsePrice(item['auction_price_per_unit'] * item['item_count'])
        span.classList.add('item-list-price-total')
        if(item['auction_price_per_unit'] * item['item_count'] >= 100000000) {
            span.style.color = '#e88d90';
            // span.style.fontWeight = 'bold';
            span.style.textShadow = '0 0 2px #9b3e42';
        } else if(item['auction_price_per_unit'] * item['item_count'] >= 10000){
            span.style.color = '#94c1dd';
            // span.style.fontWeight = 'bold';
            span.style.textShadow = '0 0 2px #69889C';
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

            drawChart(res)

            let pagination = new SalesPagination(res, 20);
            pagination.renderPagination(1);
            pagination.drawTable(1);
        }
    })
}

function drawChart(res){
    if(res.length == 0){
        document.getElementById('item-list-chart').style.display = 'none'
        let message = document.createElement('div')
        message.innerText = '해당 아이템의 최근 1일 내 판매 기록이 없습니다.'
        message.style.color = '#fff'
        message.style.margin = '0 auto';
        message.style.textAlign = 'center';
        message.style.width = '100%';
        document.getElementById('content').appendChild(message)
    }

    // date_auction_buy와 auction_price_per_unit 데이터를 추출
    const labels = res.map(item => {
        let date = new Date(item.date_auction_buy);
        return `${date.getHours()}시 ${date.getMinutes()}분`;
    }).reverse();
    const data = res.map(item => item.auction_price_per_unit).reverse();

    // 데이터의 최소값과 최대값을 계산
    const minValue = Math.min(...data);
    const maxValue = Math.max(...data);
    const padding = (maxValue - minValue) * 0.2;
    let bottom
    if (minValue - padding < 0) bottom = 0;
    else bottom = minValue - padding;
    let top = maxValue + padding;

    let ctx = document.getElementById('chart').getContext('2d');
    let chart = new Chart(ctx, {
        type: 'line',
        fill: 'false',
        data: {
            labels: labels,
            datasets: [{
                label: '가격',
                backgroundColor: '#FF6A00',
                borderColor: '#FF6A00',
                data: data,
            }]
        },
        options: {
            scales: {
                y: {
                    min: bottom,
                    max: top,
                    beginAtZero: false
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}






$(document).ready(function(){
    getSalesDataByName('쥬얼러 밸류 글라스')


    // let nav = document.getElementById('navigator')
    // nav.style.display = 'none'



    document.getElementById('inputForm').addEventListener('submit', function (e) {
        e.preventDefault();
        items = []

    });

})