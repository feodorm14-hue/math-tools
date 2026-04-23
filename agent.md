# agent.md — AI Agent Instructions for MATHS_INSTRUMENTS

This file tells an AI coding agent (Claude, Copilot, Cursor, etc.) the rules, constraints, and architecture decisions for this project. Read this before making any changes.

---

## Project identity

**Name:** MATHS_INSTRUMENTS
**Type:** Math toolkit — formula browser, expression evaluator, calculators
**Scale:** Personal / educational
**Status:** Concept phase

---

## Hard rules (never break these)

1. **No Phaser.** This is not a game. Do not install or import Phaser or any game engine.
2. **Minimal HTML.** The frontend should be as thin as possible. No React, no Vue, no Angular unless explicitly asked.
3. **No unnecessary dependencies.** Every library must earn its place. Ask before adding a new one.
4. **Language:** TypeScript preferred for frontend. Backend is either Python or TypeScript — see decision below.
5. **No auth system** unless explicitly requested.
6. **SQLite only** for local storage. No Postgres, no MongoDB, no cloud DB for now.

---

## Architecture decision (pending)

The backend language has not been finalized. Here are the two paths:

### Path A — Python backend

Trigger: if symbolic math is needed (derivatives, integrals, equation solving, simplification).

- Framework: `FastAPI`
- Math: `sympy`, `numpy`, `scipy`
- DB: `SQLite` via `sqlite3` or `SQLModel`
- Run: `uvicorn main:app --reload`

When building a Python endpoint, follow this pattern:
```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class ExprInput(BaseModel):
    expression: str
    variable: str = "x"

@app.post("/differentiate")
def differentiate(body: ExprInput):
    from sympy import symbols, diff, sympify
    x = symbols(body.variable)
    result = diff(sympify(body.expression), x)
    return {"result": str(result), "latex": latex(result)}
```

### Path B — TypeScript/Node backend

Trigger: if an expression evaluator is enough (no symbolic algebra needed).

- Framework: `Hono` (fast, lightweight) or `Express`
- Math: `mathjs`
- DB: `better-sqlite3`
- Validation: `zod`
- Run: `npx ts-node src/index.ts` or compiled with `tsc`

When building a TS endpoint, follow this pattern:
```typescript
import { Hono } from 'hono'
import { create, all } from 'mathjs'

const math = create(all)
const app = new Hono()

app.post('/evaluate', async (c) => {
  const { expr, scope } = await c.req.json()
  try {
    const result = math.evaluate(expr, scope ?? {})
    return c.json({ result: String(result) })
  } catch (e) {
    return c.json({ error: String(e) }, 400)
  }
})
```

---

## Module map

These are the calculators/tools planned. Build them as separate route files.

| Module | Description | Complexity |
|--------|-------------|------------|
| `evaluate` | Parse and compute any math expression | Low |
| `algebra` | Solve equations (linear, quadratic, systems) | Medium |
| `calculus` | Derivatives, integrals (Python only) | High |
| `matrices` | Matrix ops: multiply, inverse, determinant | Medium |
| `formulas` | Store and retrieve LaTeX formula strings | Low |
| `converter` | Unit conversions (meters, kg, etc.) | Low |
| `stats` | Mean, median, std dev, distributions | Medium |

Start with `evaluate` and `formulas`. Add others incrementally.

---

## Frontend rules

- Entry point: `frontend/index.html`
- Script: `frontend/app.ts` — compiled to `app.js`
- Styles: plain CSS or a single utility stylesheet (e.g. minimal Pico CSS)
- Math rendering: use **MathJax** or **KaTeX** for displaying formulas
- No build tool complexity — use `esbuild` one-liner:
  ```bash
  esbuild frontend/app.ts --bundle --outfile=frontend/app.js
  ```
- API calls from frontend: use `fetch()` — no Axios unless justified

---

## File/folder conventions

```
backend/
  main.py or index.ts     ← app entry point
  routes/
    evaluate.py/.ts
    algebra.py/.ts
    formulas.py/.ts
  db/
    schema.sql            ← table definitions
    store.db              ← generated, gitignored
  tests/
    test_evaluate.py/.ts

frontend/
  index.html
  app.ts
  style.css

agent.md                  ← you are here
README.md                 ← project overview
```

---

## What to do when stuck on backend choice

Run this checklist:

1. Does the feature require symbolic manipulation (simplify, derive, integrate)?
   → **Use Python**

2. Is it just evaluating an expression with numbers?
   → **Use TypeScript + mathjs**

3. Are you building a new module from scratch?
   → Add it to the module map above first, then implement

4. Want to add a new dependency?
   → Check if `mathjs` (TS) or `sympy/scipy` (Python) already covers it

---

## Out of scope (do not implement)

- User authentication / sessions
- Real-time collaboration
- Mobile app
- Game logic of any kind
- Phaser, Three.js (unless 3D graphing is explicitly requested later)
- Cloud hosting setup (handle locally first)
