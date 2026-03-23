from fastapi import APIRouter

router = APIRouter()

@router.get("/state-analysis/{state_name}")
def get_state_poverty_ranking(state_name: str):
    """
    Temporarily disabled.
    The ML model needs to be re-wired to use the new StateMetric data instead of the old district data.
    """
    return {
        "state": state_name,
        "message": "ML Analysis is currently being upgraded to support the new state-level architecture.",
        "rankings": []
    }

@router.get("/predict-poverty")
def predict_poverty(ts_ratio: float, infra_score: float, dropout_rate: float):
    """
    Temporarily disabled during database migration.
    """
    return {
        "predicted_poverty_index": 0.0,
        "intervention_priority": "Pending Upgrade",
        "recommendation": "System upgrade in progress."
    }