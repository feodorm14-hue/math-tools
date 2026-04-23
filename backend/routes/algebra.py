from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sympy import symbols, solve, sqrt, Rational, latex, simplify
from sympy import symbols as sym

router = APIRouter()

# --- Квадратное уравнение ---

class QuadraticInput(BaseModel):
    a: float
    b: float
    c: float

@router.post("/quadratic")
def solve_quadratic(body: QuadraticInput):
    """Решает ax² + bx + c = 0"""
    a, b, c = body.a, body.b, body.c
    if a == 0:
        raise HTTPException(status_code=400, detail="a не может быть 0 (это не квадратное уравнение)")

    x = symbols("x")
    expr = a*x**2 + b*x + c
    roots = solve(expr, x)

    D = b**2 - 4*a*c

    return {
        "discriminant": float(D),
        "roots": [str(r) for r in roots],
        "roots_latex": [latex(r) for r in roots],
        "count": len(roots),
    }


# --- Уравнение первой степени ---

class LinearInput(BaseModel):
    a: float   # ax + b = c
    b: float
    c: float

@router.post("/linear")
def solve_linear(body: LinearInput):
    """Решает ax + b = c"""
    a, b, c = body.a, body.b, body.c
    if a == 0:
        raise HTTPException(status_code=400, detail="a не может быть 0")

    x = symbols("x")
    root = solve(a*x + b - c, x)[0]
    return {
        "x": str(root),
        "x_latex": latex(root),
    }


# --- Пропорция ---

class ProportionInput(BaseModel):
    a: float
    b: float
    c: float
    # находит d: a/b = c/d

@router.post("/proportion")
def solve_proportion(body: ProportionInput):
    """Находит d в пропорции a/b = c/d"""
    if body.a == 0:
        raise HTTPException(status_code=400, detail="a не может быть 0")
    d = (body.b * body.c) / body.a
    return {"d": round(d, 6)}
