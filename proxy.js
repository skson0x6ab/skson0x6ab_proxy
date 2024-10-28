const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

// CORS 헤더 추가
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// 프록시 미들웨어 설정
app.use('/test1', createProxyMiddleware({
        target: 'https://skson-dashboard.vercel.app/#/dashboard',
        changeOrigin: true
    }));

app.use('/test2', createProxyMiddleware({
        target: 'https://github.com/skson0x6ab',
        changeOrigin: true
    }));

app.listen(5000, () => {
    console.log('프록시 서버가 http://localhost:5000 에서 실행 중입니다.');
});