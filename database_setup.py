import os
import sys
from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy import create_engine
from passlib.apps import custom_app_context as pwd_context

Base = declarative_base()

class University(Base):
    __tablename__ = 'university'

    name = Column(
        String(80), nullable=False)

    acronym = Column(
        String(80), nullable=False)

    city = Column(
        String(80), nullable=False)

    state = Column(
        String(80), nullable=False)

    url = Column(
        String(80), nullable=False)

    id = Column(
        Integer, primary_key=True)


engine = create_engine(
                      'sqlite:///universities.db')

Base.metadata.create_all(engine)