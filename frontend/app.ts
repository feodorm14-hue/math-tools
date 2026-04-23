import katex from 'katex'

// ── Авторизация ───────────────────────────────────────────────────────────────

const AUTH_KEY  = 'mi-auth'
const PASSWORD  = 'math2026'   // ← пароль меняй здесь

function checkAuth() {
  const screen = document.getElementById('login-screen')!
  if (localStorage.getItem(AUTH_KEY) === 'ok') {
    screen.classList.add('hidden')
  }
  // иначе экран остаётся виден
}

;(window as any).doLogin = () => {
  const input = document.getElementById('login-input') as HTMLInputElement
  const err   = document.getElementById('login-error')!
  if (input.value === PASSWORD) {
    localStorage.setItem(AUTH_KEY, 'ok')
    const screen = document.getElementById('login-screen')!
    screen.style.transition = 'opacity 0.3s'
    screen.style.opacity = '0'
    setTimeout(() => screen.classList.add('hidden'), 300)
    err.textContent = ''
  } else {
    err.textContent = '❌ Неверный пароль'
    input.value = ''
    input.focus()
    input.style.borderColor = '#fc8181'
    setTimeout(() => { input.style.borderColor = '' }, 1200)
  }
}

;(window as any).doLogout = () => {
  localStorage.removeItem(AUTH_KEY)
  location.reload()
}

checkAuth()

// ── Хранилище ─────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'sidebar-order'

// ── Тёмная тема ──────────────────────────────────────────────────────────────

const THEME_KEY = 'math-theme'
function applyTheme(dark: boolean) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  const btn = document.getElementById('darkToggle')
  if (btn) btn.textContent = dark ? '☀️' : '🌙'
  localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light')
}
const savedTheme = localStorage.getItem(THEME_KEY)
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
applyTheme(savedTheme ? savedTheme === 'dark' : prefersDark)

document.getElementById('darkToggle')?.addEventListener('click', () => {
  applyTheme(document.documentElement.getAttribute('data-theme') !== 'dark')
})

// ── Дашборд ──────────────────────────────────────────────────────────────────

const TOOL_CARDS = [
  // Числа
  { id: 'gcdlcm',      icon: '🔢', name: 'НОД / НОК',      color: '#76e4f7', desc: 'Делители и кратные' },
  { id: 'divisors',    icon: '÷',  name: 'Делители',        color: '#ed8936', desc: 'Простые числа' },
  { id: 'factorial',   icon: '!',  name: 'Факториал',       color: '#667eea', desc: 'n! · C(n,k) · A(n,k)' },
  { id: 'power',       icon: '⚡', name: 'Степени и корни', color: '#fbd38d', desc: 'aⁿ · √a · ∛a' },
  { id: 'rounding',    icon: '🎯', name: 'Округление',      color: '#d97706', desc: 'До любого разряда' },
  // Дроби и %
  { id: 'fraction',    icon: '½',  name: 'Дроби',           color: '#68d391', desc: 'Точная арифметика' },
  { id: 'percent',     icon: '%',  name: 'Проценты',        color: '#fc8181', desc: 'Найти % от числа' },
  { id: 'proportion',  icon: '⚖️', name: 'Пропорция',       color: '#667eea', desc: 'a/b = c/d → найти d' },
  // Алгебра
  { id: 'equations',   icon: '🔭', name: 'Уравнения',       color: '#7c3aed', desc: 'Линейные и квадратные' },
  { id: 'progressions',icon: '📈', name: 'Прогрессии',      color: '#059669', desc: 'Арифм. и геом.' },
  // Геометрия
  { id: 'geometry',    icon: '🔷', name: 'Геометрия',       color: '#f6ad55', desc: 'Площади и объёмы' },
  { id: 'coordinates', icon: '📍', name: 'Координаты',      color: '#0891b2', desc: 'Расстояние, середина' },
  { id: 'scale',       icon: '🗺️', name: 'Масштаб',         color: '#be185d', desc: 'Карта ↔ реальность' },
  // Задачи
  { id: 'speed',       icon: '🚀', name: 'Скорость',        color: '#48bb78', desc: 'v = s / t' },
  { id: 'work',        icon: '⚙️', name: 'Работа',          color: '#475569', desc: 'Совместная работа' },
  { id: 'units',       icon: '📐', name: 'Единицы',         color: '#4fd1c5', desc: 'Перевод мер' },
  { id: 'temp',        icon: '🌡️', name: 'Температура',    color: '#f687b3', desc: '°C ↔ °F ↔ K' },
  // Справочник
  { id: 'stats',       icon: '📊', name: 'Статистика',      color: '#9f7aea', desc: 'Среднее, медиана, мода' },
  { id: 'formulas',    icon: '📚', name: 'Формулы',         color: '#a0aec0', desc: 'Библиотека формул' },
]

function renderDashboard() {
  const root = document.getElementById('dashboard-root')!

  // Берём порядок из того же ключа, что и сайдбар
  const savedOrder: string[] | null = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')
  const cards = savedOrder
    ? [...TOOL_CARDS].sort((a, b) => {
        const ia = savedOrder.indexOf(a.id), ib = savedOrder.indexOf(b.id)
        return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib)
      })
    : TOOL_CARDS

  root.innerHTML = `
    <div class="dashboard-grid" id="dashboard-grid">
      ${cards.map(t => `
        <div class="dash-card" data-id="${t.id}" style="--card-color:${t.color}">
          <span class="dash-card-icon">${t.icon}</span>
          <div class="dash-card-name">${t.name}</div>
          <div class="dash-card-desc">${t.desc}</div>
        </div>
      `).join('')}
    </div>
  `

  root.querySelectorAll<HTMLElement>('.dash-card').forEach(card => {
    card.addEventListener('click', () => goToTab(card.dataset.id!))
  })

  const SortableLib = (window as any).Sortable
  if (SortableLib) {
    new SortableLib(document.getElementById('dashboard-grid'), {
      animation: 200,
      delay: 150,
      delayOnTouchOnly: true,
      onEnd: () => {
        // Сохраняем порядок плиток дашборда
        const dashOrder = Array.from(
          document.querySelectorAll<HTMLElement>('#dashboard-grid .dash-card')
        ).map(c => c.dataset.id!)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dashOrder))
      }
    })
  }
}
renderDashboard()

;(window as any).goToTab = (id: string) => {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'))
  document.querySelectorAll('.tab').forEach(p => p.classList.remove('active'))
  const btn = document.querySelector<HTMLElement>(`.tab-btn[data-tab="${id}"]`)
  btn?.classList.add('active')
  document.getElementById('tab-' + id)?.classList.add('active')
}

// ── Утилиты ──────────────────────────────────────────────────────────────────

function show(id: string, html: string, isError = false) {
  const el = document.getElementById(id)!
  el.innerHTML = html
  el.className = 'result ' + (isError ? 'error' : 'ok')
}

function val(id: string): number {
  return parseFloat((document.getElementById(id) as HTMLInputElement).value)
}
function str(id: string): string {
  return (document.getElementById(id) as HTMLInputElement).value
}

// ── Пропорция ─────────────────────────────────────────────────────────────────

;(window as any).solveProportion = () => {
  const a = val('pr-a'), b = val('pr-b'), c = val('pr-c')
  if (!a || !b || !c || a === 0) { show('pr-result', 'Введи числа (a ≠ 0)', true); return }
  const d = +(b * c / a).toFixed(8)
  show('pr-result', `${a} / ${b} = ${c} / <b>${d}</b><br/>Проверка: ${a} × ${d} = ${b} × ${c}`)
}

// ── Геометрия ─────────────────────────────────────────────────────────────────

;(window as any).solvePythagoras = () => {
  const aStr = (document.getElementById('py-a') as HTMLInputElement).value
  const bStr = (document.getElementById('py-b') as HTMLInputElement).value
  const cStr = (document.getElementById('py-c') as HTMLInputElement).value
  const a = aStr ? parseFloat(aStr) : null
  const b = bStr ? parseFloat(bStr) : null
  const c = cStr ? parseFloat(cStr) : null
  const empty = [a, b, c].filter(x => x === null).length
  if (empty !== 1) { show('py-result', 'Введи ровно два значения, третье оставь пустым', true); return }
  if (c === null) {
    show('py-result', `c = √(${a}² + ${b}²) = <b>${+Math.sqrt(a! ** 2 + b! ** 2).toFixed(8)}</b>`)
  } else if (b === null) {
    if (c! <= a!) { show('py-result', 'Гипотенуза должна быть больше катета', true); return }
    show('py-result', `b = √(${c}² − ${a}²) = <b>${+Math.sqrt(c! ** 2 - a! ** 2).toFixed(8)}</b>`)
  } else {
    if (c! <= b!) { show('py-result', 'Гипотенуза должна быть больше катета', true); return }
    show('py-result', `a = √(${c}² − ${b}²) = <b>${+Math.sqrt(c! ** 2 - b! ** 2).toFixed(8)}</b>`)
  }
}

;(window as any).solveCircle = () => {
  const r = val('ci-r')
  show('ci-result',
    `Площадь S = <b>${+(Math.PI * r ** 2).toFixed(6)}</b><br/>` +
    `Длина окружности C = <b>${+(2 * Math.PI * r).toFixed(6)}</b>`)
}
;(window as any).solveRectangle = () => {
  const a = val('re-a'), b = val('re-b')
  show('re-result', `Площадь S = <b>${+(a*b).toFixed(6)}</b><br/>Периметр P = <b>${+(2*(a+b)).toFixed(6)}</b>`)
}
;(window as any).solveSquare = () => {
  const a = val('sq-a')
  show('sq-result', `Площадь S = <b>${+(a**2).toFixed(6)}</b><br/>Периметр P = <b>${+(4*a).toFixed(6)}</b>`)
}
;(window as any).solveTriangle = () => {
  show('tr-result', `Площадь S = <b>${+(val('tr-a') * val('tr-h') / 2).toFixed(6)}</b>`)
}
;(window as any).solveTrapezoid = () => {
  show('tp-result', `Площадь S = <b>${+((val('tp-a') + val('tp-b')) / 2 * val('tp-h')).toFixed(6)}</b>`)
}
;(window as any).solveParallelogram = () => {
  show('pg-result', `Площадь S = <b>${+(val('pg-a') * val('pg-h')).toFixed(6)}</b>`)
}
;(window as any).solveCylinder = () => {
  const r = val('cy-r'), h = val('cy-h')
  show('cy-result',
    `Объём V = <b>${+(Math.PI * r**2 * h).toFixed(6)}</b><br/>` +
    `Площадь поверхности = <b>${+(2 * Math.PI * r * (r + h)).toFixed(6)}</b>`)
}
;(window as any).solveCube = () => {
  const a = val('cb-a')
  show('cb-result', `Объём V = <b>${+(a**3).toFixed(6)}</b><br/>Площадь поверхности = <b>${+(6*a**2).toFixed(6)}</b>`)
}
;(window as any).solveBox = () => {
  const a = val('bx-a'), b = val('bx-b'), c = val('bx-c')
  show('bx-result',
    `Объём V = <b>${+(a*b*c).toFixed(6)}</b><br/>` +
    `Площадь поверхности = <b>${+(2*(a*b+b*c+a*c)).toFixed(6)}</b>`)
}
;(window as any).solveCone = () => {
  const r = val('cn-r'), h = val('cn-h')
  const l = +Math.sqrt(r**2 + h**2).toFixed(6)
  show('cn-result',
    `Объём V = <b>${+(Math.PI*r**2*h/3).toFixed(6)}</b><br/>` +
    `Площадь поверхности = <b>${+(Math.PI*r*(r+l)).toFixed(6)}</b><br/>` +
    `Образующая l = <b>${l}</b>`)
}
;(window as any).solvePyramid = () => {
  show('pm-result', `Объём V = <b>${+(val('pm-s') * val('pm-h') / 3).toFixed(6)}</b>`)
}

// ── Дроби: точная арифметика через BigInt + парсер выражений ──────────────────

interface Frac { n: bigint; d: bigint }

function gcdBig(a: bigint, b: bigint): bigint {
  a = a < 0n ? -a : a; b = b < 0n ? -b : b
  while (b) { [a, b] = [b, a % b] }
  return a
}
function fracSimplify(f: Frac): Frac {
  if (f.d === 0n) throw new Error('Деление на ноль')
  const g = gcdBig(f.n < 0n ? -f.n : f.n, f.d < 0n ? -f.d : f.d)
  let n = f.n / g, d = f.d / g
  if (d < 0n) { n = -n; d = -d }
  return { n, d }
}
function fracAdd(a: Frac, b: Frac): Frac { return fracSimplify({ n: a.n*b.d + b.n*a.d, d: a.d*b.d }) }
function fracSub(a: Frac, b: Frac): Frac { return fracSimplify({ n: a.n*b.d - b.n*a.d, d: a.d*b.d }) }
function fracMul(a: Frac, b: Frac): Frac { return fracSimplify({ n: a.n*b.n, d: a.d*b.d }) }
function fracDiv(a: Frac, b: Frac): Frac { return fracSimplify({ n: a.n*b.d, d: a.d*b.n }) }

function fracToStr(f: Frac): string {
  return f.d === 1n ? `${f.n}` : `${f.n}/${f.d}`
}
function fracToLatex(f: Frac): string {
  if (f.d === 1n) return `${f.n}`
  const neg = f.n < 0n
  return `${neg ? '-' : ''}\\dfrac{${neg ? -f.n : f.n}}{${f.d}}`
}

class FracParser {
  private pos = 0
  constructor(private s: string) {}
  private ws() { while (this.pos < this.s.length && this.s[this.pos] === ' ') this.pos++ }
  private peek() { this.ws(); return this.s[this.pos] ?? '' }
  private eat() { this.ws(); return this.s[this.pos++] ?? '' }

  parse(): Frac {
    const r = this.parseExpr()
    this.ws()
    if (this.pos < this.s.length) throw new Error(`Неожиданный символ: "${this.s[this.pos]}"`)
    return r
  }
  private parseExpr(): Frac {
    let left = this.parseTerm()
    while (['+', '-'].includes(this.peek())) {
      const op = this.eat(); const right = this.parseTerm()
      left = op === '+' ? fracAdd(left, right) : fracSub(left, right)
    }
    return left
  }
  private parseTerm(): Frac {
    let left = this.parsePrimary()
    while (['*', '/'].includes(this.peek())) {
      const op = this.eat(); const right = this.parsePrimary()
      left = op === '*' ? fracMul(left, right) : fracDiv(left, right)
    }
    return left
  }
  private parsePrimary(): Frac {
    this.ws()
    if (this.peek() === '(') {
      this.eat()
      const v = this.parseExpr()
      if (this.peek() !== ')') throw new Error('Ожидается )')
      this.eat(); return v
    }
    if (this.peek() === '-') { this.eat(); return fracMul({ n: -1n, d: 1n }, this.parsePrimary()) }
    let num = ''
    while (this.pos < this.s.length && /\d/.test(this.s[this.pos])) num += this.s[this.pos++]
    if (!num) throw new Error(`Ожидается число в позиции ${this.pos}`)
    return { n: BigInt(num), d: 1n }
  }
}

function evalFracExpr(expr: string): Frac {
  expr = expr.replace(/[×х]/g,'*').replace(/[÷:]/g,'/').replace(/[−–—]/g,'-').replace(/\s+/g,' ').trim()
  return new FracParser(expr).parse()
}

;(window as any).solveFractionExpr = () => {
  try {
    const expr = str('f-expr').trim()
    if (!expr) { show('f-result', 'Введи выражение', true); return }
    const result = evalFracExpr(expr)
    const decimal = Number(result.n) / Number(result.d)
    const rendered = renderLatex(fracToLatex(result))
    show('f-result',
      `<div class="frac-result-display">${fracToStr(result)}</div>` +
      `<div style="margin:8px 0">${rendered}</div>` +
      `<div class="frac-decimal">≈ ${decimal.toFixed(10).replace(/0+$/, '').replace(/\.$/, '')}</div>`)
  } catch (e: any) { show('f-result', e.message, true) }
}

;(window as any).setFracExpr = (expr: string) => {
  (document.getElementById('f-expr') as HTMLInputElement).value = expr
  ;(window as any).solveFractionExpr()
}

;(window as any).insertAtCursor = (id: string, text: string) => {
  const el = document.getElementById(id) as HTMLInputElement
  const start = el.selectionStart ?? el.value.length
  const end = el.selectionEnd ?? el.value.length
  el.value = el.value.slice(0, start) + text + el.value.slice(end)
  el.selectionStart = el.selectionEnd = start + text.length
  el.focus()
}

// ── Проценты ──────────────────────────────────────────────────────────────────

;(window as any).solvePercentOf = () => {
  const pct = val('po-pct'), total = val('po-total')
  show('po-result', `${pct}% от ${total} = <b>${+((pct/100)*total).toFixed(6)}</b>`)
}
;(window as any).solvePercent = () => {
  const v = val('pw-val'), total = val('pw-total')
  if (!total) { show('pw-result', 'total не может быть 0', true); return }
  show('pw-result', `${v} — это <b>${+((v/total)*100).toFixed(4)}%</b> от ${total}`)
}

// ── НОД / НОК ─────────────────────────────────────────────────────────────────

function gcdTwo(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b)
  while (b) { [a, b] = [b, a % b] }
  return a
}
function parseNums(id: string): number[] {
  return str(id).split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n))
}
;(window as any).solveGcd = () => {
  const nums = parseNums('gl-nums')
  if (nums.length < 2) { show('gl-result', 'Нужно минимум 2 числа', true); return }
  show('gl-result', `НОД(${nums.join(', ')}) = <b>${nums.reduce(gcdTwo)}</b>`)
}
;(window as any).solveLcm = () => {
  const nums = parseNums('gl-nums')
  if (nums.length < 2) { show('gl-result', 'Нужно минимум 2 числа', true); return }
  show('gl-result', `НОК(${nums.join(', ')}) = <b>${nums.reduce((a,b) => Math.abs(a*b)/gcdTwo(a,b))}</b>`)
}

// ── Степени и корни ───────────────────────────────────────────────────────────

;(window as any).solvePower = () => {
  show('pw2-result', `${val('pw2-base')}^${val('pw2-exp')} = <b>${+(val('pw2-base')**val('pw2-exp')).toFixed(8)}</b>`)
}
;(window as any).solveSqrt = () => {
  const a = val('sq2-a')
  if (a < 0) { show('sq2-result', 'Нельзя брать корень из отрицательного числа', true); return }
  show('sq2-result', `√${a} = <b>${+Math.sqrt(a).toFixed(8)}</b>`)
}
;(window as any).solveCbrt = () => {
  show('cb2-result', `∛${val('cb2-a')} = <b>${+Math.cbrt(val('cb2-a')).toFixed(8)}</b>`)
}

// ── Статистика ────────────────────────────────────────────────────────────────

;(window as any).solveStats = () => {
  const raw = str('st-nums').split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n))
  if (!raw.length) { show('st-result', 'Введи числа через запятую', true); return }
  const nums = [...raw].sort((a,b) => a-b), n = nums.length
  const mean = +(nums.reduce((s,x) => s+x, 0) / n).toFixed(6)
  const median = n%2 ? nums[Math.floor(n/2)] : (nums[n/2-1]+nums[n/2])/2
  const freq = new Map<number,number>()
  nums.forEach(x => freq.set(x, (freq.get(x)??0)+1))
  const maxF = Math.max(...freq.values())
  const mode = [...freq.entries()].filter(([,v])=>v===maxF).map(([k])=>k)
  show('st-result',
    `Среднее: <b>${mean}</b><br/>Медиана: <b>${median}</b><br/>` +
    `Мода: <b>${mode.join(', ')}</b><br/>Размах: <b>${nums[n-1]-nums[0]}</b><br/>` +
    `Мин: ${nums[0]} · Макс: ${nums[n-1]}`)
}

// ── Библиотека формул ─────────────────────────────────────────────────────────

const FORMULAS = [
  { name: 'Площадь квадрата',           latex: 'S = a^2',                                    category: 'геометрия',  description: 'Сторона a' },
  { name: 'Площадь прямоугольника',     latex: 'S = a \\cdot b',                              category: 'геометрия',  description: 'Стороны a и b' },
  { name: 'Площадь треугольника',       latex: 'S = \\dfrac{a \\cdot h}{2}',                  category: 'геометрия',  description: 'Основание a, высота h' },
  { name: 'Площадь круга',              latex: 'S = \\pi r^2',                                category: 'геометрия',  description: 'Радиус r' },
  { name: 'Длина окружности',           latex: 'C = 2 \\pi r',                                category: 'геометрия',  description: 'Радиус r' },
  { name: 'Площадь трапеции',           latex: 'S = \\dfrac{(a+b)}{2} \\cdot h',              category: 'геометрия',  description: 'Основания a, b и высота h' },
  { name: 'Площадь параллелограмма',    latex: 'S = a \\cdot h',                              category: 'геометрия',  description: 'Основание a, высота h' },
  { name: 'Объём куба',                 latex: 'V = a^3',                                     category: 'геометрия',  description: 'Ребро a' },
  { name: 'Объём параллелепипеда',      latex: 'V = a \\cdot b \\cdot c',                     category: 'геометрия',  description: 'Рёбра a, b, c' },
  { name: 'Объём цилиндра',             latex: 'V = \\pi r^2 h',                              category: 'геометрия',  description: 'Радиус r, высота h' },
  { name: 'Объём конуса',               latex: 'V = \\dfrac{1}{3} \\pi r^2 h',               category: 'геометрия',  description: 'Радиус r, высота h' },
  { name: 'Объём пирамиды',             latex: 'V = \\dfrac{1}{3} S h',                      category: 'геометрия',  description: 'Площадь основания S, высота h' },
  { name: 'Теорема Пифагора',           latex: 'c = \\sqrt{a^2 + b^2}',                      category: 'геометрия',  description: 'Гипотенуза c через катеты a и b' },
  { name: 'Дискриминант',               latex: 'D = b^2 - 4ac',                               category: 'алгебра',    description: 'Коэффициенты a, b, c' },
  { name: 'Корни квадратного уравнения',latex: 'x = \\dfrac{-b \\pm \\sqrt{D}}{2a}',          category: 'алгебра',    description: 'D — дискриминант' },
  { name: 'Разность квадратов',         latex: 'a^2 - b^2 = (a-b)(a+b)',                      category: 'алгебра',    description: '' },
  { name: 'Квадрат суммы',              latex: '(a+b)^2 = a^2 + 2ab + b^2',                  category: 'алгебра',    description: '' },
  { name: 'Квадрат разности',           latex: '(a-b)^2 = a^2 - 2ab + b^2',                  category: 'алгебра',    description: '' },
  { name: 'Пропорция',                  latex: '\\dfrac{a}{b} = \\dfrac{c}{d}',               category: 'алгебра',    description: 'd = b·c / a' },
  { name: 'Сумма n первых натуральных', latex: 'S = \\dfrac{n(n+1)}{2}',                     category: 'арифметика', description: '' },
  { name: 'Нахождение процента',        latex: 'P = \\dfrac{x}{n} \\cdot 100',               category: 'арифметика', description: 'x — часть, n — целое' },
  { name: 'Ариф. прогрессия (член)',    latex: 'a_n = a_1 + (n-1)d',                         category: 'арифметика', description: 'a₁ — первый член, d — разность' },
  { name: 'Ариф. прогрессия (сумма)',   latex: 'S = \\dfrac{n(a_1+a_n)}{2}',                 category: 'арифметика', description: '' },
  { name: 'НОД и НОК',                  latex: '\\text{НОК}(a,b) = \\dfrac{a \\cdot b}{\\text{НОД}(a,b)}', category: 'арифметика', description: '' },
  { name: 'Скорость',                   latex: 'v = \\dfrac{s}{t}',                          category: 'физика',     description: 's — путь, t — время' },
  { name: 'Путь',                       latex: 's = v \\cdot t',                             category: 'физика',     description: 'v — скорость, t — время' },
  { name: 'Давление',                   latex: 'P = \\dfrac{F}{S}',                          category: 'физика',     description: 'F — сила, S — площадь' },
  { name: 'Плотность',                  latex: '\\rho = \\dfrac{m}{V}',                      category: 'физика',     description: 'm — масса, V — объём' },
  { name: 'КПД',                        latex: '\\eta = \\dfrac{A_{\\text{пол}}}{A_{\\text{зат}}} \\cdot 100\\%', category: 'физика', description: 'Полезная и затраченная работа' },
]

function renderLatex(lx: string): string {
  try { return katex.renderToString(lx, { throwOnError: false, displayMode: true }) }
  catch { return `<code>${lx}</code>` }
}

function renderFormulaList(items: typeof FORMULAS, grouped = false) {
  const c = document.getElementById('fm-result')!
  if (!items.length) { c.innerHTML = '<p class="formula-empty">Ничего не найдено</p>'; return }
  if (!grouped) {
    c.innerHTML = items.map(f => `
      <div class="formula-card">
        <div class="fname">${f.name}</div>
        <div class="flatex">${renderLatex(f.latex)}</div>
        ${f.description ? `<div class="fdesc">${f.description}</div>` : ''}
        <div class="fdesc" style="color:#667eea">📂 ${f.category}</div>
      </div>`).join('')
    return
  }
  const gd: Record<string, typeof FORMULAS> = {}
  items.forEach(f => { if (!gd[f.category]) gd[f.category] = []; gd[f.category].push(f) })
  c.innerHTML = Object.entries(gd).map(([cat, fms]) => `
    <div class="formula-category">
      <h3>${cat}</h3>
      ${fms.map(f => `
        <div class="formula-card">
          <div class="fname">${f.name}</div>
          <div class="flatex">${renderLatex(f.latex)}</div>
          ${f.description ? `<div class="fdesc">${f.description}</div>` : ''}
        </div>`).join('')}
    </div>`).join('')
}

;(window as any).loadAllFormulas = () => renderFormulaList(FORMULAS, true)
;(window as any).searchFormulas = () => {
  const q = str('fm-query').trim().toLowerCase()
  if (!q) { ;(window as any).loadAllFormulas(); return }
  renderFormulaList(FORMULAS.filter(f =>
    f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q) || f.description.toLowerCase().includes(q)
  ))
}
document.getElementById('fm-query')?.addEventListener('keydown', e => {
  if (e.key === 'Enter') (window as any).searchFormulas()
})

// ── Единицы измерения ─────────────────────────────────────────────────────────

function convertUnit(v: number, from: string, to: string, t: Record<string,number>) {
  return v * t[from] / t[to]
}
;(window as any).convertLength = () => {
  const t = { mm:.001, cm:.01, dm:.1, m:1, km:1000 }
  const v = (document.getElementById('un-len-val') as HTMLInputElement).valueAsNumber
  const from = (document.getElementById('un-len-from') as HTMLSelectElement).value
  const to = (document.getElementById('un-len-to') as HTMLSelectElement).value
  show('un-len-result', `${v} ${from} = <b>${+convertUnit(v,from,to,t).toPrecision(10)} ${to}</b>`)
}
;(window as any).convertMass = () => {
  const t = { mg:.000001, g:.001, kg:1, t:1000 }
  const v = (document.getElementById('un-mass-val') as HTMLInputElement).valueAsNumber
  const from = (document.getElementById('un-mass-from') as HTMLSelectElement).value
  const to = (document.getElementById('un-mass-to') as HTMLSelectElement).value
  show('un-mass-result', `${v} ${from} = <b>${+convertUnit(v,from,to,t).toPrecision(10)} ${to}</b>`)
}
;(window as any).convertTime = () => {
  const t = { sec:1, min:60, hour:3600, day:86400 }
  const v = (document.getElementById('un-time-val') as HTMLInputElement).valueAsNumber
  const from = (document.getElementById('un-time-from') as HTMLSelectElement).value
  const to = (document.getElementById('un-time-to') as HTMLSelectElement).value
  show('un-time-result', `${v} ${from} = <b>${+convertUnit(v,from,to,t).toPrecision(10)} ${to}</b>`)
}
;(window as any).convertArea = () => {
  const t = { cm2:.0001, dm2:.01, m2:1, a:100, ha:10000, km2:1000000 }
  const v = (document.getElementById('un-area-val') as HTMLInputElement).valueAsNumber
  const from = (document.getElementById('un-area-from') as HTMLSelectElement).value
  const to = (document.getElementById('un-area-to') as HTMLSelectElement).value
  show('un-area-result', `${v} ${from} = <b>${+convertUnit(v,from,to,t).toPrecision(10)} ${to}</b>`)
}

// ── Температура ───────────────────────────────────────────────────────────────

;(window as any).convertTempC = () => {
  const c = (document.getElementById('tp-c') as HTMLInputElement).valueAsNumber
  show('tp-c-result', `°C: <b>${c}</b><br/>°F: <b>${+(c*9/5+32).toFixed(4)}</b><br/>K: <b>${+(c+273.15).toFixed(4)}</b>`)
}
;(window as any).convertTempF = () => {
  const f = (document.getElementById('tp-f') as HTMLInputElement).valueAsNumber
  const c = (f-32)*5/9
  show('tp-f-result', `°F: <b>${f}</b><br/>°C: <b>${+c.toFixed(4)}</b><br/>K: <b>${+(c+273.15).toFixed(4)}</b>`)
}
;(window as any).convertTempK = () => {
  const k = (document.getElementById('tp-k') as HTMLInputElement).valueAsNumber
  const c = k-273.15
  show('tp-k-result', `K: <b>${k}</b><br/>°C: <b>${+c.toFixed(4)}</b><br/>°F: <b>${+(c*9/5+32).toFixed(4)}</b>`)
}

// ── Скорость ──────────────────────────────────────────────────────────────────

;(window as any).solveSpeed = () => {
  const vR = (document.getElementById('sp-v') as HTMLInputElement).value
  const tR = (document.getElementById('sp-t') as HTMLInputElement).value
  const sR = (document.getElementById('sp-s') as HTMLInputElement).value
  const v = vR ? parseFloat(vR) : null
  const t = tR ? parseFloat(tR) : null
  const s = sR ? parseFloat(sR) : null
  if ([v,t,s].filter(x=>x===null).length !== 1) { show('sp-result','Заполни ровно два поля',true); return }
  if (v===null) show('sp-result',`v = ${s}/${t} = <b>${+(s!/t!).toFixed(6)} км/ч</b>`)
  else if (t===null) show('sp-result',`t = ${s}/${v} = <b>${+(s!/v!).toFixed(6)} ч</b>`)
  else show('sp-result',`s = ${v}×${t} = <b>${+(v*t).toFixed(6)} км</b>`)
}

// ── Делители ──────────────────────────────────────────────────────────────────

;(window as any).solveDivisors = () => {
  const n = Math.floor((document.getElementById('dv-n') as HTMLInputElement).valueAsNumber)
  if (!n || n<1) { show('dv-result','Введи натуральное число',true); return }
  if (n>1000000) { show('dv-result','Число слишком большое (макс. 1 000 000)',true); return }
  const divs: number[] = []
  for (let i=1; i<=Math.sqrt(n); i++) if (n%i===0) { divs.push(i); if(i!==n/i) divs.push(n/i) }
  divs.sort((a,b)=>a-b)
  show('dv-result',
    `Делители ${n}: <b>${divs.join(', ')}</b><br/>Количество: <b>${divs.length}</b><br/>` +
    (divs.length===2 ? '<span style="color:#38a169">✓ Простое число</span>' : '<span style="color:#805ad5">Составное число</span>'))
}

// ── Факториал и комбинаторика ─────────────────────────────────────────────────

function factorial(n: number): bigint {
  let r = 1n; for (let i=2; i<=n; i++) r *= BigInt(i); return r
}
;(window as any).solveFactorial = () => {
  const n = Math.floor((document.getElementById('fc-n') as HTMLInputElement).valueAsNumber)
  if (n<0||n>20) { show('fc-result','n должно быть от 0 до 20',true); return }
  const steps = Array.from({length:n},(_,i)=>i+1).join(' × ') || '1'
  show('fc-result',`${n}! = ${steps} = <b>${factorial(n)}</b>`)
}
;(window as any).solveCombinations = () => {
  const n = Math.floor((document.getElementById('cn-n') as HTMLInputElement).valueAsNumber)
  const k = Math.floor((document.getElementById('cn-k') as HTMLInputElement).valueAsNumber)
  if (k>n) { show('cn-result','k не может быть больше n',true); return }
  show('cn-result',`C(${n},${k}) = <b>${factorial(n)/(factorial(k)*factorial(n-k))}</b>`)
}
;(window as any).solvePermutations = () => {
  const n = Math.floor((document.getElementById('an-n') as HTMLInputElement).valueAsNumber)
  const k = Math.floor((document.getElementById('an-k') as HTMLInputElement).valueAsNumber)
  if (k>n) { show('an-result','k не может быть больше n',true); return }
  show('an-result',`A(${n},${k}) = <b>${factorial(n)/factorial(n-k)}</b>`)
}

// ── Уравнения ─────────────────────────────────────────────────────────────────

;(window as any).solveLinear = () => {
  const a = val('eq-a'), b = val('eq-b')
  if (a === 0) { show('eq-lin-result', 'a не может быть 0', true); return }
  const x = +(-b / a).toFixed(8)
  show('eq-lin-result', `${a}x + (${b}) = 0<br/>x = −(${b}) / ${a} = <b>${x}</b>`)
}

;(window as any).solveQuadratic = () => {
  const a = val('eq-qa'), b = val('eq-qb'), c = val('eq-qc')
  if (a === 0) { show('eq-quad-result', 'a не может быть 0 (иначе это линейное уравнение)', true); return }
  const D = b * b - 4 * a * c
  if (D < 0) {
    show('eq-quad-result', `D = ${b}² − 4·${a}·${c} = <b>${+D.toFixed(6)}</b><br/>D &lt; 0 — вещественных корней нет`)
  } else if (D === 0) {
    const x = +(-b / (2 * a)).toFixed(8)
    show('eq-quad-result', `D = <b>0</b><br/>Один корень: x = −b / 2a = <b>${x}</b>`)
  } else {
    const x1 = +((-b + Math.sqrt(D)) / (2 * a)).toFixed(8)
    const x2 = +((-b - Math.sqrt(D)) / (2 * a)).toFixed(8)
    show('eq-quad-result', `D = ${b}² − 4·${a}·${c} = <b>${+D.toFixed(6)}</b><br/>x₁ = <b>${x1}</b>, x₂ = <b>${x2}</b>`)
  }
}

// ── Координаты ────────────────────────────────────────────────────────────────

;(window as any).solveCoordinates = () => {
  const x1 = val('co-x1'), y1 = val('co-y1'), x2 = val('co-x2'), y2 = val('co-y2')
  const dist = +Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2).toFixed(6)
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2
  show('co-result',
    `Расстояние AB = √((${x2}−${x1})² + (${y2}−${y1})²) = <b>${dist}</b><br/>` +
    `Середина M = (<b>${mx}; ${my}</b>)`)
}

// ── Прогрессии ────────────────────────────────────────────────────────────────

;(window as any).solveArith = () => {
  const a1 = val('ap-a1'), d = val('ap-d'), n = Math.floor(val('ap-n'))
  if (n < 1) { show('ap-result', 'n должно быть ≥ 1', true); return }
  const an = a1 + (n - 1) * d
  const S = n * (a1 + an) / 2
  show('ap-result', `a${n} = ${a1} + (${n}−1)·${d} = <b>${+an.toFixed(6)}</b><br/>Сумма S₁..${n} = <b>${+S.toFixed(6)}</b>`)
}

;(window as any).solveGeom = () => {
  const b1 = val('gp-b1'), q = val('gp-q'), n = Math.floor(val('gp-n'))
  if (n < 1) { show('gp-result', 'n должно быть ≥ 1', true); return }
  const bn = b1 * q ** (n - 1)
  const S = q === 1 ? b1 * n : b1 * (q ** n - 1) / (q - 1)
  show('gp-result', `b${n} = ${b1} · ${q}^${n-1} = <b>${+bn.toFixed(6)}</b><br/>Сумма S₁..${n} = <b>${+S.toFixed(6)}</b>`)
}

// ── Округление ────────────────────────────────────────────────────────────────

;(window as any).solveRounding = () => {
  const raw = (document.getElementById('ro-num') as HTMLInputElement).value.trim().replace(',', '.')
  const num = parseFloat(raw)
  if (isNaN(num)) { show('ro-result', 'Введи корректное число', true); return }
  const prec = parseInt((document.getElementById('ro-prec') as HTMLSelectElement).value, 10)
  const rounded = prec >= 0
    ? +num.toFixed(prec)
    : Math.round(num / 10 ** (-prec)) * 10 ** (-prec)
  const labels: Record<number, string> = { 0: 'единиц', 1: 'десятых', 2: 'сотых', 3: 'тысячных', '-1': 'десятков', '-2': 'сотен' }
  show('ro-result', `${num} округлённое до ${labels[prec]} = <b>${rounded}</b>`)
}

// ── Масштаб ───────────────────────────────────────────────────────────────────

;(window as any).solveScaleToReal = () => {
  const mapCm = val('sc-map'), n = val('sc-n1')
  if (!n) { show('sc-real-result', 'Введи масштаб N', true); return }
  const realCm = mapCm * n
  const realM = +(realCm / 100).toFixed(4)
  const realKm = +(realCm / 100000).toFixed(6)
  show('sc-real-result', `${mapCm} см × ${n} = <b>${realCm} см</b> = <b>${realM} м</b> = <b>${realKm} км</b>`)
}

;(window as any).solveScaleToMap = () => {
  const realM = val('sc-real'), n = val('sc-n2')
  if (!n) { show('sc-map-result', 'Введи масштаб N', true); return }
  const realCm = realM * 100
  const mapCm = +(realCm / n).toFixed(6)
  show('sc-map-result', `${realM} м = ${realCm} см; на карте: ${realCm} / ${n} = <b>${mapCm} см</b>`)
}

// ── Работа ────────────────────────────────────────────────────────────────────

;(window as any).solveWork = () => {
  const a = val('wk-a'), b = val('wk-b')
  if (a <= 0 || b <= 0) { show('wk-result', 'Введи положительное время', true); return }
  const rate = +(1/a + 1/b).toFixed(6)
  const together = +(1 / (1/a + 1/b)).toFixed(4)
  show('wk-result',
    `Производительность 1-го: 1/${a} = ${+(1/a).toFixed(4)}/ч<br/>` +
    `Производительность 2-го: 1/${b} = ${+(1/b).toFixed(4)}/ч<br/>` +
    `Вместе: ${+(1/a).toFixed(4)} + ${+(1/b).toFixed(4)} = <b>${rate}/ч</b><br/>` +
    `Время вместе: 1 ÷ ${rate} = <b>${together} ч</b>`)
}

;(window as any).solveWorkPartial = () => {
  const a = val('wkp-a'), b = val('wkp-b'), n = val('wkp-n')
  if (a <= 0 || b <= 0 || n <= 0) { show('wkp-result', 'Все значения должны быть > 0', true); return }
  const rate = 1/a + 1/b
  const done = +(rate * n).toFixed(6)
  const pct = +(done * 100).toFixed(2)
  const remaining = +Math.max(0, 1 - done).toFixed(6)
  show('wkp-result',
    `За 1 час вместе делают: 1/${a} + 1/${b} = ${+rate.toFixed(6)}<br/>` +
    `За ${n} ч: ${+rate.toFixed(6)} × ${n} = <b>${done}</b> работы (<b>${pct}%</b>)<br/>` +
    (done >= 1 ? '✅ Работа уже выполнена!' : `Осталось: <b>${remaining}</b>`))
}

;(window as any).solveWorkDelayed = () => {
  const a = val('wkd-a'), b = val('wkd-b'), k = val('wkd-k')
  if (a <= 0 || b <= 0 || k < 0) { show('wkd-result', 'Введи корректные данные', true); return }
  const doneAlone = k / a
  if (doneAlone >= 1) { show('wkd-result', `1-й справился за ${k} ч ещё до прихода 2-го! Итого: <b>${k} ч</b>`); return }
  const remaining = 1 - doneAlone
  const rateTogether = 1/a + 1/b
  const timeTogether = +(remaining / rateTogether).toFixed(4)
  const total = +(k + timeTogether).toFixed(4)
  show('wkd-result',
    `1-й работал ${k} ч один: сделал ${+doneAlone.toFixed(4)} части<br/>` +
    `Осталось: ${+remaining.toFixed(4)}<br/>` +
    `Вместе делают ${+rateTogether.toFixed(4)}/ч → ещё ${timeTogether} ч<br/>` +
    `Итого времени: ${k} + ${timeTogether} = <b>${total} ч</b>`)
}

// ── Система тренировок ────────────────────────────────────────────────────────

function rnd(min: number, max: number) { return Math.floor(Math.random()*(max-min+1))+min }

interface Problem { question: string; answer: string; hint: string }

function genProblem(section: string): Problem {
  switch (section) {
    case 'proportion': {
      const a=rnd(2,12), b=rnd(2,12), d=rnd(2,12), c=a*d/b
      if (!Number.isInteger(c)) return genProblem(section)
      return { question:`${a} / ${b} = ${c} / ?`, answer:String(d), hint:`d = b×c/a = ${b}×${c}/${a} = ${d}` }
    }
    case 'geometry': {
      const t=rnd(0,4)
      if (t===0) { const r=rnd(1,8), a=+(Math.PI*r*r).toFixed(2); return { question:`Круг: r=${r}. Площадь? (π≈3.14, 2 знака)`, answer:String(a), hint:`S=π·r²≈${a}` } }
      if (t===1) { const a=rnd(2,15), b=rnd(2,15); return { question:`Прямоугольник: a=${a}, b=${b}. Площадь?`, answer:String(a*b), hint:`S=a·b=${a*b}` } }
      if (t===2) { const a=rnd(2,12); return { question:`Квадрат: a=${a}. Площадь?`, answer:String(a*a), hint:`S=a²=${a*a}` } }
      if (t===3) { const a=rnd(2,12), h=rnd(2,12), s=a*h/2; if (!Number.isInteger(s)) return genProblem(section); return { question:`Треугольник: a=${a}, h=${h}. Площадь?`, answer:String(s), hint:`S=a·h/2=${s}` } }
      const a=rnd(2,10), b=rnd(2,10), h=rnd(2,10), s=(a+b)*h/2
      if (!Number.isInteger(s)) return genProblem(section)
      return { question:`Трапеция: a=${a}, b=${b}, h=${h}. Площадь?`, answer:String(s), hint:`S=(a+b)/2·h=${s}` }
    }
    case 'fraction': {
      const ops=['+','-','*','/'], op=ops[rnd(0,3)]
      const n1=rnd(1,9), d1=rnd(2,6), n2=rnd(1,9), d2=rnd(2,6)
      try {
        const r=evalFracExpr(`${n1}/${d1}${op}${n2}/${d2}`)
        const ans=fracToStr(r), opStr=op==='*'?'×':op==='/'?'÷':op
        return { question:`${n1}/${d1} ${opStr} ${n2}/${d2} = ?`, answer:ans, hint:`Ответ: ${ans}` }
      } catch { return genProblem(section) }
    }
    case 'percent': {
      if (rnd(0,1)===0) {
        const p=rnd(5,75), total=rnd(20,200), res=p*total/100
        if (!Number.isInteger(res)) return genProblem(section)
        return { question:`Найди ${p}% от ${total}`, answer:String(res), hint:`${p}/100×${total}=${res}` }
      } else {
        const part=rnd(5,50), total=rnd(part+1,200), res=part*100/total
        if (!Number.isInteger(res)) return genProblem(section)
        return { question:`Сколько % составляет ${part} от ${total}?`, answer:String(res), hint:`${part}/${total}×100=${res}%` }
      }
    }
    case 'gcdlcm': {
      const a=rnd(4,30), b=rnd(4,30)
      if (rnd(0,1)===0) { const g=gcdTwo(a,b); return { question:`НОД(${a}, ${b}) = ?`, answer:String(g), hint:`НОД(${a},${b})=${g}` } }
      const l=Math.abs(a*b)/gcdTwo(a,b)
      return { question:`НОК(${a}, ${b}) = ?`, answer:String(l), hint:`НОК(${a},${b})=${l}` }
    }
    case 'power': {
      const t=rnd(0,2)
      if (t===0) { const base=rnd(2,9), exp=rnd(2,4); return { question:`${base}^${exp} = ?`, answer:String(base**exp), hint:`${base}^${exp}=${base**exp}` } }
      if (t===1) { const sq=rnd(2,15); return { question:`√${sq*sq} = ?`, answer:String(sq), hint:`√${sq*sq}=${sq}` } }
      const cb=rnd(2,6); return { question:`∛${cb**3} = ?`, answer:String(cb), hint:`∛${cb**3}=${cb}` }
    }
    case 'stats': {
      const count=rnd(4,7), nums=Array.from({length:count},()=>rnd(1,20))
      const mean=+(nums.reduce((s,x)=>s+x,0)/count).toFixed(2)
      return { question:`Среднее чисел: ${nums.join(', ')}?`, answer:String(mean), hint:`Сумма/${count}=${mean}` }
    }
    case 'divisors': {
      const n=rnd(2,50)
      const divs: number[]=[]
      for (let i=1; i<=Math.sqrt(n); i++) if (n%i===0) { divs.push(i); if(i!==n/i) divs.push(n/i) }
      const isPrime=divs.length===2
      return { question:`Простое ли число ${n}? (да / нет)`, answer:isPrime?'да':'нет', hint:`Делители: ${divs.sort((a,b)=>a-b).join(', ')}` }
    }
    case 'factorial': {
      const n=rnd(1,8)
      return { question:`${n}! = ?`, answer:String(factorial(n)), hint:`${n}!=${factorial(n)}` }
    }
    case 'units': {
      const t = rnd(0, 2)
      if (t === 0) {
        const km = rnd(1, 20)
        return { question: `${km} км = ? м`, answer: String(km * 1000), hint: `1 км = 1000 м → ${km} × 1000 = ${km * 1000}` }
      }
      if (t === 1) {
        const kg = rnd(1, 10)
        return { question: `${kg} кг = ? г`, answer: String(kg * 1000), hint: `1 кг = 1000 г → ${kg} × 1000 = ${kg * 1000}` }
      }
      const h = rnd(1, 5)
      return { question: `${h} ч = ? мин`, answer: String(h * 60), hint: `1 ч = 60 мин → ${h} × 60 = ${h * 60}` }
    }
    case 'temp': {
      const t = rnd(0, 1)
      if (t === 0) {
        const c = rnd(0, 50)
        const f = +(c * 9 / 5 + 32).toFixed(1)
        return { question: `${c}°C → °F = ?`, answer: String(f), hint: `°F = ${c}×9/5 + 32 = ${f}` }
      }
      const f = [32, 68, 98.6, 212, -40][rnd(0, 4)]
      const c = +((f - 32) * 5 / 9).toFixed(1)
      return { question: `${f}°F → °C = ?`, answer: String(c), hint: `°C = (${f}−32)×5/9 = ${c}` }
    }
    case 'speed': {
      const t2 = rnd(0, 2)
      if (t2 === 0) {
        const v = rnd(40, 120), t = rnd(1, 5), s = v * t
        return { question: `v = ${v} км/ч, t = ${t} ч. Путь s = ?`, answer: String(s), hint: `s = v×t = ${v}×${t} = ${s} км` }
      }
      if (t2 === 1) {
        const s = rnd(100, 600), t = rnd(2, 6), v = Math.round(s / t)
        if (s % t !== 0) return genProblem(section)
        return { question: `s = ${s} км, t = ${t} ч. Скорость v = ?`, answer: String(v), hint: `v = s/t = ${s}/${t} = ${v} км/ч` }
      }
      const v = rnd(40, 120), s = rnd(100, 600), t = Math.round(s / v * 10) / 10
      if (!Number.isInteger(s / v)) {
        const vv = rnd(40, 120), ss = vv * rnd(1, 5)
        const tt = ss / vv
        return { question: `v = ${vv} км/ч, s = ${ss} км. Время t = ?`, answer: String(tt), hint: `t = s/v = ${ss}/${vv} = ${tt} ч` }
      }
      return { question: `v = ${v} км/ч, s = ${s} км. Время t = ?`, answer: String(s / v), hint: `t = s/v = ${s}/${v} = ${s / v} ч` }
    }
    case 'equations': {
      if (rnd(0, 1) === 0) {
        // Линейное: ax + b = 0 → x = -b/a
        const x = rnd(-10, 10), a = rnd(1, 9), b = -a * x
        return { question: `Реши: ${a}x + (${b}) = 0`, answer: String(x), hint: `x = −(${b}) / ${a} = ${x}` }
      } else {
        // Квадратное с целыми корнями: (x - r1)(x - r2) = 0
        const r1 = rnd(-8, 8), r2 = rnd(-8, 8)
        const b = -(r1 + r2), c = r1 * r2
        const bSign = b >= 0 ? `+${b}` : String(b)
        const cSign = c >= 0 ? `+${c}` : String(c)
        const ans = [r1, r2].sort((a, b) => a - b).join(' и ')
        return { question: `Реши: x²${bSign}x${cSign} = 0`, answer: ans, hint: `Корни: ${r1} и ${r2} (проверь через скобки)` }
      }
    }
    case 'coordinates': {
      const x1 = rnd(-5, 5), y1 = rnd(-5, 5), dx = rnd(1, 6), dy = rnd(1, 6)
      const x2 = x1 + dx, y2 = y1 + dy
      if (rnd(0, 1) === 0) {
        const dist = +Math.sqrt(dx * dx + dy * dy).toFixed(2)
        return { question: `Расстояние от (${x1};${y1}) до (${x2};${y2}) = ?`, answer: String(dist), hint: `√(${dx}²+${dy}²) = ${dist}` }
      } else {
        const mx = (x1 + x2) / 2, my = (y1 + y2) / 2
        return { question: `Середина отрезка (${x1};${y1})–(${x2};${y2}) = ?`, answer: `${mx};${my}`, hint: `(${x1}+${x2})/2; (${y1}+${y2})/2 = ${mx};${my}` }
      }
    }
    case 'progressions': {
      if (rnd(0, 1) === 0) {
        const a1 = rnd(1, 10), d = rnd(1, 5), n = rnd(3, 8)
        const an = a1 + (n - 1) * d
        return { question: `АП: a₁=${a1}, d=${d}. Найди a${n}`, answer: String(an), hint: `a${n} = ${a1} + (${n}−1)·${d} = ${an}` }
      } else {
        const b1 = rnd(1, 5), q = rnd(2, 4), n = rnd(2, 5)
        const bn = b1 * q ** (n - 1)
        return { question: `ГП: b₁=${b1}, q=${q}. Найди b${n}`, answer: String(bn), hint: `b${n} = ${b1}·${q}^${n-1} = ${bn}` }
      }
    }
    case 'rounding': {
      const digits = rnd(1, 3)
      const base = rnd(100, 9999)
      const num = base / 100
      const rounded = +num.toFixed(digits)
      const labels: Record<number, string> = { 1: 'десятых', 2: 'сотых', 3: 'тысячных' }
      return { question: `Округли ${num} до ${labels[digits]}`, answer: String(rounded), hint: `${num} → ${rounded}` }
    }
    case 'scale': {
      const n = [1000, 2000, 5000, 10000, 25000][rnd(0, 4)]
      if (rnd(0, 1) === 0) {
        const mapCm = rnd(1, 10)
        const realM = mapCm * n / 100
        return { question: `Масштаб 1:${n}. На карте ${mapCm} см. Реальное расстояние (м)?`, answer: String(realM), hint: `${mapCm}×${n}/100 = ${realM} м` }
      } else {
        const realM = rnd(1, 20) * (n / 1000)
        const mapCm = realM * 100 / n
        return { question: `Масштаб 1:${n}. Реальное ${realM} м. На карте (см)?`, answer: String(mapCm), hint: `${realM}×100/${n} = ${mapCm} см` }
      }
    }
    case 'work': {
      const a = rnd(2, 8), b = rnd(2, 8)
      const t = +(1 / (1 / a + 1 / b)).toFixed(2)
      return { question: `1-й делает за ${a} ч, 2-й за ${b} ч. Вместе за сколько часов?`, answer: String(t), hint: `1/(1/${a}+1/${b}) = ${t} ч` }
    }
    default: return { question:'?', answer:'0', hint:'' }
  }
}

function encodeAttr(s: string) { return s.replace(/\\/g,'\\\\').replace(/'/g,'&#39;').replace(/"/g,'&quot;') }

function isAnswerCorrect(user: string, correct: string): boolean {
  const u = user.trim().toLowerCase().replace(',', '.')
  const c = correct.trim().toLowerCase()
  if (u === c) return true
  // числовое сравнение с допуском
  const uf = parseFloat(u), cf = parseFloat(c)
  if (!isNaN(uf) && !isNaN(cf)) return Math.abs(uf - cf) < 0.05
  // координаты вида "2;3"
  if (u.includes(';') && c.includes(';')) {
    const [ux,uy] = u.split(';').map(Number), [cx,cy] = c.split(';').map(Number)
    return Math.abs(ux-cx) < 0.05 && Math.abs(uy-cy) < 0.05
  }
  // два корня вида "1 и 2" в любом порядке
  const uParts = u.split(/\s+и\s+/).map(Number).sort((a,b)=>a-b)
  const cParts = c.split(/\s+и\s+/).map(Number).sort((a,b)=>a-b)
  if (uParts.length === 2 && cParts.length === 2)
    return Math.abs(uParts[0]-cParts[0]) < 0.05 && Math.abs(uParts[1]-cParts[1]) < 0.05
  return false
}

// ── Мини-тест ─────────────────────────────────────────────────────────────────

const TEST_SIZE = 5

interface TestState {
  section: string
  problems: Problem[]
  current: number
  results: { correct: boolean; problem: Problem; userAnswer: string }[]
  startTime: number
}

let activeTest: TestState | null = null

function startMiniTest(section: string) {
  // Генерируем 5 уникальных задач
  const problems: Problem[] = []
  let tries = 0
  while (problems.length < TEST_SIZE && tries < 100) {
    tries++
    const p = genProblem(section)
    if (!problems.some(x => x.question === p.question)) problems.push(p)
  }
  activeTest = { section, problems, current: 0, results: [], startTime: Date.now() }
  renderTestQuestion()
}

function renderTestQuestion() {
  if (!activeTest) return
  const { section, problems, current } = activeTest
  const problem = problems[current]
  const zone = document.getElementById(`train-${section}`)!
  const eAns = encodeAttr(problem.answer)
  const pct = Math.round((current / TEST_SIZE) * 100)

  zone.innerHTML = `
    <div class="training-box">
      <div class="test-header">
        <span class="test-counter">Вопрос ${current + 1} из ${TEST_SIZE}</span>
        <div class="test-bar"><div class="test-bar-fill" style="width:${pct}%"></div></div>
      </div>
      <p class="training-question">${problem.question}</p>
      <div class="training-row">
        <input type="text" id="train-inp-${section}" placeholder="Ответ…"
          onkeydown="if(event.key==='Enter') submitTestAnswer('${section}','${eAns}')" />
        <button onclick="submitTestAnswer('${section}','${eAns}')">Ответить →</button>
      </div>
      <div id="train-res-${section}" class="result hidden"></div>
    </div>`
  setTimeout(() => document.getElementById(`train-inp-${section}`)?.focus(), 50)
}

;(window as any).submitTestAnswer = (section: string, eAns: string) => {
  if (!activeTest) return
  const answer = eAns.replace(/&#39;/g, "'").replace(/&quot;/g, '"')
  const input = document.getElementById(`train-inp-${section}`) as HTMLInputElement
  const isOk = isAnswerCorrect(input.value, answer)
  const problem = activeTest.problems[activeTest.current]
  activeTest.results.push({ correct: isOk, problem, userAnswer: input.value.trim() })
  activeTest.current++

  const el = document.getElementById(`train-res-${section}`)!
  el.className = `result ${isOk ? 'ok' : 'error'}`
  el.innerHTML = isOk ? `✅ Правильно!` : `❌ Ответ: <b>${answer}</b>`

  const delay = isOk ? 500 : 1000
  if (activeTest.current >= TEST_SIZE) {
    setTimeout(() => showTestResults(section), delay)
  } else {
    setTimeout(() => renderTestQuestion(), delay)
  }
}

function showTestResults(section: string) {
  if (!activeTest) return
  const { results, startTime } = activeTest
  const correct = results.filter(r => r.correct).length
  const secs = Math.round((Date.now() - startTime) / 1000)
  const zone = document.getElementById(`train-${section}`)!
  const grade = correct === TEST_SIZE ? 'perfect' : correct >= 3 ? 'good' : 'poor'
  const medals: Record<string,string> = { perfect: '🏆', good: '👍', poor: '📚' }
  const messages: Record<string,string> = {
    perfect: 'Отлично! Все верно!',
    good: 'Хорошо, но есть над чем поработать',
    poor: 'Стоит повторить материал'
  }
  const mistakes = results.filter(r => !r.correct)

  zone.innerHTML = `
    <div class="training-box test-results">
      <div class="test-score-wrap">
        <div class="test-score ${grade}">${correct}/${TEST_SIZE}</div>
        <div class="test-score-label">${medals[grade]} ${messages[grade]}</div>
        <div class="test-time">⏱ ${secs} сек</div>
      </div>
      ${mistakes.length ? `
        <div class="test-mistakes">
          <div class="test-mistakes-title">Ошибки:</div>
          ${mistakes.map(r => `
            <div class="test-mistake-item">
              <span class="test-mistake-q">${r.problem.question}</span>
              <span class="test-mistake-ans">→ <b>${r.problem.answer}</b></span>
            </div>`).join('')}
        </div>` : ''}
      <button onclick="startMiniTest('${section}')" style="margin-top:12px">🔄 Ещё раз</button>
    </div>`
  activeTest = null
}

;(window as any).startMiniTest = startMiniTest

// ── Переключение вкладок ──────────────────────────────────────────────────────

function initTabs(btnSel: string, prefix: string) {
  document.querySelectorAll<HTMLElement>(btnSel).forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.tab??btn.dataset.geo??btn.dataset.pct??btn.dataset.pow??btn.dataset.units??btn.dataset.temp??btn.dataset.fact!
      document.querySelectorAll(btnSel).forEach(b=>b.classList.remove('active'))
      document.querySelectorAll(`[id^="${prefix}"]`).forEach(p=>p.classList.remove('active'))
      btn.classList.add('active')
      document.getElementById(prefix+key)?.classList.add('active')
    })
  })
}

initTabs('.geo-btn','geo-')
initTabs('.pct-btn','pct-')
initTabs('.pow-btn','pow-')
initTabs('.units-btn','units-')
initTabs('.temp-btn','temp-')
initTabs('.fact-btn','fact-')
initTabs('.eq-btn','eq-')
initTabs('.prog-btn','prog-')
initTabs('.sc-btn','sc-')
initTabs('.wk-btn','wk-')

// ── Сайдбар ───────────────────────────────────────────────────────────────────

function initSidebar() {
  const sidebar = document.getElementById('sidebar')!

  // Клики по вкладкам
  sidebar.querySelectorAll<HTMLElement>('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sidebar.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'))
      document.querySelectorAll('.tab').forEach(p => p.classList.remove('active'))
      btn.classList.add('active')
      document.getElementById('tab-' + btn.dataset.tab!)?.classList.add('active')
    })
  })

  // SortableJS внутри каждой группы
  const SortableLib = (window as any).Sortable
  if (!SortableLib) return

  document.querySelectorAll<HTMLElement>('.sidebar-group-items').forEach(groupEl => {
    const groupName = groupEl.dataset.group!

    // Восстановить сохранённый порядок
    const saved = localStorage.getItem(`sg-${groupName}`)
    if (saved) {
      try {
        (JSON.parse(saved) as string[]).forEach(tab => {
          const btn = groupEl.querySelector<HTMLElement>(`[data-tab="${tab}"]`)
          if (btn) groupEl.appendChild(btn)
        })
      } catch {}
    }

    new SortableLib(groupEl, {
      animation: 180,
      ghostClass: 'drag-over',
      chosenClass: 'dragging',
      delay: 150,
      delayOnTouchOnly: true,
      onEnd: () => {
        const order = Array.from(groupEl.querySelectorAll<HTMLElement>('.tab-btn'))
          .map(b => b.dataset.tab!)
        localStorage.setItem(`sg-${groupName}`, JSON.stringify(order))
      }
    })
  })
}
initSidebar()

// ── Мобильное меню ────────────────────────────────────────────────────────────

const menuToggle = document.getElementById('menuToggle')!
const sidebarEl = document.getElementById('sidebar')!
const overlay = document.getElementById('sidebarOverlay')!

const openMenu = () => { sidebarEl.classList.add('open'); overlay.classList.add('open') }
const closeMenu = () => { sidebarEl.classList.remove('open'); overlay.classList.remove('open') }

menuToggle.addEventListener('click', () => sidebarEl.classList.contains('open') ? closeMenu() : openMenu())
overlay.addEventListener('click', closeMenu)
sidebarEl.querySelectorAll('.tab-btn').forEach(btn => btn.addEventListener('click', () => { if (window.innerWidth<=640) closeMenu() }))
