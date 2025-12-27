#!/usr/bin/env python3
import os
import json
import random
from datetime import datetime, timedelta

print("🚀 Setting up Simple Coconut Price Backend...")
print("=" * 50)

# Create data directory
os.makedirs('data', exist_ok=True)

# Create initial prices.json
print("📊 Creating sample price data...")

prices = []
base_date = datetime.now() - timedelta(days=30)

for i in range(30):
    date = base_date + timedelta(days=i)
    
    # Generate realistic price trend
    base_price = 24 + (i * 0.15)  # Slowly increasing trend
    variation = 1.5
    
    avg_price = round(base_price + (random.uniform(-variation, variation)), 1)
    min_price = round(avg_price - random.uniform(1, 2.5), 1)
    max_price = round(avg_price + random.uniform(1, 2.5), 1)
    
    price_entry = {
        "id": i + 1,
        "average_price": avg_price,
        "min_price": min_price,
        "max_price": max_price,
        "source_count": random.randint(3, 5),
        "sources": [
            {"source": "commodityonline", "price": random.randint(int(min_price), int(max_price)), "timestamp": date.isoformat()},
            {"source": "commoditymarketlive", "price": random.randint(int(min_price), int(max_price)), "timestamp": date.isoformat()},
            {"source": "kisantak", "price": random.randint(int(min_price), int(max_price)), "timestamp": date.isoformat()}
        ],
        "timestamp": date.isoformat()
    }
    
    prices.append(price_entry)

prices_data = {
    "prices": prices[-7:],  # Keep only last 7 days for demo
    "last_updated": datetime.now().isoformat()
}

with open('data/prices.json', 'w') as f:
    json.dump(prices_data, f, indent=2)

print(f"✅ Created {len(prices_data['prices'])} price entries")

# Create empty submissions.json
print("📝 Creating submissions file...")

sample_submissions = [
    {
        "id": 1,
        "type": "correction",
        "user_price": 31.5,
        "system_price": 28.5,
        "district": "Chennai",
        "market": "Koyambedu Market",
        "contact": "+91 9876543210",
        "timestamp": (datetime.now() - timedelta(days=2)).isoformat(),
        "status": "pending",
        "notes": "Price seems higher in local market"
    },
    {
        "id": 2,
        "type": "new_submission",
        "user_price": 29.0,
        "district": "Coimbatore",
        "market": "Gandhipuram Market",
        "contact": "+91 9876543211",
        "timestamp": (datetime.now() - timedelta(days=1)).isoformat(),
        "status": "approved",
        "notes": "Verified by admin"
    }
]

with open('data/submissions.json', 'w') as f:
    json.dump(sample_submissions, f, indent=2)

print(f"✅ Created {len(sample_submissions)} sample submissions")

print("=" * 50)
print("✅ Setup complete!")
print("")
print("To run the backend:")
print("  python app.py")
print("")
print("The server will start at: http://localhost:5000")
print("")
print("📱 For React app, use API_BASE_URL = 'http://localhost:5000/api'")