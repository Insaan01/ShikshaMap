
from sqlalchemy import Column, Integer, String
from app.db.base_class import Base

class District(Base):
    __tablename__ = "districts"
    id = Column(Integer, primary_key=True, index=True)
    state_name = Column(String(100), index=True)
    district_name = Column(String(100), index=True)
    schools = Column(String(50))
    literacy = Column(String(50))
    poverty = Column(String(50))
    active_ngos = Column(Integer, default=0)


class StateMetric(Base):
    __tablename__ = "state_metrics"
    id = Column(Integer, primary_key=True, index=True)
    state_name = Column(String(100), unique=True, index=True)
    schools_needing_aid = Column(String(50))
    literacy_rate = Column(String(50))
    poverty_gap = Column(String(50))
    active_ngos = Column(Integer, default=0)