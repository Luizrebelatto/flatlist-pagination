const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

let ITEMS = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `Item ${i + 1}`,
  createdAt: Date.now() - i * 1000,
}));

app.get("/items", (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const sorted = [...ITEMS].sort((a, b) => b.createdAt - a.createdAt);

  const start = (page - 1) * limit;
  const end = start + limit;

  const data = sorted.slice(start, end);

  res.json({
    data,
    page,
    limit,
    totalItems: ITEMS.length,
    totalPages: Math.ceil(ITEMS.length / limit),
  });
});

app.get("/items-offset", (req, res) => {
  const offset = Number(req.query.offset) || 0;
  const limit = Number(req.query.limit) || 10;

  const sorted = [...ITEMS].sort((a, b) => b.createdAt - a.createdAt);

  const start = offset;
  const end = start + limit;

  const data = sorted.slice(start, end);
  const hasMore = end < ITEMS.length;

  res.json({
    data,
    offset,
    limit,
    totalItems: ITEMS.length,
    hasMore,
  });
});

app.listen(3000, () => {
  console.log("API running http://localhost:3000");
});
