from app.core.database import SessionLocal
from app.models.ngo import StateMetric, DistrictMetric


def seed_districts():
    db = SessionLocal()
    try:
        # 1. Find Maharashtra in the DB
        mh = db.query(StateMetric).filter(StateMetric.state_name == "Maharashtra").first()

        if mh and not mh.districts:
            print("Seeding districts for Maharashtra...")
            districts = [
                DistrictMetric(state_id=mh.id, district_name="Mumbai City", schools="450", literacy="89.2%",
                               poverty="12%"),
                DistrictMetric(state_id=mh.id, district_name="Pune", schools="380", literacy="86.1%", poverty="15%"),
                DistrictMetric(state_id=mh.id, district_name="Nagpur", schools="290", literacy="84.3%", poverty="18%"),
            ]
            db.add_all(districts)
            db.commit()
            print("Successfully added Maharashtra districts!")
        else:
            print("Maharashtra districts already exist or state not found.")

    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_districts()