from pydantic import BaseModel, EmailStr
from typing import Optional

# ---- Incoming Data Validation (From Frontend) ----

class OrganizationCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class OrganizationLogin(BaseModel):
    email: EmailStr
    password: str

# ---- Outgoing Data Formatting (To Frontend) ----

class OrganizationResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    is_verified: bool

    class Config:
        from_attributes = True  # Allows Pydantic to read SQLAlchemy objects

class Token(BaseModel):
    access_token: str
    token_type: str