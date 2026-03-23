from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.ngo import Organization
from app.schemas.ngo import OrganizationCreate

router = APIRouter()





@router.get("/list")
def list_ngos(db: Session = Depends(get_db)):
    # This pulls all rows from the organizations table in MySQL
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
def register_ngo(payload: dict, db: Session = Depends(get_db)):
    try:
        # Check if email already exists to prevent the Duplicate Entry crash
        existing = db.query(Organization).filter(Organization.email == payload['email']).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")

        new_ngo = Organization(
            org_name=payload.get('orgName'),
            email=payload.get('email'),
            password=payload.get('password'),
            state=payload.get('state'),
            # ... Map the rest of your keys from the payload
        )
        db.add(new_ngo)
        db.commit()
        return {"message": "Success"}
    except Exception as e:
        db.rollback()
        print(f"Database Error: {e}")
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