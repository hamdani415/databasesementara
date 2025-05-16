const express = require('express')
const app = express()
const port = 3000
const { Pool } = require('pg')
require('dotenv').config()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

app.post('/users', async (req, res) => {
  const { name, email } = req.body
  try {
    const result = await pool.query(`
      INSERT INTO users (name , email) VALUES ($1 , $2) RETURNING *` , [name, email])
    res.json(result.rows[0])
  } catch (error) {
    req.statusCode(500).json({ error: error.message })
  }
})

app.post('/list', async (req, res) => {
  const { email, pekerjaan, status, hari } = req.body
  try {
    const result = await pool.query(
      'INSERT INTO list (email , pekerjaan , status , hari) VALUES ($1 , $2 , $3 , $4 ) RETURNING *',
      [email, pekerjaan, status, hari])
    res.json(result.rows[0])
  } catch (error) {
    req.statusCode(500).json({ error: error.message })
  }
})

app.get("/list", async (req, res) => {
  const result = await pool.query('SELECT * FROM list ')
  res.json({
    colums: ['id', "hari", "pekerjaan", "status", 'email'],
    data: result.rows,
    message: "success",
    statusCode: 200
  })
})

app.get("/list/:hari", async (req, res) => {
  const { hari } = req.params
  const result = await pool.query('SELECT * FROM list WHERE hari = $1', [hari])
  res.json({
    colums: ['id', "hari", "pekerjaan", "status", 'email'],
    data: result.rows,
    message: "success",
    statusCode: 200
  })
})

app.delete('/list/:id', async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query(
      'DELETE FROM list  WHERE id = $1',
      [id])
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Data not found' });
    }
    res.json({ message: 'Data deleted successfully' });
  } catch (error) {
    req.statusCode(500).json({ error: error.message })
  }
})

app.get('/users', async (req, res) => {
  const result = await pool.query('SELECT * FROM users')
  res.json(result.rows)
})

app.get('/huhu', (req, res) => {
  res.send('huhauhauahu')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

