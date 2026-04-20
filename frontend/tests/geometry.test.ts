import { describe, it, expect } from "vitest"

const PI = Math.PI

// ── Вспомогательные функции ───────────────────────────────────────────────────

function circle(r: number)         { return { area: PI * r ** 2, circumference: 2 * PI * r } }
function rectangle(a: number, b: number) { return { area: a * b, perimeter: 2 * (a + b) } }
function square(a: number)         { return { area: a ** 2, perimeter: 4 * a } }
function triangle(a: number, h: number)  { return { area: (a * h) / 2 } }
function trapezoid(a: number, b: number, h: number) { return { area: ((a + b) / 2) * h } }
function parallelogram(a: number, h: number) { return { area: a * h } }

function pythagoras(a?: number, b?: number, c?: number) {
  if (a && b) return { c: Math.sqrt(a ** 2 + b ** 2) }
  if (c && a) return { b: Math.sqrt(c ** 2 - a ** 2) }
  if (c && b) return { a: Math.sqrt(c ** 2 - b ** 2) }
  throw new Error("Нужно два значения")
}

function cube(a: number)         { return { volume: a ** 3, surface_area: 6 * a ** 2 } }
function box(a: number, b: number, c: number) {
  return { volume: a * b * c, surface_area: 2 * (a*b + b*c + a*c) }
}
function cylinder(r: number, h: number) {
  return { volume: PI * r ** 2 * h, surface_area: 2 * PI * r * (r + h) }
}
function cone(r: number, h: number) {
  const l = Math.sqrt(r ** 2 + h ** 2)
  return { volume: (1/3) * PI * r ** 2 * h, surface_area: PI * r * (r + l) }
}
function pyramid(base_area: number, h: number) {
  return { volume: (1/3) * base_area * h }
}

// ── Тесты ─────────────────────────────────────────────────────────────────────

describe("Теорема Пифагора", () => {
  it("a=3, b=4 → c=5", () => {
    expect(pythagoras(3, 4).c).toBeCloseTo(5, 5)
  })

  it("c=10, a=6 → b=8", () => {
    expect((pythagoras(6, undefined, 10) as any).b).toBeCloseTo(8, 5)
  })

  it("c=13, b=5 → a=12", () => {
    expect((pythagoras(undefined, 5, 13) as any).a).toBeCloseTo(12, 5)
  })
})

describe("Круг", () => {
  it("r=5: площадь ≈ 78.54", () => {
    expect(circle(5).area).toBeCloseTo(78.5398, 3)
  })

  it("r=1: длина окружности ≈ 6.2832", () => {
    expect(circle(1).circumference).toBeCloseTo(6.2832, 3)
  })
})

describe("Прямоугольник", () => {
  it("a=4, b=6: S=24, P=20", () => {
    const r = rectangle(4, 6)
    expect(r.area).toBe(24)
    expect(r.perimeter).toBe(20)
  })
})

describe("Квадрат", () => {
  it("a=5: S=25, P=20", () => {
    const r = square(5)
    expect(r.area).toBe(25)
    expect(r.perimeter).toBe(20)
  })
})

describe("Треугольник", () => {
  it("a=6, h=4: S=12", () => {
    expect(triangle(6, 4).area).toBe(12)
  })
})

describe("Трапеция", () => {
  it("a=8, b=5, h=4: S=26", () => {
    expect(trapezoid(8, 5, 4).area).toBe(26)
  })
})

describe("Параллелограмм", () => {
  it("a=7, h=3: S=21", () => {
    expect(parallelogram(7, 3).area).toBe(21)
  })
})

describe("Куб", () => {
  it("a=3: V=27, S_пов=54", () => {
    const r = cube(3)
    expect(r.volume).toBe(27)
    expect(r.surface_area).toBe(54)
  })
})

describe("Прямоугольный параллелепипед", () => {
  it("a=2, b=3, c=4: V=24", () => {
    expect(box(2, 3, 4).volume).toBe(24)
  })

  it("a=2, b=3, c=4: S_пов=52", () => {
    expect(box(2, 3, 4).surface_area).toBe(52)
  })
})

describe("Цилиндр", () => {
  it("r=3, h=5: V ≈ 141.37", () => {
    expect(cylinder(3, 5).volume).toBeCloseTo(141.3717, 2)
  })
})

describe("Конус", () => {
  it("r=3, h=4: V ≈ 37.7", () => {
    expect(cone(3, 4).volume).toBeCloseTo(37.699, 2)
  })

  it("r=3, h=4: образующая = 5", () => {
    // sqrt(3²+4²) = 5
    const l = Math.sqrt(3 ** 2 + 4 ** 2)
    expect(l).toBeCloseTo(5, 5)
  })
})

describe("Пирамида", () => {
  it("S=16, h=6: V=32", () => {
    expect(pyramid(16, 6).volume).toBeCloseTo(32, 5)
  })
})
