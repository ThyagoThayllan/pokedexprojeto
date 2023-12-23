async function connect() {
  if (global.connection) return global.connection.connect();

  const { Pool } = require("pg");
  const pool = new Pool({
    connectionString: process.env.CONNECTION_STRING,
  });

  const client = await pool.connect();
  console.log("Criou pool de conexões no PostgreSQL!");

  const res = await client.query("SELECT NOW()");
  console.log(res.rows[0]);
  client.release();

  global.connection = pool;
  return pool.connect();
}

connect();

async function selectUsers() {
  const user = await connect();
  const res = await user.query("SELECT * FROM users ORDER BY id");

  return res.rows;
}

async function selectUser(id) {
  const user = await connect();
  const res = await user.query("SELECT * FROM users WHERE ID=$1", [id]);

  return res.rows;
}

async function deleteUser(id) {
  const user = await connect();

  return await user.query("DELETE FROM users WHERE id=$1", [id]);
}

async function insertUser(userInfo) {
  const user = await connect();
  const sql = "INSERT INTO users(username, password) VALUES ($1, $2);";
  const values = [userInfo.username, userInfo.password];

  return await user.query(sql, values);
}

async function updateUser(id, userInfo) {
  const user = await connect();
  const sql = "UPDATE users SET username=$1, password=$2 WHERE id=$3;";
  const values = [userInfo.username, userInfo.password, id];

  return await user.query(sql, values);
}

module.exports = {
  selectUser,
  selectUsers,
  deleteUser,
  insertUser,
  updateUser,
};
