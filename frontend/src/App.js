import { useEffect, useState } from "react";

function App() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [summary, setSummary] = useState("");

  // Load products when page loads
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, []);

  const handleAsk = async () => {
    const res = await fetch("http://localhost:5000/api/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query })
    });

    const data = await res.json();

    setProducts(data.products || []);
    setSummary(data.summary || "");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Product Discovery</h1>

      <input
        type="text"
        placeholder="Ask about products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: "8px", width: "300px" }}
      />
      <button onClick={handleAsk} style={{ marginLeft: "10px" }}>
        Ask
      </button>

      {summary && (
        <p>
          <strong>AI Summary:</strong> {summary}
        </p>
      )}

      <div>
        {products.map(product => (
          <div
            key={product.id}
            style={{
              border: "1px solid gray",
              padding: "10px",
              margin: "10px 0"
            }}
          >
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p><strong>${product.price}</strong></p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;