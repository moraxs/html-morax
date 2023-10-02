const http = require('http');
const cors = require('cors'); // 引入cors包

const server = http.createServer((req, res) => {
  // 添加cors中间件，允许所有跨域请求
  cors()(req, res, () => {
    const url = req.url;
    let uid;
    let max;

    // 解析URL以获取UID
    const match = url.match(/^\/(\d+)$/);
    if (match) {
      uid = parseInt(match[1]);
      max = 890000 + uid;
    } else {
      res.statusCode = 400;
      res.end('Invalid URL');
      return;
    }

    // 构建JSON响应
    const jsonResponse = JSON.stringify({ UID: uid, MAX: max });

    // 设置响应头
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;

    // 发送JSON响应
    res.end(jsonResponse);
  });
});

const port = 3002;
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
