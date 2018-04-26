from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database_setup import University, Base

engine = create_engine('sqlite:///universities.db')
# Bind the engine to the metadata of the Base class so that the
# declaratives can be accessed through a DBSession instance
Base.metadata.bind = engine

DBSession = sessionmaker(bind=engine)
# A DBSession() instance establishes all conversations with the database
# and represents a "staging zone" for all the objects loaded into the
# database session object. Any change made against the objects in the
# session won't be persisted into the database until you call
# session.commit(). If you're not happy about the changes, you can
# revert all of them back to the last commit by calling
# session.rollback()
session = DBSession()


# Add example user
universityOne = University(name="Universidad Nacional Autónoma de México (CU)", acronym="UNAM-CU", city="Ciudad de México", state="Ciudad de México", url="http://www.posgrado.unam.mx/es/convocatorias/vigentes")
session.add(universityOne)
session.commit()

# Add example user
universityOne = University(name="Universidad Iberoamericana", acronym="La Ibero", city="Ciudad de México", state="Ciudad de México", url="http://posgrados.ibero.mx/contenido.php?cont=397")
session.add(universityOne)
session.commit()

# Add example user
universityOne = University(name="Universidad de las Américas Puebla", acronym="UDLAP-Puebla", city="Puebla", state="Puebla", url="http://www.udlap.mx/posgrados/")
session.add(universityOne)
session.commit()

print("Added 3 example Universities")