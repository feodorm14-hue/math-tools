from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from math import gcd
from sympy import Rational, latex
from functools import reduce

router = APIRouter()


# --- Дроби ---

class FractionInput(BaseModel):
    n1: int   # числитель 1
    d1: int   # знаменатель 1
    n2: int   # числитель 2
    d2: int   # знаменатель 2
    op: str   # "+", "-", "*", "/"

@router.post("/fraction")
def fraction_calc(body: FractionInput):
    """Арифметика с дробями. op: +, -, *, /"""
    if body.d1 == 0 or body.d2 == 0:
        raise HTTPException(status_code=400, detail="Знаменатель не может быть 0")
    if body.op == "/" and body.n2 == 0:
        raise HTTPException(status_code=400, detail="Деление на ноль")

    r1 = Rational(body.n1, body.d1)
    r2 = Rational(body.n2, body.d2)

    ops = {"+": r1 + r2, "-": r1 - r2, "*": r1 * r2, "/": r1 / r2}
    if body.op not in ops:
        raise HTTPException(status_code=400, detail="Операция должна быть: +, -, *, /")

    result = ops[body.op]
    return {
        "result": str(result),
        "result_latex": latex(result),
        "decimal": float(result),
    }


# --- Проценты ---

class PercentInput(BaseModel):
    value: float
    total: float

@router.post("/percent")
def percent(body: PercentInput):
    """Сколько процентов value составляет от total"""
    if body.total == 0:
        raise HTTPException(status_code=400, detail="total не может быть 0")
    p = (body.value / body.total) * 100
    return {"percent": round(p, 4)}


class PercentOfInput(BaseModel):
    percent: float
    total: float

@router.post("/percent-of")
def percent_of(body: PercentOfInput):
    """Найти percent% от total"""
    result = (body.percent / 100) * body.total
    return {"result": round(result, 6)}


# --- НОД и НОК ---

class GcdLcmInput(BaseModel):
    numbers: list[int]

@router.post("/gcd")
def calc_gcd(body: GcdLcmInput):
    """НОД нескольких чисел"""
    if len(body.numbers) < 2:
        raise HTTPException(status_code=400, detail="Нужно минимум 2 числа")
    result = reduce(gcd, body.numbers)
    return {"gcd": result}

@router.post("/lcm")
def calc_lcm(body: GcdLcmInput):
    """НОК нескольких чисел"""
    if len(body.numbers) < 2:
        raise HTTPException(status_code=400, detail="Нужно минимум 2 числа")
    def lcm(a, b):
        return abs(a * b) // gcd(a, b)
    result = reduce(lcm, body.numbers)
    return {"lcm": result}


# --- Степени и корни ---

class PowerInput(BaseModel):
    base: float
    exp: float

@router.post("/power")
def power(body: PowerInput):
    return {"result": body.base ** body.exp}


# --- Статистика ---

class StatsInput(BaseModel):
    numbers: list[float]

@router.post("/stats")
def stats(body: StatsInput):
    if not body.numbers:
        raise HTTPException(status_code=400, detail="Список не может быть пустым")
    nums = sorted(body.numbers)
    n = len(nums)
    mean = sum(nums) / n
    median = nums[n // 2] if n % 2 != 0 else (nums[n//2 - 1] + nums[n//2]) / 2
    from collections import Counter
    freq = Counter(nums)
    mode = [k for k, v in freq.items() if v == max(freq.values())]
    spread = max(nums) - min(nums)
    return {
        "mean": round(mean, 6),
        "median": median,
        "mode": mode,
        "spread": spread,
        "min": min(nums),
        "max": max(nums),
    }
