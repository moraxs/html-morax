const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // 获取请求的文件路径
  const filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);

  // 检查文件是否存在
  fs.exists(filePath, (exists) => {
    if (exists) {
      // 如果文件存在，读取文件并发送响应
      fs.readFile(filePath, (error, content) => {
        if (error) {
          res.writeHead(500);
          res.end('Internal Server Error');
        } else {
          // 根据文件类型设置响应头
          const contentType = path.extname(filePath) === '.html' ? 'text/html' : 'text/plain';
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(content, 'utf-8');
        }
      });
    } else {
      // 如果文件不存在，发送 404 响应
      res.writeHead(404);
      res.end('File Not Found');
    }
  });
});

const port = 3001;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
