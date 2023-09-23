import express from "express";
import AccountService from "./AccountService";

export const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const accountService = new AccountService();

app.post("/signup", async (req, res) => {
  const data = req.body;
  console.log(req.body);
  const output = await accountService.signup(data);
  res.status(200).json(output);
});

app.get("/accounts/:id", async (req, res) => {
  const output = await accountService.getAccount(req.params.id);
  return res.status(200).json(output);
});

app.listen(3000);
