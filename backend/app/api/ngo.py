from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.ngo import Organization
from app.schemas.ngo import OrganizationCreate

router = APIRouter()

@router.post("/register")
def register_organization(org_data: OrganizationCreate, db: Session = Depends(get_db)):
    new_org = Organization(
        org_name=org_data.orgName,
        email=org_data.email,
        reg_number=org_data.regNumber,
        org_type=org_data.orgType,
        year_founded=org_data.yearFounded,
        contact_name=org_data.contactName,
        phone=org_data.phone,
        designation=org_data.designation,
        alt_email=org_data.altEmail,
        website=org_data.website,
        state=org_data.state,
        district=org_data.district,
        city=org_data.city,
        pincode=org_data.pincode,
        focus_areas=org_data.focusAreas,
        team_size=org_data.teamSize,
        budget=org_data.budget,
        beneficiaries=org_data.beneficiaries,
        operating_districts=org_data.operatingDistricts
    )
    db.add(new_org)
    db.commit()
    db.refresh(new_org)
    return {"message": "Organization registered successfully", "id": new_org.id}

@router.get("/list")
def list_ngos(db: Session = Depends(get_db)):
    # This pulls all rows from the organizations table in MySQL
    return db.query(Organization).all()