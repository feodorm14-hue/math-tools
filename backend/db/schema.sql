-- Таблица формул
CREATE TABLE IF NOT EXISTS formulas (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    name     TEXT    NOT NULL,          -- короткое название: "Площадь круга"
    latex    TEXT    NOT NULL,          -- LaTeX-строка: "S = \pi r^2"
    category TEXT    NOT NULL,          -- "геометрия", "алгебра", "арифметика", "физика"
    description TEXT DEFAULT ''        -- пояснение на русском
);

-- История вычислений
CREATE TABLE IF NOT EXISTS history (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    endpoint   TEXT    NOT NULL,        -- "/algebra/linear"
    input_json TEXT    NOT NULL,        -- JSON входных данных
    result_json TEXT   NOT NULL,        -- JSON результата
    created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_formulas_category ON formulas(category);
CREATE INDEX IF NOT EXISTS idx_formulas_name     ON formulas(name);
