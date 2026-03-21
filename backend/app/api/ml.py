from fastapi import APIRouter, Depends
from app.core.ml_model import predictor
from app.api.deps import get_current_user
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import Region, RegionMetric
from app.core.ml_model import predictor
from app.api.deps import get_current_user


router = APIRouter()

@router.get("/state-analysis/{state_name}")
def get_state_poverty_ranking(
    state_name: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Runs every district in the state through the Random Forest model
    and returns a ranked list of which districts need intervention most.
    """
    results = db.query(Region, RegionMetric).join(
        RegionMetric, Region.id == RegionMetric.region_id
    ).filter(Region.state_name == state_name).all()

    analysis_report = []

    for region, metric in results:
        # Run the Random Forest Prediction
        ai_score = predictor.predict(
            metric.teacher_student_ratio,
            metric.infra_score,
            metric.dropout_rate
        )

        analysis_report.append({
            "district": region.district_name,
            "geoai_poverty_index": round(ai_score, 4),
            "priority": "CRITICAL" if ai_score > 0.75 else "HIGH" if ai_score > 0.5 else "STABLE",
            "metrics": {
                "ts_ratio": metric.teacher_student_ratio,
                "infra_score": metric.infra_score,
                "dropout_rate": metric.dropout_rate
            }
        })

    # Sort by highest poverty index first
    analysis_report.sort(key=lambda x: x["geoai_poverty_index"], reverse=True)

    return {
        "state": state_name,
        "total_districts_analyzed": len(analysis_report),
        "rankings": analysis_report
    }

@router.get("/predict-poverty")
def predict_poverty(
        ts_ratio: float,
        infra_score: float,
        dropout_rate: float,
        current_user=Depends(get_current_user)
):
    """
    Takes school metrics and returns a predicted Learning Poverty Index (0.0 to 1.0)
    using a Random Forest Regressor.
    """
    score = predictor.predict(ts_ratio, infra_score, dropout_rate)

    # Simple logic to determine priority level
    priority = "High" if score > 0.7 else "Medium" if score > 0.4 else "Low"

    return {
        "predicted_poverty_index": round(score, 4),
        "intervention_priority": priority,
        "recommendation": f"Focus on {'Infrastructure' if infra_score < 0.4 else 'Teacher Recruitment' if ts_ratio > 30 else 'Retention Programs'}"
    }