const http = require('http');
const httpProxy = require('http-proxy');

// 프록시 서버 생성
const proxy = httpProxy.createProxyServer({});

// HTTP 서버 생성
const server = http.createServer((req, res) => {
    // 모든 요청을 프록시 처리
    if (req.url.startsWith('/page1')) {
        proxy.web(req, res, { target: 'https://skson-dashboard.vercel.app/#/stock/Stock' });
    } else if (req.url.startsWith('/page2')) {
        proxy.web(req, res, { target: 'https://skson-dashboard.vercel.app/#/dashboard' });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Page not found');
    }
});

console.log('프록시 서버가 http://localhost:8000 에서 실행 중입니다.');
server.listen(8000);