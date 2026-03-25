from pydantic import BaseModel, EmailStr
from typing import List, Optional

from pydantic import BaseModel, EmailStr
from typing import List, Optional

class OrganizationCreate(BaseModel):
    orgName: str
    email: EmailStr
    state: str
    district: str
    focusAreas: List[str] = []
    regNumber: Optional[str] = None
    orgType: Optional[str] = None
    yearFounded: Optional[str] = None
    contactName: Optional[str] = None
    phone: Optional[str] = None
    designation: Optional[str] = None
    altEmail: Optional[str] = None
    website: Optional[str] = None
    password: str
    city: Optional[str] = None
    pincode: Optional[str] = None
    teamSize: Optional[str] = None
    budget: Optional[str] = None
    beneficiaries: Optional[str] = None
    operatingDistricts: Optional[str] = None

class StateMetricResponse(BaseModel):
    schools: str
    literacy: str
    poverty: str
    activeNGOs: int

    class Config:
        from_attributes = True