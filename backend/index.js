require("dotenv").config();

const db = require("./db");
const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

//  VALIDAÇÃO
const Joi = require("joi");

const userSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/),
});

//  REQUISIÇÕES
app.get("/", (req, res) => {
  try {
    res.json({ message: "Funcionando!" });
  } catch (error) {
    console.error(`Erro: ${error}`);
    res.sendStatus(500);
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await db.selectUsers();

    res.json(users);
  } catch (error) {
    console.error(`Erro: ${error}`);
    res.sendStatus(500);
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const user = await db.selectUser(req.params.id);

    res.json(user);
  } catch (error) {
    console.error(`Erro: ${error}`);
    res.sendStatus(500);
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    await db.deleteUser(req.params.id);

    res.sendStatus(204);
  } catch (error) {
    console.error(`Erro: ${error}`);
    res.sendStatus(500);
  }
});

app.post("/users", async (req, res) => {
  try {
    const validationResult = userSchema.validate(req.body);

    if (validationResult.error) {
      return res
        .status(400)
        .json({ error: validationResult.error.details[0].message });
    }

    await db.insertUser(req.body);

    res.sendStatus(201);
  } catch (error) {
    console.error(`Erro: ${error}`);
    res.sendStatus(500);
  }
});

app.patch("/users/:id", async (req, res) => {
  try {
    await db.updateUser(req.params.id, req.body);

    res.sendStatus(200);
  } catch (error) {
    console.error(`Erro: ${error}`);
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`API Rodando em - http://localhost:${port}`);
});
