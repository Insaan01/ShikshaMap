from app.core.database import SessionLocal
from app.models.ngo import StateMetric


def seed_database():
    print("Starting database seed for the new Map engine...")
    db = SessionLocal()

    try:
        # Check if we already have data
        if db.query(StateMetric).first():
            print("Database already contains state metrics. Skipping seed.")
            return

        # Simplified state-level data for the Landing Page Map
        states_data = [
            {"name": "Madhya Pradesh", "schools": "1.2k", "lit": "70.6%", "pov": "32%", "ngos": 72},
            {"name": "Maharashtra", "schools": "2.5k", "lit": "82.3%", "pov": "17%", "ngos": 120},
            {"name": "Uttar Pradesh", "schools": "1.8k", "lit": "67.7%", "pov": "37%", "ngos": 84},
            {"name": "Delhi", "schools": "320", "lit": "86.2%", "pov": "9%", "ngos": 68},
            {"name": "Gujarat", "schools": "920", "lit": "79.3%", "pov": "17%", "ngos": 95},
            {"name": "Bihar", "schools": "850", "lit": "61.8%", "pov": "51%", "ngos": 42}
        ]

        for s in states_data:
            new_state = StateMetric(
                state_name=s["name"],
                schools_needing_aid=s["schools"],
                literacy_rate=s["lit"],
                poverty_gap=s["pov"],
                active_ngos=s["ngos"]
            )
            db.add(new_state)

        db.commit()
        print("Successfully seeded the India Map with real-time metrics!")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()