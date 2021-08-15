
const pool = require('./utils/db')
const WebSocket = require('ws')
const express = require('express')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 5000
app.use(cors())

app.get('/', (req, res) => {
    res.status(200).json({ message: "BTCUSDT Binnace CandleSticks" })
})

app.get('/retrieve', async (req, res) => {
    try {
        const btcusdt = await pool.query('SELECT * FROM btcusdt')
        res.status(200).json(btcusdt.rows)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

app.get('/retrieve/onehour', async (req, res) => {
    try {
        const date = new Date();
        let hour = date.getUTCHours();
        if (hour < 1) hour += 24
        const target_hour = hour - 1;
        const btcusdt = await pool.query(`SELECT * FROM btcusdt WHERE utc_hour = ${target_hour}`)
        res.status(200).json(btcusdt.rows)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})
app.get('/retrieve/twohour', async (req, res) => {
    try {
        const date = new Date();
        let hour = date.getUTCHours();
        if (hour < 2) hour += 24;
        const target_hour = hour - 2;
        const btcusdt = await pool.query(`SELECT * FROM btcusdt WHERE utc_hour = ${target_hour}`)
        res.status(200).json(btcusdt.rows)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

app.get('/retrieve/threehour', async (req, res) => {
    try {
        const date = new Date();
        let hour = date.getUTCHours();
        if (hour < 3) hour += 24;
        const target_hour = hour - 3;
        const btcusdt = await pool.query(`SELECT * FROM btcusdt WHERE utc_hour = ${target_hour}`)
        res.status(200).json(btcusdt.rows)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})


app.listen(port)



const deleteOld = async (H) => {
    try {
        let hour = H;
        if (H < 4) hour += 24;
        let target_hour = hour - 4;
        await pool.query(`DELETE FROM btcusdt WHERE utc_hour = ${target_hour}`)
    } catch (error) {
        console.log({ message: error.message });
    }
}



const insertNew = async ({ event_time, utc_hour, kline_time, open_price, close_price, high_price, low_price, volume }) => {
    try {
        const stick = await pool.query(`INSERT INTO btcusdt(event_time, utc_hour, kline_time, open_price, close_price, high_price, low_price, volume) VALUES ('${event_time}', ${utc_hour}, ${kline_time}, '${open_price}', '${close_price}', '${high_price}', '${low_price}', '${volume}') RETURNING *`)
        // console.log(JSON.stringify(stick.rows[0]));
    } catch (error) {
        console.log({ message: error.message });
    }
}


const btc = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@kline_5m')
btc.onmessage = e => {
    const { E, k } = JSON.parse(e['data'])
    const d = new Date(E)
    const T = d.toString().split(' ')[4]
    const H = d.getUTCHours()
    const M = d.getUTCMinutes()
    const S = d.getSeconds()
    const { t, o, c, h, l, v } = k;
    const stick = {
        event_time: T,
        utc_hour: H,
        kline_time: t,
        open_price: o,
        close_price: c,
        high_price: h,
        low_price: l,
        volume: v
    }
    if (M == 0 && S % 7 == 0) deleteOld(H)
    insertNew(stick)

}




