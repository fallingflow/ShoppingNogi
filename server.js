const express = require('express'); // 라이브러리 첨부
const axios = require('axios');
const mysql = require('mysql2/promise');
const cors = require('cors');

const corsOptions = {
    // origin: "https://fallingflow.github.io/ShoppingNogi-web/"
    origin: "*"
}

const app = express(); // 라이브러리 객체 생성
app.use(cors(corsOptions));

const port = 8080;
app.use(express.static('templates/public'));

const dbConfig = {
    host: 'database-1.cxcoqs8g05ik.us-east-2.rds.amazonaws.com',
    // host: 'localhost',
    port: 3306,
    user: 'admin',
    // user: 'root',
    password: 'wkddbwls97912',
    database: 'ShoppingNogi'
};

const APIKEY = 'test_3aea5b595556584ab54c0245a7e2a9ea6147d1642ba5988c6308cf189a253d7cefe8d04e6d233bd35cf2fabdeb93fb0d'
const URL = '';


app.listen(port, function(){
    console.log('listening on 8080')
}) // 서버 오픈

app.get('/', function(req, res){
    res.sendFile('/templates/main.html', {root: __dirname})
})

async function fetchAndStoreAuctionHistory(category) {
    try {
        const connection = await mysql.createConnection(dbConfig);
        // 현재로부터 1일 내의 데이터만 유지
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ');

        await connection.execute(`
            DELETE item_option FROM item_option
            JOIN item ON item_option.item_id = item.item_id
            JOIN auction_history_desc ON item.item_id = auction_history_desc.item_id
            JOIN auction_history ON auction_history_desc.auction_buy_id = auction_history.auction_buy_id
            WHERE auction_history.date_auction_buy < ?
        `, [oneDayAgo]);

        await connection.execute(`
            DELETE auction_history_desc FROM auction_history_desc
            JOIN auction_history ON auction_history_desc.auction_buy_id = auction_history.auction_buy_id
            WHERE auction_history.date_auction_buy < ?
        `, [oneDayAgo]);

        await connection.execute(`
            DELETE item FROM item
            JOIN auction_history_desc ON item.item_id = auction_history_desc.item_id
            JOIN auction_history ON auction_history_desc.auction_buy_id = auction_history.auction_buy_id
            WHERE auction_history.date_auction_buy < ?
        `, [oneDayAgo]);

        await connection.execute(`
            DELETE FROM auction_history
            WHERE date_auction_buy < ?
        `, [oneDayAgo]);

        // Fetch data from the API (no parameters needed)
        const response = await axios.get('https://open.api.nexon.com/mabinogi/v1/auction/history?auction_item_category='+category, {
            headers:{
                "x-nxopen-api-key": APIKEY
            }
        });

        // category: category_name 중복확인 O, id는 자동증가
        const [existingCategory] = await connection.execute(
            'SELECT COUNT(*) AS count FROM category WHERE category_name = ?',
            [category]
        );

        let category_id = 0;
        if (existingCategory[0].count === 0) {
            const [result] = await connection.execute(
                'INSERT INTO category (category_name) VALUES (?)',
                [category]
            );
            category_id = result.insertId;
            // console.log(`Inserted category_name:${category}`);
        } else {
            const [rows] = await connection.execute(
                'SELECT category_id FROM category WHERE category_name = ?',
                [category]
            );
            category_id = rows[0].category_id; // 기존 category_id 가져오
            // console.log(`Skipped duplicate category_name: ${category}`);
        }

        // auction_history: 가져온 레코드를 반복, 중복확인 O
        for (const record of response.data.auction_history) {
            const { auction_buy_id, item_name, item_display_name, item_count, auction_price_per_unit, date_auction_buy, item_option } = record;

            // auction_buy_id가 데이터베이스에 이미 존재하는지 확인
            const [existing] = await connection.execute(
                'SELECT COUNT(*) AS count FROM auction_history WHERE auction_buy_id = ?',
                [auction_buy_id]
            );

            if (existing[0].count === 0) {
                // 존재하지 않으면 레코드 삽입
                await connection.execute(
                    'INSERT INTO auction_history (auction_buy_id, date_auction_buy) VALUES (?, ?)',
                    [auction_buy_id, date_auction_buy]
                );
                // console.log(`Inserted auction_buy_id: ${auction_buy_id}`);

                const [itemResult] = await connection.execute(
                    'INSERT INTO item (category_id, item_name, item_display_name) VALUES (?, ?, ?)',
                    [category_id, item_name, item_display_name]
                );
                const item_id = itemResult.insertId;

                await connection.execute(
                    'INSERT INTO auction_history_desc (item_id, auction_buy_id, auction_price_per_unit, item_count) VALUES (?, ?, ?, ?)',
                    [item_id, auction_buy_id, auction_price_per_unit, item_count]
                );

                for (const option of record.item_option){
                    const {option_type, option_sub_type, option_value, option_value2, option_desc} = option;

                    await connection.execute(
                        'INSERT INTO item_option (item_id, option_type, option_sub_type, option_value, option_value2, option_desc) VALUES (?, ?, ?, ?, ?, ?)',
                        [item_id, option_type, option_sub_type, option_value, option_value2, option_desc]
                    );
                }

                // console.log(`Inserted item: ${item_name}`);
            } else {
                // console.log(`Skipped duplicate auction_buy_id: ${auction_buy_id}`);
            }
        }

        // 데이터베이스 연결 종료
        await connection.end();
    } catch (error) {
        console.error('Error during fetch and store operation:', error);
    }
}

// 3시간마다 데이터베이스 업데이트
setInterval(fetchAuctionHistoryAllCategory, 10800000);

function fetchAuctionHistoryAllCategory(){
    const category = ['한손 장비', '양손 장비','검','도끼','둔기','랜스','핸들','너클','체인 블레이드','활','석궁','듀얼건','수리검','원거리 소모품','실린더','스태프','원드','마도서','오브','중갑옷','경갑옷','천옷','장갑','신발','모자/가발','방패','로브','얼굴 장식','액세서리','날개','꼬리','악기','생활 도구','에코스톤','인챈트 스크롤','뷰티 쿠폰']
    for (const c of category){
        fetchAndStoreAuctionHistory(c);
    }
}

fetchAuctionHistoryAllCategory()


/******************************************************/
app.get('/api/sales/:name', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [results] = await connection.execute(
            `SELECT item.*, item_option.*, auction_history.date_auction_buy, auction_history_desc.auction_price_per_unit, auction_history_desc.item_count
             FROM item
             JOIN item_option ON item.item_id = item_option.item_id
             JOIN auction_history_desc ON item.item_id = auction_history_desc.item_id
             JOIN auction_history ON auction_history_desc.auction_buy_id = auction_history.auction_buy_id
             WHERE item.item_name = ?
             ORDER BY auction_history.date_auction_buy DESC`,
            [req.params.name]
        );

        const result = results.reduce((acc, item) => {
            let existingItem = acc.find(i => i.item_id === item.item_id);
            if (!existingItem) {
                existingItem = {
                    item_id: item.item_id,
                    category_id: item.category_id,
                    item_name: item.item_name,
                    item_display_name: item.item_display_name,
                    date_auction_buy: item.date_auction_buy,
                    auction_price_per_unit: item.auction_price_per_unit,
                    item_count: item.item_count,
                    item_option: []
                };
                acc.push(existingItem);
            }
            existingItem.item_option.push({
                option_type: item.option_type,
                option_sub_type: item.option_sub_type,
                option_value: item.option_value,
                option_value2: item.option_value2,
                option_desc: item.option_desc
            });
            return acc;
        }, []);

        res.send(result);
        await connection.end();
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

