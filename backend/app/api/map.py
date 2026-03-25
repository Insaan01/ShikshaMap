from fastapi import APIRouter, Depends, HTTPException

from app.models.map import District
from app.models.ngo import Organization
from app.models.map import StateMetric, District
from app.schemas import StateDataResponse, MetricResponse
from app.api.deps import get_current_user
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db

router = APIRouter()

@router.get("/state-metrics")
def get_state_metrics(db: Session = Depends(get_db)):
    metrics = db.query(StateMetric).all()
    result = {}
    for m in metrics:
        result[m.state_name] = {
            "schools": m.schools_needing_aid,
            "literacy": m.literacy_rate,
            "poverty": m.poverty_gap,
            "activeNGOs": m.active_ngos
        }
    return result


@router.get("/metrics/{state_name}", response_model=StateDataResponse)
def get_state_metrics(
        state_name: str,
        db: Session = Depends(get_db),
        current_user: Organization = Depends(get_current_user)  # <--- This locks the endpoint!
):
    results = db.query(StateMetric).filter(
        StateMetric.state_name == state_name
    ).all()

    if not results:
        raise HTTPException(status_code=404, detail=f"No data found for state: {state_name}")

    formatted_metrics = []
    for region, metric in results:
        formatted_metrics.append({
            "district_name": region.district_name,
            "schools_needing_aid": metric.schools_needing_aid,
            "literacy_rate": metric.literacy_rate,
            "poverty_gap": metric.poverty_gap,
            "active_ngos": metric.active_ngos
        })

    return {
        "state_name": state_name,
        "metrics": formatted_metrics
    }


@router.get("/state/{state_name}/districts")
def get_districts(state_name: str, db: Session = Depends(get_db)):
    # Standardize the name for the SQL query
    clean_name = state_name.replace("-", " ").title()

    # Use the 'db' session to query the District table
    districts = db.query(District).filter(District.state_name == clean_name).all()

    return districts