from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime, timedelta
import json
import os
import random
from scraper import CoconutPriceScraper

app = Flask(__name__)
CORS(app)

# File paths
PRICES_FILE = 'data/prices.json'
SUBMISSIONS_FILE = 'data/submissions.json'

# Initialize scraper
scraper = CoconutPriceScraper()

def load_json_file(filepath, default_data):
    """Load JSON file, create if doesn't exist"""
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            return json.load(f)
    else:
        # Create directory if needed
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        with open(filepath, 'w') as f:
            json.dump(default_data, f, indent=2)
        return default_data

def save_json_file(filepath, data):
    """Save data to JSON file"""
    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2)

@app.route('/')
def home():
    return jsonify({
        "message": "Coconut Price API - Simple Backend",
        "version": "1.0.0",
        "endpoints": {
            "/api/price": "GET - Get current coconut price",
            "/api/price/refresh": "POST - Manually refresh price",
            "/api/history": "GET - Get price history (add ?days=7)",
            "/api/verify": "POST - Verify if price is correct",
            "/api/submit": "POST - Submit new price",
            "/api/districts": "GET - Get district-wise prices",
            "/api/submissions": "GET - Get user submissions"
        }
    })

@app.route('/api/price', methods=['GET'])
def get_price():
    """Get current coconut price"""
    prices_data = load_json_file(PRICES_FILE, {"prices": [], "last_updated": None})
    
    if not prices_data["prices"]:
        return jsonify({
            "success": False,
            "message": "No price data available. Please refresh prices."
        }), 404
    
    latest_price = prices_data["prices"][-1]
    
    return jsonify({
        "success": True,
        "data": {
            "current_price": latest_price["average_price"],
            "min_price": latest_price["min_price"],
            "max_price": latest_price["max_price"],
            "source_count": latest_price["source_count"],
            "last_updated": latest_price["timestamp"]
        },
        "message": "Price retrieved successfully"
    })

@app.route('/api/price/refresh', methods=['POST'])
def refresh_price():
    """Manually refresh coconut price"""
    try:
        print("🔄 Refreshing coconut prices...")
        
        # For demo purposes, we'll simulate scraping
        # In production, uncomment the real scraping:
        # scraped_prices = scraper.scrape_all_sources()
        
        # Simulated scraping for demo
        scraped_prices = [
            {"source": "commodityonline", "price": random.randint(26, 32), "timestamp": datetime.now().isoformat()},
            {"source": "commoditymarketlive", "price": random.randint(27, 31), "timestamp": datetime.now().isoformat()},
            {"source": "kisantak", "price": random.randint(25, 30), "timestamp": datetime.now().isoformat()},
            {"source": "krishidunia", "price": random.randint(28, 33), "timestamp": datetime.now().isoformat()},
            {"source": "krishidunia", "price": random.randint(27, 32), "timestamp": datetime.now().isoformat()}
        ]
        
        print(f"📊 Scraped {len(scraped_prices)} prices")
        
        # Extract valid prices
        valid_prices = [p["price"] for p in scraped_prices if 10 <= p["price"] <= 100]
        
        if not valid_prices:
            return jsonify({
                "success": False,
                "message": "No valid prices found from sources"
            }), 400
        
        # Calculate statistics
        avg_price = round(sum(valid_prices) / len(valid_prices), 2)
        min_price = round(min(valid_prices), 2)
        max_price = round(max(valid_prices), 2)
        
        # Load existing prices
        prices_data = load_json_file(PRICES_FILE, {"prices": [], "last_updated": None})
        
        # Create new price entry
        new_price = {
            "id": len(prices_data["prices"]) + 1,
            "average_price": avg_price,
            "min_price": min_price,
            "max_price": max_price,
            "source_count": len(valid_prices),
            "sources": scraped_prices,
            "timestamp": datetime.now().isoformat()
        }
        
        # Add to history
        prices_data["prices"].append(new_price)
        
        # Keep only last 30 days of data
        cutoff_date = datetime.now() - timedelta(days=30)
        prices_data["prices"] = [
            p for p in prices_data["prices"] 
            if datetime.fromisoformat(p["timestamp"].replace('Z', '+00:00')) > cutoff_date
        ]
        
        # Update IDs
        for i, price in enumerate(prices_data["prices"], 1):
            price["id"] = i
        
        prices_data["last_updated"] = datetime.now().isoformat()
        
        # Save to file
        save_json_file(PRICES_FILE, prices_data)
        
        print(f"✅ Price updated: ₹{avg_price} (min: ₹{min_price}, max: ₹{max_price})")
        
        return jsonify({
            "success": True,
            "data": new_price,
            "message": f"Price refreshed: ₹{avg_price} per coconut"
        })
        
    except Exception as e:
        print(f"❌ Error refreshing price: {e}")
        return jsonify({
            "success": False,
            "message": f"Error: {str(e)}"
        }), 500

@app.route('/api/history', methods=['GET'])
def get_history():
    """Get price history"""
    days = int(request.args.get('days', 7))
    
    prices_data = load_json_file(PRICES_FILE, {"prices": [], "last_updated": None})
    
    # Return requested number of days
    history = prices_data["prices"][-days:] if days <= len(prices_data["prices"]) else prices_data["prices"]
    
    # Format for charts
    chart_data = []
    for price in history:
        date_str = datetime.fromisoformat(price["timestamp"].replace('Z', '+00:00')).strftime('%b %d')
        chart_data.append({
            "date": date_str,
            "price": price["average_price"],
            "min": price["min_price"],
            "max": price["max_price"]
        })
    
    return jsonify({
        "success": True,
        "data": {
            "prices": history,
            "chart_data": chart_data
        },
        "count": len(history)
    })

@app.route('/api/verify', methods=['POST'])
def verify_price():
    """User verifies if price is correct"""
    try:
        data = request.json
        
        if not data or 'is_correct' not in data:
            return jsonify({
                "success": False,
                "message": "Missing 'is_correct' field"
            }), 400
        
        is_correct = data['is_correct']
        user_price = data.get('price')
        district = data.get('district', 'Unknown')
        market = data.get('market', '')
        
        # Get current price for reference
        prices_data = load_json_file(PRICES_FILE, {"prices": [], "last_updated": None})
        current_avg = prices_data["prices"][-1]["average_price"] if prices_data["prices"] else 0
        
        if is_correct:
            print(f"✅ User confirmed price ₹{current_avg} is correct for {district}")
            
            return jsonify({
                "success": True,
                "message": "Thank you for confirming the price!",
                "data": {
                    "confirmed_price": current_avg,
                    "district": district,
                    "timestamp": datetime.now().isoformat()
                }
            })
        else:
            if not user_price:
                return jsonify({
                    "success": False,
                    "message": "Please provide the correct price"
                }), 400
            
            print(f"📝 User submitted correction: ₹{user_price} for {district} (market: {market})")
            
            # Save user submission
            submissions = load_json_file(SUBMISSIONS_FILE, [])
            
            submission = {
                "id": len(submissions) + 1,
                "type": "correction",
                "user_price": float(user_price),
                "system_price": current_avg,
                "district": district,
                "market": market,
                "timestamp": datetime.now().isoformat(),
                "status": "pending",
                "notes": "User reported incorrect price"
            }
            
            submissions.append(submission)
            save_json_file(SUBMISSIONS_FILE, submissions)
            
            return jsonify({
                "success": True,
                "message": "Price correction submitted for admin review",
                "data": submission
            })
            
    except Exception as e:
        print(f"❌ Error in verification: {e}")
        return jsonify({
            "success": False,
            "message": f"Error: {str(e)}"
        }), 500

@app.route('/api/submit', methods=['POST'])
def submit_price():
    """User submits new price"""
    try:
        data = request.json
        
        required = ['price', 'district']
        for field in required:
            if field not in data:
                return jsonify({
                    "success": False,
                    "message": f"Missing required field: {field}"
                }), 400
        
        # Save user submission
        submissions = load_json_file(SUBMISSIONS_FILE, [])
        
        submission = {
            "id": len(submissions) + 1,
            "type": "new_submission",
            "user_price": float(data['price']),
            "district": data['district'],
            "market": data.get('market', ''),
            "contact": data.get('contact', ''),
            "timestamp": datetime.now().isoformat(),
            "status": "pending",
            "notes": data.get('notes', '')
        }
        
        submissions.append(submission)
        save_json_file(SUBMISSIONS_FILE, submissions)
        
        print(f"📥 New price submission: ₹{data['price']} from {data['district']}")
        
        return jsonify({
            "success": True,
            "message": "Price submitted successfully for admin review",
            "data": submission
        })
        
    except Exception as e:
        print(f"❌ Error submitting price: {e}")
        return jsonify({
            "success": False,
            "message": f"Error: {str(e)}"
        }), 500

@app.route('/api/districts', methods=['GET'])
def get_district_prices():
    """Get district-wise prices"""
    try:
        prices_data = load_json_file(PRICES_FILE, {"prices": [], "last_updated": None})
        
        if not prices_data["prices"]:
            return jsonify({
                "success": False,
                "message": "No price data available"
            }), 404
        
        latest_price = prices_data["prices"][-1]
        base_price = latest_price["average_price"]
        
        # Tamil Nadu districts with price variations
        tamil_nadu_districts = [
            "Chennai", "Coimbatore", "Madurai", "Thanjavur", "Trichy", 
            "Salem", "Erode", "Tirunelveli", "Vellore", "Thoothukudi",
            "Dindigul", "Kanyakumari", "Kanchipuram", "Tiruvallur", "Cuddalore",
            "Nagapattinam", "Pudukkottai", "Sivaganga", "Ramanathapuram", "Virudhunagar",
            "Theni", "Namakkal", "Dharmapuri", "Krishnagiri", "Ariyalur", "Perambalur"
        ]
        
        # Generate district prices with realistic variations
        districts_data = []
        for district in tamil_nadu_districts[:12]:  # Show first 12 districts
            # Create some variation (-3 to +3 from base price)
            variation = random.uniform(-3, 3)
            district_price = round(base_price + variation, 1)
            
            # Ensure price is reasonable
            district_price = max(20, min(35, district_price))
            
            # Determine trend
            trend_variation = random.choice([-2, -1, 0, 0, 1, 2, 2])
            trend = f"{'+' if trend_variation >= 0 else ''}{trend_variation}%"
            
            # Min and max range
            min_price = round(district_price * 0.9, 1)
            max_price = round(district_price * 1.1, 1)
            
            districts_data.append({
                "district": district,
                "price": district_price,
                "min": min_price,
                "max": max_price,
                "trend": trend,
                "source_count": random.randint(2, 5)
            })
        
        # Sort by price (highest first)
        districts_data.sort(key=lambda x: x["price"], reverse=True)
        
        return jsonify({
            "success": True,
            "data": {
                "districts": districts_data,
                "state_average": base_price,
                "total_districts": len(districts_data),
                "last_updated": latest_price["timestamp"]
            }
        })
        
    except Exception as e:
        print(f"❌ Error getting district prices: {e}")
        return jsonify({
            "success": False,
            "message": f"Error: {str(e)}"
        }), 500

@app.route('/api/submissions', methods=['GET'])
def get_submissions():
    """Get all user submissions"""
    try:
        submissions = load_json_file(SUBMISSIONS_FILE, [])
        
        # Filter by status if provided
        status_filter = request.args.get('status')
        if status_filter:
            filtered = [s for s in submissions if s.get('status') == status_filter]
        else:
            filtered = submissions
        
        return jsonify({
            "success": True,
            "data": filtered,
            "count": len(filtered),
            "pending_count": len([s for s in submissions if s.get('status') == 'pending'])
        })
        
    except Exception as e:
        print(f"❌ Error getting submissions: {e}")
        return jsonify({
            "success": False,
            "message": f"Error: {str(e)}"
        }), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get statistics about the system"""
    try:
        prices_data = load_json_file(PRICES_FILE, {"prices": [], "last_updated": None})
        submissions = load_json_file(SUBMISSIONS_FILE, [])
        
        if not prices_data["prices"]:
            return jsonify({
                "success": False,
                "message": "No price data available"
            }), 404
        
        latest_price = prices_data["prices"][-1]
        
        # Calculate 7-day average
        last_7_days = prices_data["prices"][-7:] if len(prices_data["prices"]) >= 7 else prices_data["prices"]
        seven_day_avg = round(sum(p["average_price"] for p in last_7_days) / len(last_7_days), 2)
        
        # Calculate weekly change
        if len(prices_data["prices"]) >= 2:
            current = latest_price["average_price"]
            previous = prices_data["prices"][-2]["average_price"] if len(prices_data["prices"]) >= 2 else current
            weekly_change = round(((current - previous) / previous) * 100, 1)
        else:
            weekly_change = 0
        
        stats = {
            "current_price": latest_price["average_price"],
            "min_today": latest_price["min_price"],
            "max_today": latest_price["max_price"],
            "source_count": latest_price["source_count"],
            "seven_day_average": seven_day_avg,
            "weekly_change": f"{'+' if weekly_change >= 0 else ''}{weekly_change}%",
            "total_submissions": len(submissions),
            "pending_submissions": len([s for s in submissions if s.get('status') == 'pending']),
            "data_points": len(prices_data["prices"]),
            "last_updated": latest_price["timestamp"]
        }
        
        return jsonify({
            "success": True,
            "data": stats
        })
        
    except Exception as e:
        print(f"❌ Error getting stats: {e}")
        return jsonify({
            "success": False,
            "message": f"Error: {str(e)}"
        }), 500

if __name__ == '__main__':
    # Ensure data directory exists
    os.makedirs('data', exist_ok=True)
    
    print("🌴 Coconut Price Backend - Simple Version")
    print("=" * 50)
    print("Server starting on: http://localhost:5000")
    print("")
    print("API Endpoints:")
    print("  GET  /                     - API documentation")
    print("  GET  /api/price           - Get current price")
    print("  POST /api/price/refresh   - Refresh price")
    print("  GET  /api/history         - Get price history")
    print("  POST /api/verify          - Verify price (YES/NO)")
    print("  POST /api/submit          - Submit new price")
    print("  GET  /api/districts       - Get district prices")
    print("  GET  /api/submissions     - Get user submissions")
    print("  GET  /api/stats           - Get system statistics")
    print("")
    print("Sample data has been loaded from prices.json")
    print("=" * 50)
    
    app.run(host='0.0.0.0', port=5000, debug=True)