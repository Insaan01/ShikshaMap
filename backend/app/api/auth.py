from fastapi import APIRouter

router = APIRouter()

@router.post("/register")
def register_organization_legacy():
    # The frontend now uses /api/ngo/register from ngo.py
    return {"message": "Please use the new /api/ngo/register endpoint."}

@router.post("/login")
def login_for_access_token():
    return {"message": "Authentication system is currently being upgraded for the new NGO portal."}

@router.get("/me")
def get_user_profile():
    return {"message": "Profile system is currently being upgraded."}