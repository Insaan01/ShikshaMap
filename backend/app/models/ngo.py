from sqlalchemy import Column, Integer, String, JSON
from app.core.database import Base  # Make sure this import matches your database base


class Organization(Base):
    __tablename__ = "organizations"

    id = Column(Integer, primary_key=True, index=True)
    org_name = Column(String(255), index=True)
    email = Column(String(255), unique=True, index=True)
    reg_number = Column(String(100), nullable=True)
    org_type = Column(String(100))
    year_founded = Column(String(4))

    contact_name = Column(String(255))
    phone = Column(String(20))
    designation = Column(String(100))
    alt_email = Column(String(255), nullable=True)
    website = Column(String(255), nullable=True)

    state = Column(String(100))
    district = Column(String(100))
    city = Column(String(100))
    pincode = Column(String(20))
    focus_areas = Column(JSON)

    team_size = Column(String(50))
    budget = Column(String(100))
    beneficiaries = Column(String(100))
    operating_districts = Column(String(100))


class StateMetric(Base):
    __tablename__ = "state_metrics"

    id = Column(Integer, primary_key=True, index=True)
    state_name = Column(String(100), unique=True, index=True)
    schools_needing_aid = Column(String(50))
    literacy_rate = Column(String(20))
    poverty_gap = Column(String(20))
    active_ngos = Column(Integer)