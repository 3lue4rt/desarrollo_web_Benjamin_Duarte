from sqlalchemy import create_engine, Column, Integer, BigInteger, String, ForeignKey, DateTime, Enum
from sqlalchemy.orm import sessionmaker, declarative_base, relationship
import datetime

DB_NAME = "tarea2"
DB_USERNAME = "cc5002"
DB_PASSWORD = "programacionweb"
DB_HOST = "localhost"
DB_PORT = 3306

DATABASE_URL = f"mysql+pymysql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL, echo=False, future=True)
SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()

class Region(Base):
    __tablename__ = 'region'

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    nombre = Column(String(200), nullable=False)

    comunas = relationship("Comuna", back_populates="region", cascade="all, delete")

class Comuna(Base):
    __tablename__ = 'comuna'

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    nombre = Column(String(200), nullable=False)
    region_id = Column(BigInteger, ForeignKey('region.id'), nullable=False)

    region = relationship("Region", back_populates="comunas")
    usuarios = relationship("Usuario", back_populates="comuna", cascade="all, delete")

class Usuario(Base):
    __tablename__ = 'usuarios'

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    nombre = Column(String(255), nullable=False)
    tipo = Column(Enum("pregrado", "posgrado", "funcionario", "academico"), nullable=False)
    email = Column(String(255), nullable=False)
    telefono = Column(Integer, nullable=False)
    fecha_registro = Column(DateTime, nullable=False)
    comuna_id = Column(BigInteger, ForeignKey('comuna.id'), nullable=False)
    comuna = relationship("Comuna", back_populates="usuarios")
    password = Column(String(255), nullable=False)

# --- Database Functions ---

def get_user_by_id(id):
    session = SessionLocal()
    user = session.query(Usuario).filter_by(id=id).first()
    session.close()
    return user

def get_user_by_email(email):
    session = SessionLocal()
    user = session.query(Usuario).filter_by(email=email).first()
    session.close()
    return user


def create_user(nombre, tipo, email, telefono, region, comuna, password) -> bool:
    session = SessionLocal()
    region_db = session.query(Region).filter_by(nombre=region).first()
    if not region_db: 
        session.close()
        return False
    comuna_db = session.query(Comuna).filter_by(nombre=comuna, region_id=region_db.id).first()
    if not comuna_db:
        session.close() 
        return False
    new_user = Usuario(nombre=nombre, 
                       tipo=tipo,
                       email=email,
                       telefono=telefono,
                       fecha_registro=datetime.date.today(),
                       comuna_id=comuna_db.id,
                       password=password)
    session.add(new_user)
    session.commit()
    session.close()
    return True

def register_user(nombre, tipo, email, telefono, region, comuna, password):
    if get_user_by_email(email) is not None:
        return False, "El correo ya esta en uso."

    result = create_user(nombre, tipo, email, telefono, region, comuna, password)
    if not result:
        return False, "Error al crear el usuario"
    
    return True, ""

def login_user(email, password):
    a_user = get_user_by_email(email)
    if a_user is None:
        return False, "Correo o contraseña incorrectos."
    
    if a_user.password != password:
        return False, "Correo o contraseña incorrectos."
    
    return True, ""

def get_last_5_users() -> list[Usuario]:
    session = SessionLocal()
    user = session.query(Usuario).all()
    session.close()
    return user[:-6:-1] #los ultimos 5
