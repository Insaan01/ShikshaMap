from fastapi import APIRouter, UploadFile, File

router = APIRouter()

@router.post("/upload-data")
async def upload_mp_data(file: UploadFile = File(...)):
    """
    Temporarily disabled.
    Bulk upload needs to be re-written to target the new StateMetric table.
    """
    return {"message": "Bulk CSV upload is disabled while we migrate to the new State-level database."}