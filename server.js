
const express = require('express'); // 라이브러리 첨부
const app = express(); // 라이브러리 객체 생성

app.use(express.static('templates/public'));

app.listen(8080, function(){
    console.log('listening on 8080')
}) // 서버 오픈

app.get('/', function(req, res){
    res.sendFile('/templates/main.html', {root: __dirname})
})

app.get('/sales', function(req, res){
    res.sendFile('/templates/sales.html', {root: __dirname})
})