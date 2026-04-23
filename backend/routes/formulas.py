from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import sqlite3
import os

router = APIRouter()

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "db", "store.db")


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


# --- Начальный набор формул ---

SEED_FORMULAS = [
    # Геометрия плоская
    ("Площадь квадрата",          r"S = a^2",                       "геометрия", "Сторона a"),
    ("Площадь прямоугольника",    r"S = a \cdot b",                  "геометрия", "Стороны a и b"),
    ("Площадь треугольника",      r"S = \dfrac{a \cdot h}{2}",       "геометрия", "Основание a, высота h"),
    ("Площадь круга",             r"S = \pi r^2",                    "геометрия", "Радиус r"),
    ("Длина окружности",          r"C = 2 \pi r",                    "геометрия", "Радиус r"),
    ("Площадь трапеции",          r"S = \dfrac{(a+b)}{2} \cdot h",   "геометрия", "Основания a, b и высота h"),
    ("Площадь параллелограмма",   r"S = a \cdot h",                  "геометрия", "Основание a, высота h"),
    # Геометрия пространственная
    ("Объём куба",                r"V = a^3",                        "геометрия", "Ребро a"),
    ("Объём параллелепипеда",     r"V = a \cdot b \cdot c",          "геометрия", "Рёбра a, b, c"),
    ("Объём цилиндра",            r"V = \pi r^2 h",                  "геометрия", "Радиус r, высота h"),
    ("Объём конуса",              r"V = \dfrac{1}{3} \pi r^2 h",     "геометрия", "Радиус r, высота h"),
    ("Объём пирамиды",            r"V = \dfrac{1}{3} S h",           "геометрия", "Площадь основания S, высота h"),
    # Алгебра
    ("Дискриминант",              r"D = b^2 - 4ac",                  "алгебра",   "Коэффициенты a, b, c"),
    ("Корни квадратного уравнения",r"x = \dfrac{-b \pm \sqrt{D}}{2a}","алгебра",  "D — дискриминант"),
    ("Разность квадратов",        r"a^2 - b^2 = (a-b)(a+b)",         "алгебра",   ""),
    ("Квадрат суммы",             r"(a+b)^2 = a^2 + 2ab + b^2",      "алгебра",   ""),
    ("Квадрат разности",          r"(a-b)^2 = a^2 - 2ab + b^2",      "алгебра",   ""),
    # Арифметика
    ("Сумма n первых натуральных", r"S = \dfrac{n(n+1)}{2}",          "арифметика",""),
    ("Нахождение процента",       r"P = \dfrac{x}{n} \cdot 100",      "арифметика","x — часть, n — целое"),
    ("Арифметическая прогрессия (член)", r"a_n = a_1 + (n-1)d",      "арифметика","a₁ — первый член, d — разность"),
    ("Арифметическая прогрессия (сумма)",r"S = \dfrac{n(a_1+a_n)}{2}","арифметика",""),
    # Физика 7 класс
    ("Скорость",                  r"v = \dfrac{s}{t}",               "физика",    "s — путь, t — время"),
    ("Путь",                      r"s = v \cdot t",                  "физика",    "v — скорость, t — время"),
    ("Давление",                  r"P = \dfrac{F}{S}",               "физика",    "F — сила, S — площадь"),
    ("Плотность",                 r"\rho = \dfrac{m}{V}",            "физика",    "m — масса, V — объём"),
    ("КПД",                       r"\eta = \dfrac{A_{\text{пол}}}{A_{\text{зат}}} \cdot 100\%",
                                                                      "физика",    "Полезная и затраченная работа"),
]


def init_db():
    """Создаёт таблицы и заполняет формулы (если БД пустая)."""
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    schema_path = os.path.join(os.path.dirname(__file__), "..", "db", "schema.sql")
    conn = get_db()
    with open(schema_path, "r", encoding="utf-8") as f:
        conn.executescript(f.read())
    # Заполнить только если таблица пустая
    count = conn.execute("SELECT COUNT(*) FROM formulas").fetchone()[0]
    if count == 0:
        conn.executemany(
            "INSERT INTO formulas (name, latex, category, description) VALUES (?,?,?,?)",
            SEED_FORMULAS,
        )
        conn.commit()
    conn.close()


# --- Эндпоинты ---

@router.get("/all")
def get_all_formulas():
    """Все формулы, сгруппированные по категориям."""
    conn = get_db()
    rows = conn.execute(
        "SELECT id, name, latex, category, description FROM formulas ORDER BY category, name"
    ).fetchall()
    conn.close()
    result: dict[str, list] = {}
    for r in rows:
        cat = r["category"]
        if cat not in result:
            result[cat] = []
        result[cat].append({
            "id": r["id"],
            "name": r["name"],
            "latex": r["latex"],
            "description": r["description"],
        })
    return result


@router.get("/search")
def search_formulas(q: str):
    """Поиск по названию или категории."""
    if not q or len(q.strip()) < 1:
        raise HTTPException(status_code=400, detail="Введите строку поиска")
    conn = get_db()
    pattern = f"%{q.strip()}%"
    rows = conn.execute(
        "SELECT id, name, latex, category, description FROM formulas "
        "WHERE name LIKE ? OR category LIKE ? OR description LIKE ? "
        "ORDER BY category, name",
        (pattern, pattern, pattern),
    ).fetchall()
    conn.close()
    return [
        {"id": r["id"], "name": r["name"], "latex": r["latex"],
         "category": r["category"], "description": r["description"]}
        for r in rows
    ]


@router.get("/{formula_id}")
def get_formula(formula_id: int):
    """Одна формула по id."""
    conn = get_db()
    row = conn.execute(
        "SELECT id, name, latex, category, description FROM formulas WHERE id = ?",
        (formula_id,),
    ).fetchone()
    conn.close()
    if row is None:
        raise HTTPException(status_code=404, detail="Формула не найдена")
    return dict(row)
