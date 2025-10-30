from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ProductIn(BaseModel):
    """Product creation/update model"""
    name: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1, max_length=2000)
    priceCents: int = Field(..., ge=0, description="Price in cents")
    stock: int = Field(..., ge=0, description="Available stock")
    category: str = Field(..., min_length=1, max_length=100)

class ProductOut(BaseModel):
    """Product response model"""
    id: str
    name: str
    description: str
    priceCents: int
    stock: int
    category: str
    createdAt: datetime
    updatedAt: Optional[datetime] = None

    class Config:
        from_attributes = True

