import random
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models
from app.db.session import get_db

router = APIRouter()

# Exact lists to match your frontend
INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
    "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal", "Delhi", "Jammu & Kashmir", "Ladakh"
]

MP_DISTRICTS = [
    "Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul", "Bhind", "Bhopal",
    "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior",
    "Harda", "Hoshangabad", "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa", "Khargone", "Mandla", "Mandsaur",
    "Morena", "Narsinghpur", "Neemuch", "Panna", "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna",
    "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain",
    "Umaria", "Vidisha", "Niwari"
]


@router.post("/seed-data")
def seed_system_data(db: Session = Depends(get_db)):
    print("LOG: Starting System Wipe...")
    try:
        # 1. DELETE EVERYTHING
        db.query(models.DistrictMetric).delete()
        db.query(models.StateMetric).delete()
        db.query(models.District).delete()
        db.query(models.Organization).delete()
        db.commit()
        print("LOG: Database Wiped Clean.")

        # 2. SEED STATES
        state_ids = {}
        for state in INDIAN_STATES:
            s = models.StateMetric(
                state_name=state,
                schools_needing_aid=str(random.randint(1000, 5000)),
                literacy_rate=f"{random.randint(60, 95)}%",
                poverty_gap=f"{random.randint(5, 30)}%",
                active_ngos=0
            )
            db.add(s)
            db.flush()
            state_ids[state] = s.id

        # 3. SEED MP DISTRICTS
        mp_id = state_ids["Madhya Pradesh"]
        print("LOG: Seeding MP Districts...")

        for dist in MP_DISTRICTS:
            # Map Table
            db.add(models.District(
                state_name="Madhya Pradesh",
                district_name=dist,
                schools=str(random.randint(50, 500)),
                literacy=f"{random.randint(65, 85)}%",
                poverty=f"{random.randint(10, 25)}%",
                active_ngos=1  # Ensure at least one shows up per district
            ))
            # Metric Table
            db.add(models.DistrictMetric(
                state_id=mp_id,
                district_name=dist,
                schools=str(random.randint(50, 500)),
                literacy=f"{random.randint(65, 85)}%",
                poverty=f"{random.randint(10, 25)}%"
            ))
            # Create one NGO per district so the map isn't empty
            db.add(models.Organization(
                org_name=f"{dist} Volunteer Group",
                email=f"info@{dist.lower().replace(' ', '')}.org",
                password="password123",
                state="Madhya Pradesh",
                district=dist,
                is_approved=True,  # Critical for map display
                focus_areas=["education"]
            ))

        # Update MP NGO Total
        db.query(models.StateMetric).filter(models.StateMetric.id == mp_id).update({"active_ngos": len(MP_DISTRICTS)})

        db.commit()
        print("LOG: Seeding Complete!")
        return {"message": "System Overridden Successfully"}
    except Exception as e:
        db.rollback()
        print(f"ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))