"""add ngo tables

Revision ID: de766439604e
Revises: 30c1e80de6ad
Create Date: 2026-03-22 21:54:20.970041

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision: str = 'de766439604e'
down_revision: Union[str, Sequence[str], None] = '30c1e80de6ad'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    # 1. Drop the old tables forcefully (children first, then parents)
    # We execute raw SQL to avoid Alembic crying about missing indexes
    op.execute("SET FOREIGN_KEY_CHECKS = 0;")
    op.execute("DROP TABLE IF EXISTS region_metrics;")
    op.execute("DROP TABLE IF EXISTS regions;")
    op.execute("DROP TABLE IF EXISTS organizations;")
    op.execute("SET FOREIGN_KEY_CHECKS = 1;")

    # 2. Create the new StateMetric table
    op.create_table('state_metrics',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('state_name', sa.String(length=100), nullable=True),
    sa.Column('schools_needing_aid', sa.String(length=50), nullable=True),
    sa.Column('literacy_rate', sa.String(length=20), nullable=True),
    sa.Column('poverty_gap', sa.String(length=20), nullable=True),
    sa.Column('active_ngos', sa.Integer(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_state_metrics_id'), 'state_metrics', ['id'], unique=False)
    op.create_index(op.f('ix_state_metrics_state_name'), 'state_metrics', ['state_name'], unique=True)

    # 3. Create the new Organizations table
    op.create_table('organizations',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('org_name', sa.String(length=255), nullable=True),
    sa.Column('email', sa.String(length=255), nullable=True),
    sa.Column('reg_number', sa.String(length=100), nullable=True),
    sa.Column('org_type', sa.String(length=100), nullable=True),
    sa.Column('year_founded', sa.String(length=4), nullable=True),
    sa.Column('contact_name', sa.String(length=255), nullable=True),
    sa.Column('phone', sa.String(length=20), nullable=True),
    sa.Column('designation', sa.String(length=100), nullable=True),
    sa.Column('alt_email', sa.String(length=255), nullable=True),
    sa.Column('website', sa.String(length=255), nullable=True),
    sa.Column('state', sa.String(length=100), nullable=True),
    sa.Column('district', sa.String(length=100), nullable=True),
    sa.Column('city', sa.String(length=100), nullable=True),
    sa.Column('pincode', sa.String(length=20), nullable=True),
    sa.Column('focus_areas', sa.JSON(), nullable=True),
    sa.Column('team_size', sa.String(length=50), nullable=True),
    sa.Column('budget', sa.String(length=100), nullable=True),
    sa.Column('beneficiaries', sa.String(length=100), nullable=True),
    sa.Column('operating_districts', sa.String(length=100), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_organizations_email'), 'organizations', ['email'], unique=True)
    op.create_index(op.f('ix_organizations_id'), 'organizations', ['id'], unique=False)
    op.create_index(op.f('ix_organizations_org_name'), 'organizations', ['org_name'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    pass # We are not supporting downgrade for this major refactor