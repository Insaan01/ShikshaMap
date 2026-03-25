from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.ngo import Organization
from app.schemas.ngo import OrganizationCreate
from sqlalchemy import func
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app import models, schemas
router = APIRouter()





@router.get("/list")
def list_ngos(db: Session = Depends(get_db)):
    return db.query(Organization).all()


@router.post("/{ngo_id}/approve")
def approve_ngo(ngo_id: int, db: Session = Depends(get_db)):
    ngo = db.query(Organization).filter(Organization.id == ngo_id).first()
    if not ngo:
        raise HTTPException(status_code=404, detail="NGO not found")

    ngo.is_approved = True
    db.commit()
    return {"message": f"Organization {ngo.org_name} has been approved."}


@router.delete("/{ngo_id}")
def delete_ngo(ngo_id: int, db: Session = Depends(get_db)):
    ngo = db.query(Organization).filter(Organization.id == ngo_id).first()
    if not ngo:
        raise HTTPException(status_code=404, detail="NGO not found")

    db.delete(ngo)
    db.commit()
    return {"message": f"Organization {ngo.org_name} has been removed."}


@router.post("/register")
def register_ngo(ngo_in: OrganizationCreate, db: Session = Depends(get_db)):

    if db.query(models.Organization).filter(models.Organization.email == ngo_in.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    db_ngo = models.Organization(
        org_name=ngo_in.orgName,
        email=ngo_in.email,
        password=ngo_in.password,
        state=ngo_in.state,
        district=ngo_in.district,
        org_type=ngo_in.orgType,
        reg_number=ngo_in.regNumber,
        year_founded=ngo_in.yearFounded,
        contact_name=ngo_in.contactName,
        phone=ngo_in.phone,
        designation=ngo_in.designation,
        website=ngo_in.website,
        city=ngo_in.city,
        pincode=ngo_in.pincode,
        team_size=ngo_in.teamSize,
        budget=ngo_in.budget,
        beneficiaries=ngo_in.beneficiaries,
        focus_areas=ngo_in.focusAreas,
        is_approved=True
    )

    try:
        db.add(db_ngo)
        db.commit()
        db.refresh(db_ngo)
        return db_ngo
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))



@router.post("/login")
def login_ngo(payload: dict, db: Session = Depends(get_db)):
    email_input = payload['email'].strip().lower()
    password_input = payload['password']

    ngo = db.query(Organization).filter(
        Organization.email == email_input,
        Organization.password == password_input
    ).first()

    if not ngo:
        raise HTTPException(status_code=401, detail="Invalid Email or Password")

    if not ngo.is_approved:
        raise HTTPException(status_code=403, detail="Access Denied: Your account is pending Admin approval.")

    return {"message": "Login Successful", "org_name": ngo.org_name}


@router.get("/district/{district_name}")
def get_ngos_by_district(district_name: str, db: Session = Depends(get_db)):
    ngos = db.query(Organization).filter(
        func.lower(Organization.district) == district_name.lower(),
        Organization.is_approved == True
    ).all()

    return ngos