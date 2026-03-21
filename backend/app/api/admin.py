import csv
import io
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import Region, RegionMetric
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/upload-data")
async def upload_mp_data(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Upload a CSV file to bulk-update Madhya Pradesh district metrics.
    Expected CSV columns: district_name, ts_ratio, infra_score, dropout_rate, schools, literacy, ngos
    """
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")

    # Read the file content
    content = await file.read()
    decoded = content.decode('utf-8')
    reader = csv.DictReader(io.StringIO(decoded))

    districts_processed = 0

    for row in reader:
        # 1. Check if Region exists, or create it
        region = db.query(Region).filter(
            Region.district_name == row['district_name'],
            Region.state_name == "Madhya Pradesh"
        ).first()

        if not region:
            region = Region(
                state_name="Madhya Pradesh",
                district_name=row['district_name'],
                geom='POLYGON((0 0, 0 1, 1 1, 1 0, 0 0))' # Placeholder shape
            )
            db.add(region)
            db.commit()
            db.refresh(region)

        # 2. Update or Create Metrics
        metric = db.query(RegionMetric).filter(RegionMetric.region_id == region.id).first()
        if not metric:
            metric = RegionMetric(region_id=region.id)
            db.add(metric)

        metric.teacher_student_ratio = float(row['ts_ratio'])
        metric.infra_score = float(row['infra_score'])
        metric.dropout_rate = float(row['dropout_rate'])
        metric.schools_needing_aid = int(row['schools'])
        metric.literacy_rate = float(row['literacy'])
        metric.active_ngos = int(row['ngos'])

        districts_processed += 1

    db.commit()
    return {"message": f"Successfully processed {districts_processed} districts for Madhya Pradesh."}