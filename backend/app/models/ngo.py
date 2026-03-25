from sqlalchemy import Column, Integer, String, Boolean, JSON
from app.db.base_class import Base

class Organization(Base):
    __tablename__ = "organizations"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)

    org_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    state = Column(String(100), nullable=False)
    district = Column(String(100), nullable=False)

    org_type = Column(String(100))
    reg_number = Column(String(100))
    year_founded = Column(String(50))
    contact_name = Column(String(255))
    phone = Column(String(20))
    designation = Column(String(100))
    website = Column(String(255))
    city = Column(String(100))
    pincode = Column(String(20))
    team_size = Column(String(50))
    budget = Column(String(100))
    beneficiaries = Column(String(100))
    focus_areas = Column(JSON, default=[])

    is_approved = Column(Boolean, default=True)