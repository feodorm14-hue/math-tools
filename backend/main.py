from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import algebra, geometry, arithmetic, formulas


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Инициализируем БД при старте
    formulas.init_db()
    yield


app = FastAPI(
    title="Maths Instruments API",
    version="0.2.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(algebra.router,    prefix="/algebra",    tags=["Алгебра"])
app.include_router(geometry.router,   prefix="/geometry",   tags=["Геометрия"])
app.include_router(arithmetic.router, prefix="/arithmetic", tags=["Арифметика"])
app.include_router(formulas.router,   prefix="/formulas",   tags=["Формулы"])


@app.get("/")
def root():
    return {"status": "ok", "message": "Maths Instruments API работает"}
