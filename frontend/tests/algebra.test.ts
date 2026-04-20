import { describe, it, expect } from "vitest"

// ── Вспомогательные функции ───────────────────────────────────────────────────

function solveLinear(a: number, b: number, c: number) {
  // ax + b = c  →  x = (c - b) / a
  if (a === 0) throw new Error("a не может быть 0")
  return (c - b) / a
}

function solveQuadratic(a: number, b: number, c: number) {
  if (a === 0) throw new Error("a не может быть 0")
  const D = b ** 2 - 4 * a * c
  if (D < 0) return { roots: [], D }
  if (D === 0) return { roots: [-b / (2 * a)], D }
  const sq = Math.sqrt(D)
  return { roots: [(-b + sq) / (2 * a), (-b - sq) / (2 * a)], D }
}

function solveProportion(a: number, b: number, c: number) {
  // a/b = c/d  →  d = (b * c) / a
  if (a === 0) throw new Error("a не может быть 0")
  return (b * c) / a
}

// ── Тесты ─────────────────────────────────────────────────────────────────────

describe("Линейное уравнение ax + b = c", () => {
  it("2x + 3 = 11 → x = 4", () => {
    expect(solveLinear(2, 3, 11)).toBe(4)
  })

  it("5x - 10 = 0 → x = 2", () => {
    expect(solveLinear(5, -10, 0)).toBe(2)
  })

  it("x + 1 = 1 → x = 0", () => {
    expect(solveLinear(1, 1, 1)).toBe(0)
  })

  it("3x + 6 = 0 → x = -2", () => {
    expect(solveLinear(3, 6, 0)).toBe(-2)
  })

  it("a=0 → ошибка", () => {
    expect(() => solveLinear(0, 1, 2)).toThrow()
  })
})

describe("Квадратное уравнение ax² + bx + c = 0", () => {
  it("x² - 5x + 6 = 0 → корни 3 и 2", () => {
    const r = solveQuadratic(1, -5, 6)
    expect(r.roots).toHaveLength(2)
    expect(r.roots).toContain(3)
    expect(r.roots).toContain(2)
  })

  it("x² - 2x + 1 = 0 → один корень x=1 (D=0)", () => {
    const r = solveQuadratic(1, -2, 1)
    expect(r.D).toBe(0)
    expect(r.roots).toHaveLength(1)
    expect(r.roots[0]).toBeCloseTo(1)
  })

  it("x² + 1 = 0 → корней нет (D<0)", () => {
    const r = solveQuadratic(1, 0, 1)
    expect(r.D).toBeLessThan(0)
    expect(r.roots).toHaveLength(0)
  })

  it("2x² + 5x - 3 = 0 → корни 0.5 и -3", () => {
    const r = solveQuadratic(2, 5, -3)
    expect(r.roots).toHaveLength(2)
    const sorted = r.roots.sort((a, b) => a - b)
    expect(sorted[0]).toBeCloseTo(-3)
    expect(sorted[1]).toBeCloseTo(0.5)
  })

  it("a=0 → ошибка", () => {
    expect(() => solveQuadratic(0, 1, 2)).toThrow()
  })
})

describe("Пропорция a/b = c/d → найти d", () => {
  it("4/6 = x/9 → d = 6", () => {
    expect(solveProportion(4, 6, 9)).toBeCloseTo(13.5)
    // Правильная пропорция: 4/6 = 9/d → d = (6*9)/4 = 13.5
  })

  it("1/2 = 3/d → d = 6", () => {
    expect(solveProportion(1, 2, 3)).toBe(6)
  })

  it("3/4 = 6/d → d = 8", () => {
    expect(solveProportion(3, 4, 6)).toBe(8)
  })

  it("a=0 → ошибка", () => {
    expect(() => solveProportion(0, 5, 3)).toThrow()
  })
})

describe("Дискриминант D = b² - 4ac", () => {
  it("a=1, b=-5, c=6 → D=1", () => {
    const { D } = solveQuadratic(1, -5, 6)
    expect(D).toBe(1)
  })

  it("a=1, b=2, c=1 → D=0", () => {
    const { D } = solveQuadratic(1, 2, 1)
    expect(D).toBe(0)
  })

  it("a=1, b=0, c=4 → D=-16", () => {
    const { D } = solveQuadratic(1, 0, 4)
    expect(D).toBe(-16)
  })
})
