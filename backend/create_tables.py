from app.core.database import engine, Base
from app.models.ngo import Organization, StateMetric, DistrictMetric

print("Connecting to database and creating missing tables...")
# This looks at your models and creates any table that doesn't exist in MySQL
Base.metadata.create_all(bind=engine)
print("Done! 'district_metrics' table should now exist.")