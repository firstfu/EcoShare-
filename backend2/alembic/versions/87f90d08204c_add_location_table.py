"""Add location table

Revision ID: 87f90d08204c
Revises:
Create Date: 2025-01-02 03:02:28.733332

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "87f90d08204c"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "locations",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("type", sa.Enum("building", "floor", "room", "area", name="location_type"), nullable=False),
        sa.Column("description", sa.String(), nullable=True),
        sa.Column("parent_id", sa.Integer(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(
            ["parent_id"],
            ["locations.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_locations_id"), "locations", ["id"], unique=False)
    op.drop_index("idx_devices_device_id", table_name="devices")
    op.drop_index("idx_devices_user_id", table_name="devices")
    op.drop_table("devices")
    op.drop_index("idx_users_email", table_name="users")
    op.drop_index("idx_users_username", table_name="users")
    op.drop_table("users")
    op.drop_table("schema_migrations")
    op.drop_index("idx_power_usage_records_device_id", table_name="power_usage_records")
    op.drop_index("idx_power_usage_records_timestamp", table_name="power_usage_records")
    op.drop_table("power_usage_records")
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "power_usage_records",
        sa.Column("id", sa.INTEGER(), autoincrement=True, nullable=False),
        sa.Column("device_id", sa.INTEGER(), autoincrement=False, nullable=False),
        sa.Column("usage", sa.NUMERIC(precision=10, scale=2), autoincrement=False, nullable=False),
        sa.Column("timestamp", postgresql.TIMESTAMP(), autoincrement=False, nullable=False),
        sa.Column("cost", sa.NUMERIC(precision=10, scale=2), autoincrement=False, nullable=False),
        sa.Column("created_at", postgresql.TIMESTAMP(), server_default=sa.text("CURRENT_TIMESTAMP"), autoincrement=False, nullable=True),
        sa.Column("updated_at", postgresql.TIMESTAMP(), server_default=sa.text("CURRENT_TIMESTAMP"), autoincrement=False, nullable=True),
        sa.Column("deleted_at", postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
        sa.ForeignKeyConstraint(["device_id"], ["devices.id"], name="power_usage_records_device_id_fkey"),
        sa.PrimaryKeyConstraint("id", name="power_usage_records_pkey"),
    )
    op.create_index("idx_power_usage_records_timestamp", "power_usage_records", ["timestamp"], unique=False)
    op.create_index("idx_power_usage_records_device_id", "power_usage_records", ["device_id"], unique=False)
    op.create_table("schema_migrations", sa.Column("version", sa.BIGINT(), autoincrement=False, nullable=False), sa.Column("dirty", sa.BOOLEAN(), autoincrement=False, nullable=False), sa.PrimaryKeyConstraint("version", name="schema_migrations_pkey"))
    op.create_table(
        "users",
        sa.Column("id", sa.INTEGER(), server_default=sa.text("nextval('users_id_seq'::regclass)"), autoincrement=True, nullable=False),
        sa.Column("username", sa.VARCHAR(length=50), autoincrement=False, nullable=False),
        sa.Column("password", sa.VARCHAR(length=255), autoincrement=False, nullable=False),
        sa.Column("email", sa.VARCHAR(length=100), autoincrement=False, nullable=False),
        sa.Column("phone", sa.VARCHAR(length=20), autoincrement=False, nullable=True),
        sa.Column("last_login_at", postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
        sa.Column("is_active", sa.BOOLEAN(), server_default=sa.text("true"), autoincrement=False, nullable=True),
        sa.Column("role", sa.VARCHAR(length=20), server_default=sa.text("'user'::character varying"), autoincrement=False, nullable=True),
        sa.Column("created_at", postgresql.TIMESTAMP(), server_default=sa.text("CURRENT_TIMESTAMP"), autoincrement=False, nullable=True),
        sa.Column("updated_at", postgresql.TIMESTAMP(), server_default=sa.text("CURRENT_TIMESTAMP"), autoincrement=False, nullable=True),
        sa.Column("deleted_at", postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
        sa.PrimaryKeyConstraint("id", name="users_pkey"),
        sa.UniqueConstraint("email", name="users_email_key"),
        sa.UniqueConstraint("username", name="users_username_key"),
        postgresql_ignore_search_path=False,
    )
    op.create_index("idx_users_username", "users", ["username"], unique=False)
    op.create_index("idx_users_email", "users", ["email"], unique=False)
    op.create_table(
        "devices",
        sa.Column("id", sa.INTEGER(), autoincrement=True, nullable=False),
        sa.Column("name", sa.VARCHAR(length=100), autoincrement=False, nullable=False),
        sa.Column("device_id", sa.VARCHAR(length=50), autoincrement=False, nullable=False),
        sa.Column("type", sa.VARCHAR(length=50), autoincrement=False, nullable=False),
        sa.Column("status", sa.VARCHAR(length=20), server_default=sa.text("'offline'::character varying"), autoincrement=False, nullable=True),
        sa.Column("location", sa.VARCHAR(length=100), autoincrement=False, nullable=True),
        sa.Column("last_online", postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
        sa.Column("user_id", sa.INTEGER(), autoincrement=False, nullable=False),
        sa.Column("power_usage", sa.NUMERIC(precision=10, scale=2), server_default=sa.text("0"), autoincrement=False, nullable=True),
        sa.Column("is_active", sa.BOOLEAN(), server_default=sa.text("true"), autoincrement=False, nullable=True),
        sa.Column("description", sa.TEXT(), autoincrement=False, nullable=True),
        sa.Column("created_at", postgresql.TIMESTAMP(), server_default=sa.text("CURRENT_TIMESTAMP"), autoincrement=False, nullable=True),
        sa.Column("updated_at", postgresql.TIMESTAMP(), server_default=sa.text("CURRENT_TIMESTAMP"), autoincrement=False, nullable=True),
        sa.Column("deleted_at", postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], name="devices_user_id_fkey"),
        sa.PrimaryKeyConstraint("id", name="devices_pkey"),
        sa.UniqueConstraint("device_id", name="devices_device_id_key"),
    )
    op.create_index("idx_devices_user_id", "devices", ["user_id"], unique=False)
    op.create_index("idx_devices_device_id", "devices", ["device_id"], unique=False)
    op.drop_index(op.f("ix_locations_id"), table_name="locations")
    op.drop_table("locations")
    # ### end Alembic commands ###
