from pydantic import BaseModel, EmailStr
from typing import List, Optional

from pydantic import BaseModel, EmailStr
from typing import List, Optional

class OrganizationCreate(BaseModel):
    orgName: str  # Required
    email: EmailStr # Required
    state: str # Required
    focusAreas: List[str] = [] # Default to empty list
    # Make everything else optional to avoid 422 errors
    regNumber: Optional[str] = None
    orgType: Optional[str] = None
    yearFounded: Optional[str] = None
    contactName: Optional[str] = None
    phone: Optional[str] = None
    designation: Optional[str] = None
    altEmail: Optional[str] = None
    website: Optional[str] = None
    district: Optional[str] = None
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