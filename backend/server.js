import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// -------------------- MongoDB Connection --------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

// -------------------- Schema --------------------
const expenseSchema = new mongoose.Schema({
  month: String,
  day: Number,
  amount: Number,
  description: String,
});


const Expense = mongoose.model("Expense", expenseSchema);

// -------------------- Routes --------------------

// Add expense
app.post("/expense", async (req, res) => {
  const expense = new Expense(req.body);
  await expense.save();
  res.json({ message: "Expense saved" });
});

// Get all expenses
app.get("/expenses", async (req, res) => {
  const expenses = await Expense.find();
  res.json(expenses);
});

// -------------------- Server --------------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
