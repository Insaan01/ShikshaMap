from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import Region, RegionMetric, Organization
from app.schemas import StateDataResponse, MetricResponse
from app.api.deps import get_current_user

router = APIRouter()


@router.get("/district/{district_name}", response_model=MetricResponse)
def get_district_details(
    district_name: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Returns full details for a single district when clicked on the map.
    """
    result = db.query(Region, RegionMetric).join(
        RegionMetric, Region.id == RegionMetric.region_id
    ).filter(Region.district_name == district_name).first()

    if not result:
        raise HTTPException(status_code=404, detail="District not found")

    region, metric = result
    return {
        "district_name": region.district_name,
        "schools_needing_aid": metric.schools_needing_aid,
        "literacy_rate": metric.literacy_rate,
        "poverty_gap": metric.poverty_gap,
        "active_ngos": metric.active_ngos
    }

@router.get("/metrics/{state_name}", response_model=StateDataResponse)
def get_state_metrics(
        state_name: str,
        db: Session = Depends(get_db),
        current_user: Organization = Depends(get_current_user)  # <--- This locks the endpoint!
):
    """
    Fetches all district metrics for a given state.
    Only accessible to logged-in users with a valid JWT.
    """
    # Query the database by joining the Region and RegionMetric tables
    results = db.query(Region, RegionMetric).join(
        RegionMetric, Region.id == RegionMetric.region_id
    ).filter(
        Region.state_name == state_name
    ).all()

    if not results:
        raise HTTPException(status_code=404, detail=f"No data found for state: {state_name}")

    # Format the data for the frontend
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