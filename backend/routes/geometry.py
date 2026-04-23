from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import math

router = APIRouter()


# --- Площадь и периметр ---

class RectInput(BaseModel):
    a: float
    b: float

@router.post("/rectangle")
def rectangle(body: RectInput):
    """Прямоугольник: площадь и периметр"""
    return {
        "area": round(body.a * body.b, 6),
        "perimeter": round(2 * (body.a + body.b), 6),
    }


class SquareInput(BaseModel):
    a: float

@router.post("/square")
def square(body: SquareInput):
    """Квадрат: площадь и периметр"""
    return {
        "area": round(body.a ** 2, 6),
        "perimeter": round(4 * body.a, 6),
    }


class CircleInput(BaseModel):
    r: float

@router.post("/circle")
def circle(body: CircleInput):
    """Круг: площадь и длина окружности"""
    return {
        "area": round(math.pi * body.r ** 2, 6),
        "circumference": round(2 * math.pi * body.r, 6),
    }


class TriangleInput(BaseModel):
    a: float   # основание
    h: float   # высота

@router.post("/triangle")
def triangle(body: TriangleInput):
    """Треугольник: площадь по основанию и высоте"""
    return {
        "area": round((body.a * body.h) / 2, 6),
    }


class TrapezoidInput(BaseModel):
    a: float   # нижнее основание
    b: float   # верхнее основание
    h: float   # высота

@router.post("/trapezoid")
def trapezoid(body: TrapezoidInput):
    """Трапеция: площадь"""
    return {
        "area": round(((body.a + body.b) / 2) * body.h, 6),
    }


class ParallelogramInput(BaseModel):
    a: float   # основание
    h: float   # высота

@router.post("/parallelogram")
def parallelogram(body: ParallelogramInput):
    """Параллелограмм: площадь"""
    return {
        "area": round(body.a * body.h, 6),
    }


# --- Теорема Пифагора ---

class PythagorasInput(BaseModel):
    a: float | None = None
    b: float | None = None
    c: float | None = None   # гипотенуза

@router.post("/pythagoras")
def pythagoras(body: PythagorasInput):
    """Находит неизвестную сторону. Передай два из трёх значений."""
    if body.a and body.b:
        c = math.sqrt(body.a**2 + body.b**2)
        return {"c": round(c, 6), "found": "гипотенуза"}
    elif body.c and body.a:
        if body.c <= body.a:
            raise HTTPException(status_code=400, detail="Гипотенуза должна быть больше катета")
        b = math.sqrt(body.c**2 - body.a**2)
        return {"b": round(b, 6), "found": "катет b"}
    elif body.c and body.b:
        if body.c <= body.b:
            raise HTTPException(status_code=400, detail="Гипотенуза должна быть больше катета")
        a = math.sqrt(body.c**2 - body.b**2)
        return {"a": round(a, 6), "found": "катет a"}
    raise HTTPException(status_code=400, detail="Передай два из трёх значений: a, b или c")


# --- Объём: плоские тела ---

class CubeInput(BaseModel):
    a: float

@router.post("/cube")
def cube(body: CubeInput):
    """Куб: объём и площадь поверхности"""
    return {
        "volume": round(body.a ** 3, 6),
        "surface_area": round(6 * body.a ** 2, 6),
    }


class BoxInput(BaseModel):
    a: float
    b: float
    c: float

@router.post("/box")
def box(body: BoxInput):
    """Прямоугольный параллелепипед: объём и площадь поверхности"""
    return {
        "volume": round(body.a * body.b * body.c, 6),
        "surface_area": round(2 * (body.a*body.b + body.b*body.c + body.a*body.c), 6),
    }


class CylinderInput(BaseModel):
    r: float
    h: float

@router.post("/cylinder")
def cylinder(body: CylinderInput):
    """Цилиндр: объём и площадь поверхности"""
    return {
        "volume": round(math.pi * body.r**2 * body.h, 6),
        "surface_area": round(2 * math.pi * body.r * (body.r + body.h), 6),
    }


class ConeInput(BaseModel):
    r: float
    h: float

@router.post("/cone")
def cone(body: ConeInput):
    """Конус: объём и площадь поверхности"""
    slant = math.sqrt(body.r**2 + body.h**2)
    return {
        "volume": round((1/3) * math.pi * body.r**2 * body.h, 6),
        "surface_area": round(math.pi * body.r * (body.r + slant), 6),
        "slant_height": round(slant, 6),
    }


class PyramidInput(BaseModel):
    base_area: float   # площадь основания
    h: float           # высота

@router.post("/pyramid")
def pyramid(body: PyramidInput):
    """Пирамида: объём по площади основания и высоте"""
    return {
        "volume": round((1/3) * body.base_area * body.h, 6),
    }
