from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import Organization
from app.schemas import OrganizationCreate, OrganizationResponse, Token, OrganizationLogin
from app.core.security import get_password_hash, verify_password, create_access_token
from app.api.deps import get_current_user
from fastapi.security import OAuth2PasswordRequestForm


router = APIRouter()


@router.post("/register", response_model=OrganizationResponse, status_code=status.HTTP_201_CREATED)
def register_organization(org_in: OrganizationCreate, db: Session = Depends(get_db)):
    print("--> 1. Endpoint reached")

    existing_org = db.query(Organization).filter(Organization.email == org_in.email).first()
    if existing_org:
        raise HTTPException(status_code=400, detail="Email already registered")

    print("--> 2. Database queried successfully")

    hashed_pwd = get_password_hash(org_in.password)
    print("--> 3. Password hashed successfully")

    new_org = Organization(
        name=org_in.name,
        email=org_in.email,
        hashed_password=hashed_pwd
    )

    print("--> 4. Attempting to save to MySQL...")
    db.add(new_org)
    db.commit()
    db.refresh(new_org)

    print("--> 5. Registration Complete!")
    return new_org


@router.post("/login", response_model=Token)
def login_for_access_token(
        form_data: OAuth2PasswordRequestForm = Depends(),  # <--- Changed this
        db: Session = Depends(get_db)
):
    # 1. Find the user (Notice we map form_data.username to our database email)
    org = db.query(Organization).filter(Organization.email == form_data.username).first()

    # 2. Verify existence and password
    if not org or not verify_password(form_data.password, org.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 3. Generate the JWT Token
    access_token = create_access_token(data={"sub": str(org.id), "role": org.role})

    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=OrganizationResponse)
def get_user_profile(current_user: Organization = Depends(get_current_user)):
    """
    If the user passes a valid JWT in the headers, this returns their profile.
    If the token is missing or expired, FastAPI automatically blocks it and returns 401.
    """
    return current_user

