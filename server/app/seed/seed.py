"""Seed script to populate database with sample data"""
import asyncio
from datetime import datetime, timedelta
import random
from motor.motor_asyncio import AsyncIOMotorClient

MONGODB_URI = "mongodb://localhost:27017"
DB_NAME = "interview_db"

CATEGORIES = ["Apparel", "Gadgets", "Books", "Home", "Sports"]
PRODUCTS = [
    ("Wireless Headphones", "High-quality wireless headphones with noise cancellation", 14999),
    ("Running Shoes", "Comfortable running shoes for daily workouts", 8999),
    ("Coffee Maker", "Programmable coffee maker with thermal carafe", 7999),
    ("Yoga Mat", "Non-slip yoga mat for home practice", 2999),
    ("LED Desk Lamp", "Adjustable LED desk lamp with USB charging port", 4499),
    ("Laptop Backpack", "Water-resistant laptop backpack with multiple compartments", 5999),
    ("Bluetooth Speaker", "Portable bluetooth speaker with 12-hour battery", 6999),
    ("Water Bottle", "Insulated stainless steel water bottle 32oz", 2499),
    ("Fitness Tracker", "Smart fitness tracker with heart rate monitor", 9999),
    ("Cookbook", "Healthy cooking recipes for busy professionals", 2999),
]

async def seed_data():
    client = AsyncIOMotorClient(MONGODB_URI)
    db = client[DB_NAME]
    
    # Clear existing data
    await db.products.delete_many({})
    
    # Insert sample products
    products = []
    base_date = datetime.utcnow() - timedelta(days=90)
    
    for i, (name, desc, price) in enumerate(PRODUCTS):
        products.append({
            "name": name,
            "description": desc,
            "priceCents": price,
            "stock": random.randint(0, 100),
            "category": random.choice(CATEGORIES),
            "createdAt": base_date + timedelta(days=random.randint(0, 90)),
            "updatedAt": datetime.utcnow()
        })
    
    result = await db.products.insert_many(products)
    print(f"✓ Inserted {len(result.inserted_ids)} products")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_data())

