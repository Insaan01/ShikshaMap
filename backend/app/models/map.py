from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class District(Base):
    __tablename__ = "districts"
    __table_args__ = {'extend_existing': True}
    id = Column(Integer, primary_key=True, index=True)
    state_name = Column(String(100), index=True)
    district_name = Column(String(100), index=True)
    schools = Column(String(50))
    literacy = Column(String(50))
    poverty = Column(String(50))
    active_ngos = Column(Integer, default=0)

class StateMetric(Base):
    __tablename__ = "state_metrics"
    __table_args__ = {'extend_existing': True}
    id = Column(Integer, primary_key=True, index=True)
    state_name = Column(String(100), unique=True, index=True)
    schools_needing_aid = Column(String(50))
    literacy_rate = Column(String(20))
    poverty_gap = Column(String(20))
    active_ngos = Column(Integer)
    districts = relationship("DistrictMetric", back_populates="state_ref")

class DistrictMetric(Base):
    __tablename__ = "district_metrics"
    __table_args__ = {'extend_existing': True}
    id = Column(Integer, primary_key=True, index=True)
    state_id = Column(Integer, ForeignKey("state_metrics.id"))
    district_name = Column(String(100), index=True)
    schools = Column(String(50))
    literacy = Column(String(20))
    poverty = Column(String(20))
    state_ref = relationship("StateMetric", back_populates="districts")