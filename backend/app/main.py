from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import map as map_router
from app.db.base_class import Base
from app.db.session import engine

app = FastAPI()

# Sync models to DB on startup
Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Use the aliased router name
app.include_router(map_router.router, prefix="/api/map", tags=["Map Intelligence"])