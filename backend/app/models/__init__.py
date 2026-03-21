from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry
from backend.app.core.database import Base


class Organization(Base):
    """Stores the registered NGOs and Admins"""
    __tablename__ = "organizations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    email = Column(String(255), unique=True, index=True)
    hashed_password = Column(String(255))
    role = Column(String(50), default="ngo")  # Can be 'ngo' or 'admin'
    is_verified = Column(Boolean, default=False)


class Region(Base):
    """Stores the States, Districts, and their Map Shapes"""
    __tablename__ = "regions"

    id = Column(Integer, primary_key=True, index=True)
    state_name = Column(String(100), index=True)
    district_name = Column(String(100), index=True)

    # This is the magic column for your map polygons.
    # SRID 4326 is the standard coordinate system for GPS (Latitude/Longitude).
    geom = Column(Geometry(geometry_type='POLYGON', srid=4326), nullable=True)

    # Establish a relationship to the metrics table
    metrics = relationship("RegionMetric", back_populates="region", uselist=False)


class RegionMetric(Base):
    """Stores the specific data the frontend displays AND the ML model needs"""
    __tablename__ = "region_metrics"

    id = Column(Integer, primary_key=True, index=True)
    region_id = Column(Integer, ForeignKey("regions.id"))

    # Frontend Map Display Metrics
    schools_needing_aid = Column(Integer, default=0)
    literacy_rate = Column(Float, default=0.0)
    poverty_gap = Column(Float, default=0.0)
    active_ngos = Column(Integer, default=0)

    # ML Features (The "Proxy Indicators" for the Random Forest)
    teacher_student_ratio = Column(Float, default=0.0)
    infra_score = Column(Float, default=0.0)
    dropout_rate = Column(Float, default=0.0)

    region = relationship("Region", back_populates="metrics")