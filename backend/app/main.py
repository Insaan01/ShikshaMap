from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, map, ml
from app.api import auth, map, ml, admin # Add admin here


app = FastAPI(title="ShikshaMap GeoAI API")

# Define the origins that are allowed to talk to this API
# During development, this is your Next.js local URL
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allows GET, POST, PUT, DELETE, etc.
    allow_headers=["*"], # Allows all headers (like Authorization)
)

@app.get("/")
def health_check():
    return {"status": "active", "project": "GeoAI Learning Poverty Index"}

# Register your routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(map.router, prefix="/api/map", tags=["Map Intelligence"])
app.include_router(ml.router, prefix="/api/ml", tags=["GeoAI Intelligence"])
app.include_router(admin.router, prefix="/api/admin", tags=["Data Management"])