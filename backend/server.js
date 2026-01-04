import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

/* ---------- MIDDLEWARE ---------- */
app.use(cors());
app.use(express.json());

/* ---------- MONGODB ---------- */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  });

/* ---------- SCHEMA ---------- */
const expenseSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  month: String,
  day: Number,
  amount: { type: Number, required: true },
  description: String
}, { timestamps: true });

const Expense = mongoose.model("Expense", expenseSchema);

/* ---------- ROUTES ---------- */

// Health check (VERY IMPORTANT)
app.get("/", (req, res) => {
  res.send("🚀 Expense Tracker API is running");
});

// Add expense
app.post("/expense", async (req, res) => {
  const expense = await Expense.create(req.body);
  res.json(expense);
});

// Get all expenses
app.get("/expenses", async (req, res) => {
  const expenses = await Expense.find().sort({ date: -1 });
  res.json(expenses);
});

// Delete expense
app.delete("/expense/:id", async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

/* ---------- SERVER ---------- */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
