// ── Утилиты ──────────────────────────────────────────────────────────────────

function show(id: string, html: string, isError = false) {
  const el = document.getElementById(id)!
  el.innerHTML = html
  el.className = "result " + (isError ? "error" : "ok")
}

function val(id: string): number {
  return parseFloat((document.getElementById(id) as HTMLInputElement).value)
}
function str(id: string): string {
  return (document.getElementById(id) as HTMLInputElement).value
}

// ── Пропорция ─────────────────────────────────────────────────────────────────

;(window as any).solveProportion = () => {
  const a = val("pr-a"), b = val("pr-b"), c = val("pr-c")
  if (!a || !b || !c || a === 0) { show("pr-result", "Введи числа (a ≠ 0)", true); return }
  const d = +(b * c / a).toFixed(8)
  show("pr-result",
    `${a} / ${b} = ${c} / <b>${d}</b><br/>` +
    `Проверка: ${a} × ${d} = ${b} × ${c}`)
}

// ── Геометрия ─────────────────────────────────────────────────────────────────

;(window as any).solvePythagoras = () => {
  const aStr = (document.getElementById("py-a") as HTMLInputElement).value
  const bStr = (document.getElementById("py-b") as HTMLInputElement).value
  const cStr = (document.getElementById("py-c") as HTMLInputElement).value
  const a = aStr ? parseFloat(aStr) : null
  const b = bStr ? parseFloat(bStr) : null
  const c = cStr ? parseFloat(cStr) : null
  const empty = [a, b, c].filter(x => x === null).length
  if (empty !== 1) { show("py-result", "Введи ровно два значения, третье оставь пустым", true); return }
  if (c === null) {
    if (a! <= 0 || b! <= 0) { show("py-result", "Стороны должны быть > 0", true); return }
    const res = +Math.sqrt(a! ** 2 + b! ** 2).toFixed(8)
    show("py-result", `c = √(${a}² + ${b}²) = <b>${res}</b>`)
  } else if (b === null) {
    if (c! <= a!) { show("py-result", "Гипотенуза должна быть больше катета", true); return }
    const res = +Math.sqrt(c! ** 2 - a! ** 2).toFixed(8)
    show("py-result", `b = √(${c}² − ${a}²) = <b>${res}</b>`)
  } else {
    if (c! <= b!) { show("py-result", "Гипотенуза должна быть больше катета", true); return }
    const res = +Math.sqrt(c! ** 2 - b! ** 2).toFixed(8)
    show("py-result", `a = √(${c}² − ${b}²) = <b>${res}</b>`)
  }
}

;(window as any).solveCircle = () => {
  const r = val("ci-r")
  if (r <= 0) { show("ci-result", "Радиус должен быть > 0", true); return }
  const area = +(Math.PI * r ** 2).toFixed(6)
  const circ = +(2 * Math.PI * r).toFixed(6)
  show("ci-result",
    `Площадь S = <b>${area}</b><br/>` +
    `Длина окружности C = <b>${circ}</b>`)
}

;(window as any).solveRectangle = () => {
  const a = val("re-a"), b = val("re-b")
  show("re-result",
    `Площадь S = <b>${+(a * b).toFixed(6)}</b><br/>` +
    `Периметр P = <b>${+(2 * (a + b)).toFixed(6)}</b>`)
}

;(window as any).solveSquare = () => {
  const a = val("sq-a")
  show("sq-result",
    `Площадь S = <b>${+(a ** 2).toFixed(6)}</b><br/>` +
    `Периметр P = <b>${+(4 * a).toFixed(6)}</b>`)
}

;(window as any).solveTriangle = () => {
  const a = val("tr-a"), h = val("tr-h")
  show("tr-result", `Площадь S = <b>${+(a * h / 2).toFixed(6)}</b>`)
}

;(window as any).solveTrapezoid = () => {
  const a = val("tp-a"), b = val("tp-b"), h = val("tp-h")
  show("tp-result", `Площадь S = <b>${+((a + b) / 2 * h).toFixed(6)}</b>`)
}

;(window as any).solveParallelogram = () => {
  const a = val("pg-a"), h = val("pg-h")
  show("pg-result", `Площадь S = <b>${+(a * h).toFixed(6)}</b>`)
}

;(window as any).solveCylinder = () => {
  const r = val("cy-r"), h = val("cy-h")
  const volume = +(Math.PI * r ** 2 * h).toFixed(6)
  const surface = +(2 * Math.PI * r * (r + h)).toFixed(6)
  show("cy-result",
    `Объём V = <b>${volume}</b><br/>` +
    `Площадь поверхности = <b>${surface}</b>`)
}

;(window as any).solveCube = () => {
  const a = val("cb-a")
  show("cb-result",
    `Объём V = <b>${+(a ** 3).toFixed(6)}</b><br/>` +
    `Площадь поверхности = <b>${+(6 * a ** 2).toFixed(6)}</b>`)
}

;(window as any).solveBox = () => {
  const a = val("bx-a"), b = val("bx-b"), c = val("bx-c")
  const volume = +(a * b * c).toFixed(6)
  const surface = +(2 * (a*b + b*c + a*c)).toFixed(6)
  show("bx-result",
    `Объём V = <b>${volume}</b><br/>` +
    `Площадь поверхности = <b>${surface}</b>`)
}

;(window as any).solveCone = () => {
  const r = val("cn-r"), h = val("cn-h")
  const volume = +(Math.PI * r ** 2 * h / 3).toFixed(6)
  const slant = +Math.sqrt(r ** 2 + h ** 2).toFixed(6)
  const surface = +(Math.PI * r * (r + slant)).toFixed(6)
  show("cn-result",
    `Объём V = <b>${volume}</b><br/>` +
    `Площадь поверхности = <b>${surface}</b><br/>` +
    `Образующая l = <b>${slant}</b>`)
}

;(window as any).solvePyramid = () => {
  const s = val("pm-s"), h = val("pm-h")
  show("pm-result", `Объём V = <b>${+(s * h / 3).toFixed(6)}</b>`)
}

// ── Дроби ─────────────────────────────────────────────────────────────────────

function gcdTwo(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b)
  while (b) { [a, b] = [b, a % b] }
  return a
}

function fractionSimplify(n: number, d: number): [number, number] {
  if (d === 0) throw new Error("Знаменатель равен 0")
  const g = gcdTwo(Math.abs(n), Math.abs(d))
  if (d < 0) { n = -n; d = -d }
  return [n / g, d / g]
}

function fractionToStr(n: number, d: number): string {
  if (d === 1) return `${n}`
  return `${n}/${d}`
}

;(window as any).solveFraction = () => {
  try {
    const n1 = Math.round(val("f-n1")), d1 = Math.round(val("f-d1"))
    const n2 = Math.round(val("f-n2")), d2 = Math.round(val("f-d2"))
    const op = str("f-op")
    if (d1 === 0 || d2 === 0) { show("f-result", "Знаменатель не может быть 0", true); return }
    if (op === "/" && n2 === 0) { show("f-result", "Деление на ноль", true); return }

    let rn: number, rd: number
    if (op === "+") { rn = n1 * d2 + n2 * d1; rd = d1 * d2 }
    else if (op === "-") { rn = n1 * d2 - n2 * d1; rd = d1 * d2 }
    else if (op === "*") { rn = n1 * n2; rd = d1 * d2 }
    else { rn = n1 * d2; rd = d1 * n2 }

    const [sn, sd] = fractionSimplify(rn, rd)
    const decimal = +(sn / sd).toFixed(8)
    show("f-result", `Результат: <b>${fractionToStr(sn, sd)}</b> ≈ ${decimal}`)
  } catch (e: any) { show("f-result", e.message, true) }
}

// ── Проценты ──────────────────────────────────────────────────────────────────

;(window as any).solvePercentOf = () => {
  const pct = val("po-pct"), total = val("po-total")
  const result = +((pct / 100) * total).toFixed(6)
  show("po-result", `${pct}% от ${total} = <b>${result}</b>`)
}

;(window as any).solvePercent = () => {
  const v = val("pw-val"), total = val("pw-total")
  if (total === 0) { show("pw-result", "total не может быть 0", true); return }
  const result = +((v / total) * 100).toFixed(4)
  show("pw-result", `${v} — это <b>${result}%</b> от ${total}`)
}

// ── НОД / НОК ─────────────────────────────────────────────────────────────────

function parseNums(id: string): number[] {
  return str(id).split(",").map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n))
}

function calcGcd(nums: number[]): number {
  return nums.reduce((a, b) => gcdTwo(a, b))
}

function calcLcm(nums: number[]): number {
  return nums.reduce((a, b) => Math.abs(a * b) / gcdTwo(a, b))
}

;(window as any).solveGcd = () => {
  const numbers = parseNums("gl-nums")
  if (numbers.length < 2) { show("gl-result", "Нужно минимум 2 числа", true); return }
  show("gl-result", `НОД(${numbers.join(", ")}) = <b>${calcGcd(numbers)}</b>`)
}

;(window as any).solveLcm = () => {
  const numbers = parseNums("gl-nums")
  if (numbers.length < 2) { show("gl-result", "Нужно минимум 2 числа", true); return }
  show("gl-result", `НОК(${numbers.join(", ")}) = <b>${calcLcm(numbers)}</b>`)
}

// ── Степени и корни ───────────────────────────────────────────────────────────

;(window as any).solvePower = () => {
  const base = val("pw2-base"), exp = val("pw2-exp")
  const result = +(base ** exp).toFixed(8)
  show("pw2-result", `${base}^${exp} = <b>${result}</b>`)
}

;(window as any).solveSqrt = () => {
  const a = val("sq2-a")
  if (a < 0) { show("sq2-result", "Нельзя брать корень из отрицательного числа", true); return }
  show("sq2-result", `√${a} = <b>${+Math.sqrt(a).toFixed(8)}</b>`)
}

;(window as any).solveCbrt = () => {
  const a = val("cb2-a")
  show("cb2-result", `∛${a} = <b>${+Math.cbrt(a).toFixed(8)}</b>`)
}

// ── Статистика ────────────────────────────────────────────────────────────────

;(window as any).solveStats = () => {
  const raw = str("st-nums").split(",").map(s => parseFloat(s.trim())).filter(n => !isNaN(n))
  if (raw.length === 0) { show("st-result", "Введи числа через запятую", true); return }
  const nums = [...raw].sort((a, b) => a - b)
  const n = nums.length
  const mean = +(nums.reduce((s, x) => s + x, 0) / n).toFixed(6)
  const median = n % 2 !== 0 ? nums[Math.floor(n / 2)] : (nums[n/2 - 1] + nums[n/2]) / 2
  const freq = new Map<number, number>()
  for (const x of nums) freq.set(x, (freq.get(x) ?? 0) + 1)
  const maxFreq = Math.max(...freq.values())
  const mode = [...freq.entries()].filter(([, v]) => v === maxFreq).map(([k]) => k)
  const spread = nums[n - 1] - nums[0]
  show("st-result",
    `Среднее: <b>${mean}</b><br/>` +
    `Медиана: <b>${median}</b><br/>` +
    `Мода: <b>${mode.join(", ")}</b><br/>` +
    `Размах: <b>${spread}</b><br/>` +
    `Мин: ${nums[0]} · Макс: ${nums[n-1]}`)
}

// ── Библиотека формул (встроенная) ────────────────────────────────────────────

declare const katex: any

const FORMULAS: Array<{name: string; latex: string; category: string; description: string}> = [
  // Геометрия плоская
  { name: "Площадь квадрата",         latex: "S = a^2",                             category: "геометрия",  description: "Сторона a" },
  { name: "Площадь прямоугольника",   latex: "S = a \\cdot b",                      category: "геометрия",  description: "Стороны a и b" },
  { name: "Площадь треугольника",     latex: "S = \\dfrac{a \\cdot h}{2}",          category: "геометрия",  description: "Основание a, высота h" },
  { name: "Площадь круга",            latex: "S = \\pi r^2",                        category: "геометрия",  description: "Радиус r" },
  { name: "Длина окружности",         latex: "C = 2 \\pi r",                        category: "геометрия",  description: "Радиус r" },
  { name: "Площадь трапеции",         latex: "S = \\dfrac{(a+b)}{2} \\cdot h",     category: "геометрия",  description: "Основания a, b и высота h" },
  { name: "Площадь параллелограмма",  latex: "S = a \\cdot h",                      category: "геометрия",  description: "Основание a, высота h" },
  // Геометрия пространственная
  { name: "Объём куба",               latex: "V = a^3",                             category: "геометрия",  description: "Ребро a" },
  { name: "Объём параллелепипеда",    latex: "V = a \\cdot b \\cdot c",             category: "геометрия",  description: "Рёбра a, b, c" },
  { name: "Объём цилиндра",           latex: "V = \\pi r^2 h",                      category: "геометрия",  description: "Радиус r, высота h" },
  { name: "Объём конуса",             latex: "V = \\dfrac{1}{3} \\pi r^2 h",       category: "геометрия",  description: "Радиус r, высота h" },
  { name: "Объём пирамиды",           latex: "V = \\dfrac{1}{3} S h",              category: "геометрия",  description: "Площадь основания S, высота h" },
  // Алгебра
  { name: "Дискриминант",             latex: "D = b^2 - 4ac",                       category: "алгебра",    description: "Коэффициенты a, b, c" },
  { name: "Корни квадратного уравнения", latex: "x = \\dfrac{-b \\pm \\sqrt{D}}{2a}", category: "алгебра", description: "D — дискриминант" },
  { name: "Разность квадратов",       latex: "a^2 - b^2 = (a-b)(a+b)",             category: "алгебра",    description: "" },
  { name: "Квадрат суммы",            latex: "(a+b)^2 = a^2 + 2ab + b^2",          category: "алгебра",    description: "" },
  { name: "Квадрат разности",         latex: "(a-b)^2 = a^2 - 2ab + b^2",          category: "алгебра",    description: "" },
  // Арифметика
  { name: "Сумма n первых натуральных", latex: "S = \\dfrac{n(n+1)}{2}",           category: "арифметика", description: "" },
  { name: "Нахождение процента",      latex: "P = \\dfrac{x}{n} \\cdot 100",       category: "арифметика", description: "x — часть, n — целое" },
  { name: "Арифметическая прогрессия (член)", latex: "a_n = a_1 + (n-1)d",         category: "арифметика", description: "a₁ — первый член, d — разность" },
  { name: "Арифметическая прогрессия (сумма)", latex: "S = \\dfrac{n(a_1+a_n)}{2}", category: "арифметика", description: "" },
  // Физика
  { name: "Скорость",                 latex: "v = \\dfrac{s}{t}",                  category: "физика",     description: "s — путь, t — время" },
  { name: "Путь",                     latex: "s = v \\cdot t",                     category: "физика",     description: "v — скорость, t — время" },
  { name: "Давление",                 latex: "P = \\dfrac{F}{S}",                  category: "физика",     description: "F — сила, S — площадь" },
  { name: "Плотность",                latex: "\\rho = \\dfrac{m}{V}",              category: "физика",     description: "m — масса, V — объём" },
  { name: "КПД",                      latex: "\\eta = \\dfrac{A_{\\text{пол}}}{A_{\\text{зат}}} \\cdot 100\\%", category: "физика", description: "Полезная и затраченная работа" },
]

function renderLatex(latex: string): string {
  try {
    return katex.renderToString(latex, { throwOnError: false, displayMode: true })
  } catch {
    return `<code>${latex}</code>`
  }
}

function renderFormulaList(items: typeof FORMULAS, grouped = false) {
  const container = document.getElementById("fm-result")!
  if (items.length === 0) {
    container.innerHTML = '<p class="formula-empty">Ничего не найдено</p>'
    return
  }

  if (!grouped) {
    container.innerHTML = items.map(f => `
      <div class="formula-card">
        <div class="fname">${f.name}</div>
        <div class="flatex">${renderLatex(f.latex)}</div>
        ${f.description ? `<div class="fdesc">${f.description}</div>` : ""}
        ${f.category ? `<div class="fdesc" style="color:#667eea">📂 ${f.category}</div>` : ""}
      </div>`).join("")
    return
  }

  const grouped_data: Record<string, typeof FORMULAS> = {}
  for (const f of items) {
    if (!grouped_data[f.category]) grouped_data[f.category] = []
    grouped_data[f.category].push(f)
  }
  container.innerHTML = Object.entries(grouped_data).map(([cat, formulas]) => `
    <div class="formula-category">
      <h3>${cat}</h3>
      ${formulas.map(f => `
        <div class="formula-card">
          <div class="fname">${f.name}</div>
          <div class="flatex">${renderLatex(f.latex)}</div>
          ${f.description ? `<div class="fdesc">${f.description}</div>` : ""}
        </div>`).join("")}
    </div>`).join("")
}

;(window as any).loadAllFormulas = () => {
  renderFormulaList(FORMULAS, true)
}

;(window as any).searchFormulas = () => {
  const q = str("fm-query").trim().toLowerCase()
  if (!q) { ;(window as any).loadAllFormulas(); return }
  const results = FORMULAS.filter(f =>
    f.name.toLowerCase().includes(q) ||
    f.category.toLowerCase().includes(q) ||
    f.description.toLowerCase().includes(q)
  )
  renderFormulaList(results)
}

document.getElementById("fm-query")?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") (window as any).searchFormulas()
})

// ── Единицы измерения (чисто фронт) ──────────────────────────────────────────

function convertUnit(value: number, from: string, to: string, table: Record<string, number>): number {
  return value * table[from] / table[to]
}

;(window as any).convertLength = () => {
  const table: Record<string, number> = { mm: 0.001, cm: 0.01, dm: 0.1, m: 1, km: 1000 }
  const v = (document.getElementById("un-len-val") as HTMLInputElement).valueAsNumber
  const from = (document.getElementById("un-len-from") as HTMLSelectElement).value
  const to   = (document.getElementById("un-len-to")   as HTMLSelectElement).value
  const res  = convertUnit(v, from, to, table)
  show("un-len-result", `${v} ${from} = <b>${+res.toPrecision(10)} ${to}</b>`)
}

;(window as any).convertMass = () => {
  const table: Record<string, number> = { mg: 0.000001, g: 0.001, kg: 1, t: 1000 }
  const v = (document.getElementById("un-mass-val") as HTMLInputElement).valueAsNumber
  const from = (document.getElementById("un-mass-from") as HTMLSelectElement).value
  const to   = (document.getElementById("un-mass-to")   as HTMLSelectElement).value
  const res  = convertUnit(v, from, to, table)
  show("un-mass-result", `${v} ${from} = <b>${+res.toPrecision(10)} ${to}</b>`)
}

;(window as any).convertTime = () => {
  const table: Record<string, number> = { sec: 1, min: 60, hour: 3600, day: 86400 }
  const v = (document.getElementById("un-time-val") as HTMLInputElement).valueAsNumber
  const from = (document.getElementById("un-time-from") as HTMLSelectElement).value
  const to   = (document.getElementById("un-time-to")   as HTMLSelectElement).value
  const res  = convertUnit(v, from, to, table)
  show("un-time-result", `${v} ${from} = <b>${+res.toPrecision(10)} ${to}</b>`)
}

;(window as any).convertArea = () => {
  const table: Record<string, number> = { cm2: 0.0001, dm2: 0.01, m2: 1, a: 100, ha: 10000, km2: 1000000 }
  const v = (document.getElementById("un-area-val") as HTMLInputElement).valueAsNumber
  const from = (document.getElementById("un-area-from") as HTMLSelectElement).value
  const to   = (document.getElementById("un-area-to")   as HTMLSelectElement).value
  const res  = convertUnit(v, from, to, table)
  show("un-area-result", `${v} ${from} = <b>${+res.toPrecision(10)} ${to}</b>`)
}

// ── Температура ───────────────────────────────────────────────────────────────

;(window as any).convertTempC = () => {
  const c = (document.getElementById("tp-c") as HTMLInputElement).valueAsNumber
  const f = c * 9/5 + 32
  const k = c + 273.15
  show("tp-c-result", `°C: <b>${c}</b><br/>°F: <b>${+f.toFixed(4)}</b><br/>K: <b>${+k.toFixed(4)}</b>`)
}

;(window as any).convertTempF = () => {
  const f = (document.getElementById("tp-f") as HTMLInputElement).valueAsNumber
  const c = (f - 32) * 5/9
  const k = c + 273.15
  show("tp-f-result", `°F: <b>${f}</b><br/>°C: <b>${+c.toFixed(4)}</b><br/>K: <b>${+k.toFixed(4)}</b>`)
}

;(window as any).convertTempK = () => {
  const k = (document.getElementById("tp-k") as HTMLInputElement).valueAsNumber
  const c = k - 273.15
  const f = c * 9/5 + 32
  show("tp-k-result", `K: <b>${k}</b><br/>°C: <b>${+c.toFixed(4)}</b><br/>°F: <b>${+f.toFixed(4)}</b>`)
}

// ── Скорость / Время / Расстояние ────────────────────────────────────────────

;(window as any).solveSpeed = () => {
  const vRaw = (document.getElementById("sp-v") as HTMLInputElement).value
  const tRaw = (document.getElementById("sp-t") as HTMLInputElement).value
  const sRaw = (document.getElementById("sp-s") as HTMLInputElement).value
  const v = vRaw ? parseFloat(vRaw) : null
  const t = tRaw ? parseFloat(tRaw) : null
  const s = sRaw ? parseFloat(sRaw) : null
  const empty = [v, t, s].filter(x => x === null).length
  if (empty !== 1) { show("sp-result", "Заполни ровно два поля, третье оставь пустым", true); return }
  if (v === null) {
    const res = s! / t!
    show("sp-result", `v = s / t = ${s} / ${t} = <b>${+res.toFixed(6)} км/ч</b>`)
  } else if (t === null) {
    const res = s! / v!
    show("sp-result", `t = s / v = ${s} / ${v} = <b>${+res.toFixed(6)} ч</b>`)
  } else {
    const res = v! * t!
    show("sp-result", `s = v × t = ${v} × ${t} = <b>${+res.toFixed(6)} км</b>`)
  }
}

// ── Делители числа ────────────────────────────────────────────────────────────

;(window as any).solveDivisors = () => {
  const n = Math.floor((document.getElementById("dv-n") as HTMLInputElement).valueAsNumber)
  if (!n || n < 1) { show("dv-result", "Введи натуральное число", true); return }
  if (n > 1000000) { show("dv-result", "Число слишком большое (макс. 1 000 000)", true); return }
  const divs: number[] = []
  for (let i = 1; i <= Math.sqrt(n); i++) {
    if (n % i === 0) {
      divs.push(i)
      if (i !== n / i) divs.push(n / i)
    }
  }
  divs.sort((a, b) => a - b)
  const isPrime = divs.length === 2
  show("dv-result",
    `Делители ${n}: <b>${divs.join(", ")}</b><br/>` +
    `Количество делителей: <b>${divs.length}</b><br/>` +
    (isPrime ? `<span style="color:#38a169">✓ Простое число</span>` : `<span style="color:#805ad5">Составное число</span>`)
  )
}

// ── Факториал и комбинаторика ─────────────────────────────────────────────────

function factorial(n: number): bigint {
  if (n < 0) throw new Error("n должно быть ≥ 0")
  let r = 1n
  for (let i = 2; i <= n; i++) r *= BigInt(i)
  return r
}

;(window as any).solveFactorial = () => {
  try {
    const n = Math.floor((document.getElementById("fc-n") as HTMLInputElement).valueAsNumber)
    if (n < 0 || n > 20) { show("fc-result", "n должно быть от 0 до 20", true); return }
    const steps = Array.from({length: n}, (_, i) => i + 1).join(" × ") || "1"
    show("fc-result", `${n}! = ${steps} = <b>${factorial(n)}</b>`)
  } catch (e: any) { show("fc-result", e.message, true) }
}

;(window as any).solveCombinations = () => {
  try {
    const n = Math.floor((document.getElementById("cn-n") as HTMLInputElement).valueAsNumber)
    const k = Math.floor((document.getElementById("cn-k") as HTMLInputElement).valueAsNumber)
    if (k > n) { show("cn-result", "k не может быть больше n", true); return }
    const res = factorial(n) / (factorial(k) * factorial(n - k))
    show("cn-result", `C(${n}, ${k}) = ${n}! / (${k}! × ${n-k}!) = <b>${res}</b>`)
  } catch (e: any) { show("cn-result", e.message, true) }
}

;(window as any).solvePermutations = () => {
  try {
    const n = Math.floor((document.getElementById("an-n") as HTMLInputElement).valueAsNumber)
    const k = Math.floor((document.getElementById("an-k") as HTMLInputElement).valueAsNumber)
    if (k > n) { show("an-result", "k не может быть больше n", true); return }
    const res = factorial(n) / factorial(n - k)
    show("an-result", `A(${n}, ${k}) = ${n}! / ${n-k}! = <b>${res}</b>`)
  } catch (e: any) { show("an-result", e.message, true) }
}

// ── Переключение вкладок ──────────────────────────────────────────────────────

function initTabs(btnSelector: string, panelPrefix: string) {
  document.querySelectorAll<HTMLElement>(btnSelector).forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.tab ?? btn.dataset.geo ?? btn.dataset.pct ?? btn.dataset.pow
        ?? btn.dataset.units ?? btn.dataset.temp ?? btn.dataset.fact!
      document.querySelectorAll(btnSelector).forEach(b => b.classList.remove("active"))
      document.querySelectorAll(`[id^="${panelPrefix}"]`).forEach(p => p.classList.remove("active"))
      btn.classList.add("active")
      document.getElementById(panelPrefix + key)?.classList.add("active")
    })
  })
}

initTabs(".geo-btn",   "geo-")
initTabs(".pct-btn",   "pct-")
initTabs(".pow-btn",   "pow-")
initTabs(".units-btn", "units-")
initTabs(".temp-btn",  "temp-")
initTabs(".fact-btn",  "fact-")

// ── Sidebar: вкладки + drag-and-drop ─────────────────────────────────────────

const STORAGE_KEY = "sidebar-order"

function saveSidebarOrder() {
  const sidebar = document.getElementById("sidebar")!
  const order = Array.from(sidebar.querySelectorAll<HTMLElement>(".tab-btn"))
    .map(btn => btn.dataset.tab!)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(order))
}

function restoreSidebarOrder() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (!saved) return
  const order: string[] = JSON.parse(saved)
  const sidebar = document.getElementById("sidebar")!
  order.forEach(tab => {
    const btn = sidebar.querySelector<HTMLElement>(`[data-tab="${tab}"]`)
    if (btn) sidebar.appendChild(btn)
  })
}

function initSidebar() {
  restoreSidebarOrder()

  const sidebar = document.getElementById("sidebar")!
  let dragged: HTMLElement | null = null

  sidebar.querySelectorAll<HTMLElement>(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      sidebar.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"))
      document.querySelectorAll(".tab").forEach(p => p.classList.remove("active"))
      btn.classList.add("active")
      const key = btn.dataset.tab!
      document.getElementById("tab-" + key)?.classList.add("active")
    })
  })

  sidebar.addEventListener("dragstart", e => {
    dragged = (e.target as HTMLElement).closest(".tab-btn")
    dragged?.classList.add("dragging")
  })

  sidebar.addEventListener("dragend", () => {
    dragged?.classList.remove("dragging")
    sidebar.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("drag-over"))
    dragged = null
    saveSidebarOrder()
  })

  sidebar.addEventListener("dragover", e => {
    e.preventDefault()
    const target = (e.target as HTMLElement).closest<HTMLElement>(".tab-btn")
    if (!target || target === dragged) return
    sidebar.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("drag-over"))
    target.classList.add("drag-over")
    const rect = target.getBoundingClientRect()
    const after = e.clientY > rect.top + rect.height / 2
    if (dragged) {
      after ? target.after(dragged) : target.before(dragged)
    }
  })

  sidebar.addEventListener("dragleave", e => {
    const target = (e.target as HTMLElement).closest<HTMLElement>(".tab-btn")
    target?.classList.remove("drag-over")
  })

  sidebar.addEventListener("drop", e => {
    e.preventDefault()
  })
}

initSidebar()

// ── Мобильное меню ────────────────────────────────────────────────────────────

const menuToggle = document.getElementById("menuToggle")!
const sidebarEl  = document.getElementById("sidebar")!
const overlay    = document.getElementById("sidebarOverlay")!

function openMenu()  { sidebarEl.classList.add("open"); overlay.classList.add("open") }
function closeMenu() { sidebarEl.classList.remove("open"); overlay.classList.remove("open") }

menuToggle.addEventListener("click", () =>
  sidebarEl.classList.contains("open") ? closeMenu() : openMenu()
)
overlay.addEventListener("click", closeMenu)

sidebarEl.querySelectorAll(".tab-btn").forEach(btn =>
  btn.addEventListener("click", () => { if (window.innerWidth <= 640) closeMenu() })
)
