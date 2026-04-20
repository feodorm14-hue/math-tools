import { describe, it, expect } from "vitest"

// ── Вспомогательные функции (дублируют логику бэкенда на TS) ─────────────────

function fractionCalc(n1: number, d1: number, n2: number, d2: number, op: string) {
  function gcd(a: number, b: number): number { return b === 0 ? Math.abs(a) : gcd(b, a % b) }
  function simplify(n: number, d: number) {
    const g = gcd(Math.abs(n), Math.abs(d))
    if (d < 0) { n = -n; d = -d }
    return { n: n / g, d: d / g }
  }
  let rn: number, rd: number
  if (op === "+") { rn = n1 * d2 + n2 * d1; rd = d1 * d2 }
  else if (op === "-") { rn = n1 * d2 - n2 * d1; rd = d1 * d2 }
  else if (op === "*") { rn = n1 * n2; rd = d1 * d2 }
  else { rn = n1 * d2; rd = d1 * n2 } // "/"
  return simplify(rn, rd)
}

function percentOf(pct: number, total: number) {
  return (pct / 100) * total
}

function whatPercent(value: number, total: number) {
  return (value / total) * 100
}

function gcd(numbers: number[]): number {
  function g(a: number, b: number): number { return b === 0 ? a : g(b, a % b) }
  return numbers.reduce(g)
}

function lcm(numbers: number[]): number {
  function l(a: number, b: number): number { return Math.abs(a * b) / gcd([a, b]) }
  return numbers.reduce(l)
}

function power(base: number, exp: number) {
  return base ** exp
}

function stats(numbers: number[]) {
  const sorted = [...numbers].sort((a, b) => a - b)
  const n = sorted.length
  const mean = sorted.reduce((s, x) => s + x, 0) / n
  const median = n % 2 !== 0
    ? sorted[Math.floor(n / 2)]
    : (sorted[n / 2 - 1] + sorted[n / 2]) / 2
  const freq = new Map<number, number>()
  for (const x of sorted) freq.set(x, (freq.get(x) ?? 0) + 1)
  const maxFreq = Math.max(...freq.values())
  const mode = [...freq.entries()].filter(([, v]) => v === maxFreq).map(([k]) => k)
  return { mean, median, mode, spread: sorted[n - 1] - sorted[0] }
}

// ── Тесты ─────────────────────────────────────────────────────────────────────

describe("Дроби", () => {
  it("1/2 + 1/3 = 5/6", () => {
    const r = fractionCalc(1, 2, 1, 3, "+")
    expect(r.n).toBe(5)
    expect(r.d).toBe(6)
  })

  it("2/3 + 3/4 = 17/12", () => {
    const r = fractionCalc(2, 3, 3, 4, "+")
    expect(r.n).toBe(17)
    expect(r.d).toBe(12)
  })

  it("3/4 - 1/4 = 1/2", () => {
    const r = fractionCalc(3, 4, 1, 4, "-")
    expect(r.n).toBe(1)
    expect(r.d).toBe(2)
  })

  it("2/3 * 3/4 = 1/2", () => {
    const r = fractionCalc(2, 3, 3, 4, "*")
    expect(r.n).toBe(1)
    expect(r.d).toBe(2)
  })

  it("1/2 / 1/4 = 2/1", () => {
    const r = fractionCalc(1, 2, 1, 4, "/")
    expect(r.n).toBe(2)
    expect(r.d).toBe(1)
  })
})

describe("Проценты", () => {
  it("25% от 200 = 50", () => {
    expect(percentOf(25, 200)).toBe(50)
  })

  it("10% от 80 = 8", () => {
    expect(percentOf(10, 80)).toBe(8)
  })

  it("45 — это 25% от 180", () => {
    expect(whatPercent(45, 180)).toBe(25)
  })

  it("50 — это 50% от 100", () => {
    expect(whatPercent(50, 100)).toBe(50)
  })
})

describe("НОД", () => {
  it("НОД(48, 36) = 12", () => {
    expect(gcd([48, 36])).toBe(12)
  })

  it("НОД(100, 75) = 25", () => {
    expect(gcd([100, 75])).toBe(25)
  })

  it("НОД(7, 13) = 1 (взаимно простые)", () => {
    expect(gcd([7, 13])).toBe(1)
  })
})

describe("НОК", () => {
  it("НОК(4, 6) = 12", () => {
    expect(lcm([4, 6])).toBe(12)
  })

  it("НОК(3, 5) = 15", () => {
    expect(lcm([3, 5])).toBe(15)
  })
})

describe("Степени и корни", () => {
  it("2^10 = 1024", () => {
    expect(power(2, 10)).toBe(1024)
  })

  it("sqrt(144) = 12", () => {
    expect(power(144, 0.5)).toBe(12)
  })

  it("cbrt(27) ≈ 3", () => {
    expect(power(27, 1 / 3)).toBeCloseTo(3, 5)
  })

  it("3^0 = 1", () => {
    expect(power(3, 0)).toBe(1)
  })
})

describe("Статистика", () => {
  it("среднее [4,8,6,5,3,2,8,9,2,5] = 5.2", () => {
    const r = stats([4, 8, 6, 5, 3, 2, 8, 9, 2, 5])
    expect(r.mean).toBeCloseTo(5.2)
  })

  it("медиана [1,2,3,4,5] = 3", () => {
    expect(stats([1, 2, 3, 4, 5]).median).toBe(3)
  })

  it("медиана [1,2,3,4] = 2.5", () => {
    expect(stats([1, 2, 3, 4]).median).toBe(2.5)
  })

  it("размах [2,5,8,9] = 7", () => {
    expect(stats([2, 5, 8, 9]).spread).toBe(7)
  })
})
