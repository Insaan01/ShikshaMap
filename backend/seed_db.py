from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from app.models import Region, RegionMetric


def seed_database():
    print("Starting database seed...")
    db = SessionLocal()

    try:
        # Check if MP data specifically exists
        existing = db.query(Region).filter(Region.state_name == "Madhya Pradesh").first()
        if existing:
            print("Madhya Pradesh data already exists. No need to seed.")
            return

        # ... (rest of your MP districts_data and loop here)

        # 1. Create Fake Districts
        districts_data = [
            {"name": "Bhopal", "ts_ratio": 25, "infra": 0.8, "dropout": 5, "schools": 85, "lit": 80.4, "pov": 15.2,
             "ngos": 65},
            {"name": "Indore", "ts_ratio": 22, "infra": 0.9, "dropout": 3, "schools": 70, "lit": 82.3, "pov": 12.8,
             "ngos": 88},
            {"name": "Sagar", "ts_ratio": 45, "infra": 0.3, "dropout": 22, "schools": 210, "lit": 68.5, "pov": 32.4,
             "ngos": 10},
            {"name": "Jhabua", "ts_ratio": 55, "infra": 0.2, "dropout": 35, "schools": 400, "lit": 43.3, "pov": 52.1,
             "ngos": 4}
        ]

        for d in districts_data:
            new_region = Region(state_name="Madhya Pradesh", district_name=d["name"],
                                geom='POLYGON((0 0, 0 1, 1 1, 1 0, 0 0))')
            db.add(new_region)
            db.commit()
            db.refresh(new_region)

            db.add(RegionMetric(
                region_id=new_region.id,
                # Frontend Stats
                schools_needing_aid=d["schools"],
                literacy_rate=d["lit"],
                active_ngos=d["ngos"],
                # ML Proxy Indicators
                teacher_student_ratio=d["ts_ratio"],
                infra_score=d["infra"],
                dropout_rate=d["dropout"]
            ))
        db.commit()
        print("Successfully injected dummy data for Madhya Pradesh!")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()