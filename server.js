const express = require('express');
const pgp = require('pg-promise')();
const app = express();
const port = 3004;

const cors = require('cors');
const dbConfig = {
  user: 'admin',
  host: 'localhost',
  database: 'testsql',
  password: 'qwaszx1233',
  port: 5432,
};

const db = pgp(dbConfig);

app.use(cors({
  origin: ['http://123.249.82.206:3001', 'http://123.249.82.206:3005'],
}));

app.use(express.json());

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS your_table (
    uid text PRIMARY KEY,
    max_value integer
  );
`;

db.none(createTableQuery)
  .then(() => {
    console.log('数据库表已创建或已存在');
  })
  .catch(error => {
    console.error('创建数据库表时出错：', error);
  });

app.post('/writeData', async (req, res) => {
  try {
    const { uid, max } = req.body;

    const insertQuery = `
      INSERT INTO your_table (uid, max_value) VALUES ($1, $2)
      ON CONFLICT (uid) DO UPDATE SET max_value = EXCLUDED.max_value
    `;

    await db.none(insertQuery, [uid, max]);

    res.status(200).send('数据写入成功');
  } catch (error) {
    console.error('写入数据时出错：', error);
    res.status(500).json({ error: '发生错误', message: error.message });
  }
});

app.get('/fetchData', async (req, res) => {
  try {
    const data = await db.any('SELECT uid, max_value FROM your_table');

    res.json(data);
  } catch (error) {
    console.error('获取数据时出错：', error);
    res.status(500).json({ error: '发生错误', message: error.message });
  }
});

app.listen(port, () => {
  console.log(`服务器已启动，监听端口 ${port}`);
});
