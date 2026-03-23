from sqlalchemy import Column, Integer, String, ForeignKey, JSON, Boolean
from sqlalchemy.orm import relationship
from app.core.database import Base

class Organization(Base):
    __tablename__ = "organizations"
    __table_args__ = {'extend_existing': True} # Safety flag

    id = Column(Integer, primary_key=True, index=True)
    org_name = Column(String(255), index=True)
    email = Column(String(255), unique=True, index=True)
    password = Column(String(255))
    state = Column(String(100))
    reg_number = Column(String(100), nullable=True)
    org_type = Column(String(100), nullable=True)
    year_founded = Column(String(50), nullable=True)
    contact_name = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)
    designation = Column(String(100), nullable=True)
    alt_email = Column(String(255), nullable=True)
    website = Column(String(255), nullable=True)
    district = Column(String(100), nullable=True)
    city = Column(String(100), nullable=True)
    pincode = Column(String(50), nullable=True)
    focus_areas = Column(JSON) # Stores the list of focus areas
    team_size = Column(String(100), nullable=True)
    budget = Column(String(100), nullable=True)
    beneficiaries = Column(String(100), nullable=True)
    operating_districts = Column(String(100), nullable=True)
    is_approved = Column(Boolean, default=False)

class StateMetric(Base):
    __tablename__ = "state_metrics"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    state_name = Column(String(100), unique=True, index=True)
    schools_needing_aid = Column(String(50))
    literacy_rate = Column(String(20))
    poverty_gap = Column(String(20))
    active_ngos = Column(Integer)

    # Link to districts
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