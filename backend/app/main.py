from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import map as map_router
from app.db.base_class import Base
from app.db.session import engine
from app.api import ngo as ngo_api
from app.api import admin as admin_router

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
app.include_router(ngo_api.router, prefix="/api/ngo", tags=["NGO Operations"])
app.include_router(admin_router.router, prefix="/api/admin", tags=["admin"])