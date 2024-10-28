const express = require('express');
const { createProxyMiddleware, responseInterceptor } = require('http-proxy-middleware');
const Jimp = require('jimp');
const app = express();

// CORS 헤더 추가
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// 이미지 처리 함수
const imageProcessingMiddleware = responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
    const imageTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];
    if (imageTypes.includes(proxyRes.headers['content-type'])) {
        try {
            console.log('이미지 처리 시작...');
            const image = await Jimp.read(responseBuffer);
            image.flip(true, false).sepia().pixelate(5);
            const buffer = await image.getBufferAsync(Jimp.AUTO);
            console.log('이미지 처리 완료');
            return buffer;
        } catch (err) {
            console.error('이미지 처리 오류: ', err);
            return responseBuffer;
        }
    }
    return responseBuffer;
});

// 첫 번째 프록시 미들웨어 설정 (test1)
app.use('/test1', createProxyMiddleware({
    target: 'https://skson-dashboard.vercel.app',
    changeOrigin: true,
    selfHandleResponse: true,
    timeout: 60000, // 60초로 설정
    proxyTimeout: 60000,
    onProxyRes: imageProcessingMiddleware
}));

// 두 번째 프록시 미들웨어 설정 (test2)
app.use('/test2', createProxyMiddleware({
    target: 'https://github.com/skson0x6ab/',
    changeOrigin: true,
    selfHandleResponse: true,
    timeout: 60000, // 60초로 설정
    proxyTimeout: 60000,
    onProxyRes: imageProcessingMiddleware
}));

app.listen(5000, () => {
    console.log('프록시 서버가 http://localhost:5000 에서 실행 중입니다.');
});