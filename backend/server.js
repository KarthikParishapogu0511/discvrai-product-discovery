require("dotenv").config();
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const products = require("./product");

const app = express();

app.use(express.json());
app.use(cors());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/* Root */
app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

/* Get products */
app.get("/api/products", (req, res) => {
  res.json(products);
});

/* Smart Fallback Function */
function fallbackSearch(query) {
  const lower = query.toLowerCase();

  // Cheap / budget logic
  if (lower.includes("cheap") || lower.includes("budget")) {
    const cheapProducts = products.filter(p => p.price < 600);
    return {
      products: cheapProducts,
      summary: "Showing affordable products based on your request."
    };
  }

  // Keyword match
  const matched = products.filter(p =>
    p.name.toLowerCase().includes(lower) ||
    p.category.toLowerCase().includes(lower) ||
    p.description.toLowerCase().includes(lower)
  );

  return {
    products: matched,
    summary: matched.length
      ? "Showing products matching your request."
      : "No matching products found."
  };
}

/* LLM + Fallback Route */
app.post("/api/ask", async (req, res) => {
  const query = req.body?.query;

  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    const productContext = products.map(p =>
      `${p.id}: ${p.name}, ${p.category}, $${p.price}, ${p.description}`
    ).join("\n");

    const prompt = `
You are a product recommendation assistant.

User query:
"${query}"

Available products:
${productContext}

Return ONLY valid JSON:
{
  "productIds": ["P1", "P2"],
  "summary": "Short explanation"
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2
    });

    const aiText = completion.choices[0].message.content;

    let parsed;
    try {
      parsed = JSON.parse(aiText);
    } catch {
      console.log("LLM returned invalid JSON. Using fallback.");
      return res.json(fallbackSearch(query));
    }

    const matchedProducts = products.filter(p =>
      parsed.productIds.includes(p.id)
    );

    return res.json({
      products: matchedProducts,
      summary: parsed.summary
    });

  } catch (error) {
    console.log("OpenAI failed. Using fallback.");
    return res.json(fallbackSearch(query));
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});