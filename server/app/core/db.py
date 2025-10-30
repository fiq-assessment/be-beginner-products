from motor.motor_asyncio import AsyncIOMotorClient
from .config import settings

client = AsyncIOMotorClient(settings.MONGODB_URI)
db = client[settings.DB_NAME]

# EXPECTATION: Use proper indexes in the products collection.
# Create indexes at application startup for category and createdAt fields.
async def init_db():
    """Initialize database indexes"""
    await db.products.create_index([("category", 1)])
    await db.products.create_index([("createdAt", -1)])
    await db.products.create_index([("name", "text"), ("description", "text")])
    print("✓ Database indexes created")

