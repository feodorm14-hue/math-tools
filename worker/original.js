// Резервная копия воркера math-helper из Cloudflare (до защиты от prompt injection).
// Строки \uXXXX из собранного бандла раскодированы в обычный текст, логика не менялась.
// Не деплоить — актуальная версия в worker.js.

// src/index.js
var index_default = {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-Action"
    };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.headers.get("X-Action") === "upload") {
      const chunks = await request.json();
      const results = [];
      for (const chunk of chunks) {
        try {
          const emb = await env.AI.run("@cf/baai/bge-small-en-v1.5", { text: chunk.text.slice(0, 512) });
          await env.VECTORIZE.insert([{
            id: chunk.id,
            values: emb.data[0],
            metadata: { topic: chunk.metadata.topic, subtopic: chunk.metadata.subtopic, url: chunk.metadata.url, text: chunk.text.slice(0, 1e3) }
          }]);
          results.push({ id: chunk.id, ok: true });
        } catch (e) {
          results.push({ id: chunk.id, ok: false, error: e.message });
        }
      }
      return new Response(JSON.stringify({ total: chunks.length, ok: results.filter((r) => r.ok).length, errors: results.filter((r) => !r.ok) }), { headers: { "Content-Type": "application/json", ...cors } });
    }
    if (request.method === "GET") return new Response("Math Helper OK", { headers: cors });
    if (request.method !== "POST") return new Response("405", { status: 405 });
    try {
      const { question } = await request.json();
      if (!question) return new Response(JSON.stringify({ error: "no question" }), { status: 400, headers: cors });
      const emb = await env.AI.run("@cf/baai/bge-small-en-v1.5", { text: question });
      const search = await env.VECTORIZE.query(emb.data[0], { topK: 5, returnMetadata: "all" });
      const matches = search.matches || [];
      const context = matches.filter((m) => m.score > 0.3).map((m) => m.metadata?.text || "").filter(Boolean).join("\n\n---\n\n");
      const resp = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${env.DEEPSEEK_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "deepseek-chat",
          temperature: 0.3,
          messages: [
            {
              role: "system",
              content: context ? `Ты добрый учитель математики для учеников 5-7 класса. Отвечай на русском языке, пошагово, с примером, не более 150 слов. Пиши формулы простым текстом без LaTeX и без символов ( ) [ ]. Например: 5! = 5 × 4 × 3 × 2 × 1 = 120.

Используй эти материалы для ответа:
${context}` : `Ты добрый учитель математики для учеников 5-7 класса. Отвечай на русском языке, пошагово, с примером, не более 150 слов. Пиши формулы простым текстом без LaTeX и без символов ( ) [ ]. Например: 5! = 5 × 4 × 3 × 2 × 1 = 120.`
            },
            { role: "user", content: question }
          ],
          max_tokens: 600
        })
      });
      const data = await resp.json();
      const answer = data.choices?.[0]?.message?.content || "Не удалось получить ответ";
      const sources = matches.slice(0, 2).map((m) => m.metadata?.url).filter(Boolean);
      return new Response(JSON.stringify({ answer, sources }), { headers: { "Content-Type": "application/json", ...cors } });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json", ...cors } });
    }
  }
};
export {
  index_default as default
};
