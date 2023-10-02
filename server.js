const express = require('express');
const pgp = require('pg-promise')();
const app = express();
const port = 3004;

// 导入 cors 中间件
const cors = require('cors');

// PostgreSQL数据库连接配置
const dbConfig = {
  user: 'admin',
  host: 'localhost',
  database: 'testsql',
  password: 'qwaszx1233',
  port: 5432, // 默认PostgreSQL端口号
};

// 使用 pg-promise 创建一个数据库连接
const db = pgp(dbConfig);

// 启用 CORS 中间件并配置允许的来源为数组
app.use(cors({
  origin: ['http://123.249.82.206:3001', 'http://123.249.82.206:3005'], // 允许来自这两个来源的请求
}));

app.use(express.json());

// 定义数据库表的结构
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS your_table (
    uid text,
    max_value integer
  );
`;

// 创建数据库表（如果不存在）
db.none(createTableQuery)
  .then(() => {
    console.log('数据库表已创建或已存在');
  })
  .catch(error => {
    console.error('创建数据库表时出错：', error);
  });

// 处理POST请求，将数据写入数据库
app.post('/writeData', async (req, res) => {
  try {
    const { uid, max } = req.body;

    // 在此执行插入操作，将uid和max值写入数据库中
    const insertQuery = 'INSERT INTO your_table (uid, max_value) VALUES ($1, $2)';
    await db.none(insertQuery, [uid, max]);

    res.status(200).send('数据写入成功');
  } catch (error) {
    console.error(error);
    res.status(500).send('发生错误');
  }
});

// 新增一个路由来获取数据库中的数据
app.get('/fetchData', async (req, res) => {
  try {
    // 查询数据库中的数据
    const data = await db.any('SELECT uid, max_value FROM your_table');

    res.json(data); // 将查询结果以 JSON 格式返回给前端
  } catch (error) {
    console.error('获取数据时出错：', error);
    res.status(500).send('发生错误');
  }
});

app.listen(port, () => {
  console.log(`服务器已启动，监听端口 ${port}`);
});
