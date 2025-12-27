import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, MapPin, Clock, RefreshCw, ChevronDown, ChevronUp, Bell } from 'lucide-react';

const CoconutRateApp = () => {
  const [currentPrice, setCurrentPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [showHistory, setShowHistory] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [userFeedback, setUserFeedback] = useState(null);
  const [showPriceSubmission, setShowPriceSubmission] = useState(false);
  const [userSubmittedPrice, setUserSubmittedPrice] = useState('');
  const [userDistrict, setUserDistrict] = useState('');
  const [userLocation, setUserLocation] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('prices');
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'price_increase', message: 'Price increased by ₹2 in Chennai', time: '2 hours ago', read: false },
    { id: 2, type: 'price_drop', message: 'Price decreased in Madurai district', time: '5 hours ago', read: false },
    { id: 3, type: 'market_update', message: 'New market data available for Coimbatore', time: '1 day ago', read: true }
  ]);
  const [priceAlertThreshold, setPriceAlertThreshold] = useState(30);
  const [selectedAlertDistrict, setSelectedAlertDistrict] = useState('All Districts');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [districtPriceSubmission, setDistrictPriceSubmission] = useState(null);
  const [districtSubmittedPrice, setDistrictSubmittedPrice] = useState('');
  const [districtSubmittedLocation, setDistrictSubmittedLocation] = useState('');
  const [districtSubmissionSuccess, setDistrictSubmissionSuccess] = useState(false);

  // Mock district-wise data
  const districtPrices = [
    { district: 'Chennai', price: 28, min: 26, max: 30, trend: '+2%' },
    { district: 'Coimbatore', price: 27, min: 25, max: 29, trend: '+1%' },
    { district: 'Madurai', price: 26, min: 24, max: 28, trend: '0%' },
    { district: 'Thanjavur', price: 29, min: 27, max: 31, trend: '+3%' },
    { district: 'Trichy', price: 27, min: 25, max: 29, trend: '+1%' },
    { district: 'Salem', price: 28, min: 26, max: 30, trend: '+2%' },
  ];

  // Mock price history data
  const priceHistory = [
    { date: 'Dec 16', price: 25 },
    { date: 'Dec 17', price: 26 },
    { date: 'Dec 18', price: 26 },
    { date: 'Dec 19', price: 27 },
    { date: 'Dec 20', price: 27 },
    { date: 'Dec 21', price: 28 },
    { date: 'Dec 22', price: 28 },
  ];

  // Simulate price fetching
  useEffect(() => {
    fetchCurrentPrice();
  }, []);

  const fetchCurrentPrice = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setCurrentPrice(28);
      setLastUpdated(new Date());
      setLoading(false);
    }, 1500);
  };

  const handlePriceConfirmation = (isCorrect) => {
    setUserFeedback(isCorrect ? 'yes' : 'no');
    if (!isCorrect) {
      // If price is not correct, show submission form after a delay
      setTimeout(() => {
        setShowConfirmation(false);
        setUserFeedback(null);
        setShowPriceSubmission(true);
      }, 1500);
    } else {
      setTimeout(() => {
        setShowConfirmation(false);
        setUserFeedback(null);
      }, 2000);
    }
  };

  const handlePriceSubmission = (e) => {
    e.preventDefault();
    // Validate inputs
    if (!userSubmittedPrice || !userDistrict || !userLocation) {
      alert('Please fill all fields');
      return;
    }
    
    // Simulate API submission
    setSubmissionSuccess(true);
    setTimeout(() => {
      setShowPriceSubmission(false);
      setSubmissionSuccess(false);
      setUserSubmittedPrice('');
      setUserDistrict('');
      setUserLocation('');
    }, 2500);
  };

  const districts = [
    'Chennai', 'Coimbatore', 'Madurai', 'Thanjavur', 
    'Trichy', 'Salem', 'Erode', 'Tirunelveli', 
    'Vellore', 'Thoothukudi', 'Dindigul', 'Kanyakumari'
  ];

  // Mock market data with more details
  const marketDetails = [
    { 
      name: 'Koyambedu Market', 
      district: 'Chennai', 
      price: 28, 
      volume: 'High',
      status: 'Open',
      timing: '6:00 AM - 2:00 PM',
      contact: '+91 98765 43210',
      address: 'Koyambedu, Chennai - 600107'
    },
    { 
      name: 'Gandhipuram Market', 
      district: 'Coimbatore', 
      price: 27, 
      volume: 'Medium',
      status: 'Open',
      timing: '5:00 AM - 1:00 PM',
      contact: '+91 98765 43211',
      address: 'Gandhipuram, Coimbatore - 641012'
    },
    { 
      name: 'Mattuthavani Market', 
      district: 'Madurai', 
      price: 26, 
      volume: 'High',
      status: 'Open',
      timing: '5:30 AM - 1:30 PM',
      contact: '+91 98765 43212',
      address: 'Mattuthavani, Madurai - 625107'
    },
    { 
      name: 'Thanjavur Mandi', 
      district: 'Thanjavur', 
      price: 29, 
      volume: 'Medium',
      status: 'Closed',
      timing: '6:00 AM - 12:00 PM',
      contact: '+91 98765 43213',
      address: 'Medical College Road, Thanjavur - 613004'
    },
    { 
      name: 'Trichy Central Market', 
      district: 'Trichy', 
      price: 27, 
      volume: 'High',
      status: 'Open',
      timing: '5:00 AM - 2:00 PM',
      contact: '+91 98765 43214',
      address: 'Central Bus Stand, Trichy - 620001'
    },
    { 
      name: 'Salem New Bus Stand Market', 
      district: 'Salem', 
      price: 28, 
      volume: 'Low',
      status: 'Open',
      timing: '6:30 AM - 1:00 PM',
      contact: '+91 98765 43215',
      address: 'New Bus Stand, Salem - 636004'
    }
  ];

  const markAlertAsRead = (alertId) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, read: true } : alert
    ));
  };

  const deleteAlert = (alertId) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  const addNewAlert = () => {
    const newAlert = {
      id: alerts.length + 1,
      type: 'price_alert',
      message: `Alert set: Notify when price reaches ₹${priceAlertThreshold} in ${selectedAlertDistrict}`,
      time: 'Just now',
      read: false
    };
    setAlerts([newAlert, ...alerts]);
  };

  const handleDistrictPriceVerification = (district, isCorrect) => {
    if (isCorrect) {
      // User confirmed price is correct
      alert(`Thank you for confirming the price for ${district}!`);
    } else {
      // User says price is incorrect, show submission form
      setDistrictPriceSubmission(district);
    }
  };

  const handleDistrictPriceSubmission = (e) => {
    e.preventDefault();
    if (!districtSubmittedPrice || !districtSubmittedLocation) {
      alert('Please fill all fields');
      return;
    }
    
    // Simulate API submission
    setDistrictSubmissionSuccess(true);
    setTimeout(() => {
      setDistrictPriceSubmission(null);
      setDistrictSubmissionSuccess(false);
      setDistrictSubmittedPrice('');
      setDistrictSubmittedLocation('');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">PvR Digital</h1>
          <p className="text-green-100 text-sm">Coconut Price Tracker</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 pb-20">
        {/* Main Content - Conditional Rendering based on Active Tab */}
        {activeTab === 'prices' && (
          <>
        {/* Main Price Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 mt-6">
          {loading ? (
            <div className="text-center py-12">
              <RefreshCw className="w-12 h-12 mx-auto text-green-600 animate-spin mb-4" />
              <p className="text-gray-600">Fetching latest prices...</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <p className="text-gray-600 mb-2">Today's Average Price</p>
                <div className="text-6xl font-bold text-green-600 mb-2">
                  ₹{currentPrice}
                </div>
                <p className="text-xl text-gray-500">per coconut</p>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
                <Clock className="w-4 h-4" />
                <span>Last updated: {lastUpdated?.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={fetchCurrentPrice}
                  className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  Refresh Price
                </button>
                <button
                  onClick={() => setShowConfirmation(true)}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  Verify Price
                </button>
              </div>
            </>
          )}
        </div>

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
              {userFeedback ? (
                <div className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    userFeedback === 'yes' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <span className="text-3xl">{userFeedback === 'yes' ? '✓' : '✗'}</span>
                  </div>
                  <p className="text-xl font-semibold text-gray-800">
                    {userFeedback === 'yes' ? 'Thank you for confirming!' : 'Please submit the correct price'}
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                    Is this price correct?
                  </h3>
                  <p className="text-4xl font-bold text-green-600 text-center mb-6">
                    ₹{currentPrice} per coconut
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => handlePriceConfirmation(true)}
                      className="flex-1 bg-green-600 text-white py-4 rounded-xl text-xl font-semibold hover:bg-green-700 transition-colors"
                    >
                      YES ✓
                    </button>
                    <button
                      onClick={() => handlePriceConfirmation(false)}
                      className="flex-1 bg-red-600 text-white py-4 rounded-xl text-xl font-semibold hover:bg-red-700 transition-colors"
                    >
                      NO ✗
                    </button>
                  </div>
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="w-full mt-4 text-gray-600 py-2 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Price Submission Modal */}
        {showPriceSubmission && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl my-8">
              {submissionSuccess ? (
                <div className="text-center py-4">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-4xl">✓</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Price Submitted!
                  </h3>
                  <p className="text-gray-600">
                    Thank you for helping us verify prices. Your submission will be reviewed by our admin team.
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                    Submit Actual Price
                  </h3>
                  <p className="text-sm text-gray-600 mb-6 text-center">
                    Help us improve price accuracy by sharing the actual market price
                  </p>

                  <form onSubmit={handlePriceSubmission} className="space-y-4">
                    {/* Price Input */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Price per Coconut (₹)
                      </label>
                      <input
                        type="number"
                        value={userSubmittedPrice}
                        onChange={(e) => setUserSubmittedPrice(e.target.value)}
                        placeholder="Enter price (e.g., 28)"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none text-lg"
                        min="1"
                        max="100"
                        step="0.5"
                      />
                    </div>

                    {/* District Selection */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        District
                      </label>
                      <select
                        value={userDistrict}
                        onChange={(e) => setUserDistrict(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none text-lg bg-white"
                      >
                        <option value="">Select your district</option>
                        {districts.map((district) => (
                          <option key={district} value={district}>
                            {district}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Location/Market Input */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Market/Location Name
                      </label>
                      <input
                        type="text"
                        value={userLocation}
                        onChange={(e) => setUserLocation(e.target.value)}
                        placeholder="e.g., Anna Nagar Market"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none text-lg"
                      />
                    </div>

                    {/* Info Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-xs text-blue-800">
                        <strong>Note:</strong> Your submission will be reviewed by our admin team before being added to the system. This helps maintain data quality and accuracy.
                      </p>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowPriceSubmission(false);
                          setUserSubmittedPrice('');
                          setUserDistrict('');
                          setUserLocation('');
                        }}
                        className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
                      >
                        Submit Price
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        )}

        {/* District-wise Prices */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-bold text-gray-800">District-wise Prices</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-2 text-gray-600 font-semibold">District</th>
                  <th className="text-right py-3 px-2 text-gray-600 font-semibold">Price</th>
                  <th className="text-right py-3 px-2 text-gray-600 font-semibold">Range</th>
                  <th className="text-right py-3 px-2 text-gray-600 font-semibold">Trend</th>
                  <th className="text-center py-3 px-2 text-gray-600 font-semibold">Verify</th>
                </tr>
              </thead>
              <tbody>
                {districtPrices.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-2 font-medium text-gray-800">{item.district}</td>
                    <td className="py-4 px-2 text-right font-bold text-green-600">₹{item.price}</td>
                    <td className="py-4 px-2 text-right text-sm text-gray-600">
                      ₹{item.min}-₹{item.max}
                    </td>
                    <td className="py-4 px-2 text-right">
                      <span className={`text-sm font-semibold ${
                        item.trend.startsWith('+') ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {item.trend}
                      </span>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleDistrictPriceVerification(item.district, true)}
                          className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
                        >
                          YES
                        </button>
                        <button
                          onClick={() => handleDistrictPriceVerification(item.district, false)}
                          className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
                        >
                          NO
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* District Price Submission Modal */}
        {districtPriceSubmission && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl my-8">
              {districtSubmissionSuccess ? (
                <div className="text-center py-4">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-4xl">✓</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Price Submitted!
                  </h3>
                  <p className="text-gray-600">
                    Thank you for submitting the actual price for <strong>{districtPriceSubmission}</strong>. Your submission will be reviewed by our admin team.
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                    Submit Actual Price
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 text-center">
                    District: <strong className="text-green-600">{districtPriceSubmission}</strong>
                  </p>
                  <p className="text-xs text-gray-500 mb-6 text-center">
                    Help us improve price accuracy by sharing the actual market price
                  </p>

                  <form onSubmit={handleDistrictPriceSubmission} className="space-y-4">
                    {/* Price Input */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Actual Price per Coconut (₹)
                      </label>
                      <input
                        type="number"
                        value={districtSubmittedPrice}
                        onChange={(e) => setDistrictSubmittedPrice(e.target.value)}
                        placeholder="Enter actual price (e.g., 30)"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none text-lg"
                        min="1"
                        max="100"
                        step="0.5"
                      />
                    </div>

                    {/* Location/Market Input */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Market/Location Name
                      </label>
                      <input
                        type="text"
                        value={districtSubmittedLocation}
                        onChange={(e) => setDistrictSubmittedLocation(e.target.value)}
                        placeholder="e.g., Central Market, Koyambedu"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none text-lg"
                      />
                    </div>

                    {/* Info Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-xs text-blue-800">
                        <strong>Note:</strong> Your submission will be reviewed by our admin team before being added to the system. This helps maintain data quality and accuracy.
                      </p>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setDistrictPriceSubmission(null);
                          setDistrictSubmittedPrice('');
                          setDistrictSubmittedLocation('');
                        }}
                        className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
                      >
                        Submit Price
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        )}

        {/* Price History */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full flex items-center justify-between mb-4"
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-bold text-gray-800">Price History & Trends</h2>
            </div>
            {showHistory ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          
          {showHistory && (
            <div className="mt-4">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={priceHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" domain={[20, 32]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    formatter={(value) => [`₹${value}`, 'Price']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#059669" 
                    strokeWidth={3}
                    dot={{ fill: '#059669', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">7-Day Avg</p>
                  <p className="text-xl font-bold text-green-600">₹26.7</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Weekly Change</p>
                  <p className="text-xl font-bold text-blue-600">+12%</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Highest</p>
                  <p className="text-xl font-bold text-purple-600">₹28</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Data Sources Info */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            Data Sources
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            Prices aggregated from 5+ trusted agricultural market sources:
          </p>
          <ul className="text-xs text-gray-500 space-y-1">
            <li>• CommodityOnline - Tamil Nadu Mandi Prices</li>
            <li>• CommodityMarketLive - State-wise Rates</li>
            <li>• KisanTak - Dehusked Coconut Prices</li>
            <li>• KrishiDunia - Market Rates & Analysis</li>
            <li>• Multiple verified mandi sources</li>
          </ul>
          <p className="text-xs text-gray-500 mt-3 italic">
            * Prices are processed through our validation engine to ensure accuracy
          </p>
        </div>
        </>
        )}

        {/* Markets Tab Content */}
        {activeTab === 'markets' && (
          <div className="mt-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-green-600" />
                Local Markets
              </h2>
              <p className="text-gray-600 mb-6">Find coconut markets near you with real-time prices and contact information</p>
              
              <div className="space-y-4">
                {marketDetails.map((market, index) => (
                  <div key={index} className="border-2 border-gray-200 rounded-xl p-5 hover:border-green-500 transition-all hover:shadow-md">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{market.name}</h3>
                        <p className="text-sm text-gray-600">{market.district} District</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">₹{market.price}</div>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${
                          market.status === 'Open' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {market.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm mt-4 pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-gray-500">Trading Volume</p>
                        <p className="font-semibold text-gray-800">{market.volume}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Timing</p>
                        <p className="font-semibold text-gray-800">{market.timing}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-start gap-2 text-sm mb-2">
                        <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{market.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">{market.contact}</span>
                      </div>
                    </div>
                    
                    <button className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                      Get Directions
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-gray-800 mb-3">💡 Market Tips</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Visit markets early morning for best prices</li>
                <li>• Check multiple markets before selling</li>
                <li>• Prices may vary based on coconut quality</li>
                <li>• Contact markets beforehand to confirm timings</li>
              </ul>
            </div>
          </div>
        )}

        {/* Alerts Tab Content */}
        {activeTab === 'alerts' && (
          <div className="mt-6">
            {/* Alert Settings Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Bell className="w-6 h-6 text-green-600" />
                Price Alerts
              </h2>
              <p className="text-gray-600 mb-6">Set custom alerts to get notified about price changes</p>
              
              {/* Notifications Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-6">
                <div>
                  <p className="font-semibold text-gray-800">Enable Notifications</p>
                  <p className="text-sm text-gray-600">Receive price alerts on your device</p>
                </div>
                <button
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className={`w-14 h-8 rounded-full transition-colors ${
                    notificationsEnabled ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
                    notificationsEnabled ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {/* Alert Configuration */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Alert when price reaches (₹)
                  </label>
                  <input
                    type="number"
                    value={priceAlertThreshold}
                    onChange={(e) => setPriceAlertThreshold(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none text-lg"
                    min="10"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select District
                  </label>
                  <select
                    value={selectedAlertDistrict}
                    onChange={(e) => setSelectedAlertDistrict(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none text-lg bg-white"
                  >
                    <option value="All Districts">All Districts</option>
                    {districts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={addNewAlert}
                  disabled={!notificationsEnabled}
                  className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                    notificationsEnabled
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Set Alert
                </button>
              </div>
            </div>

            {/* Recent Alerts/Notifications */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Notifications</h3>
              
              {alerts.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="w-16 h-16 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">No notifications yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        alert.read 
                          ? 'border-gray-200 bg-gray-50' 
                          : 'border-green-200 bg-green-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`w-2 h-2 rounded-full ${
                              alert.type === 'price_increase' ? 'bg-green-500' :
                              alert.type === 'price_drop' ? 'bg-red-500' :
                              'bg-blue-500'
                            }`} />
                            <p className="font-semibold text-gray-800">{alert.message}</p>
                          </div>
                          <p className="text-xs text-gray-500">{alert.time}</p>
                        </div>
                        <div className="flex gap-2">
                          {!alert.read && (
                            <button
                              onClick={() => markAlertAsRead(alert.id)}
                              className="text-xs bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
                            >
                              Mark Read
                            </button>
                          )}
                          <button
                            onClick={() => deleteAlert(alert.id)}
                            className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-lg hover:bg-red-200"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Alert Types Info */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl shadow-lg p-6 mt-6">
              <h3 className="font-bold text-gray-800 mb-3">🔔 Alert Types</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• <strong>Price Threshold:</strong> When price reaches your target</li>
                <li>• <strong>Price Increase:</strong> Daily price goes up significantly</li>
                <li>• <strong>Price Drop:</strong> Price decreases in your district</li>
                <li>• <strong>Market Updates:</strong> New data from local markets</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-around">
          <button 
            onClick={() => setActiveTab('prices')}
            className={`flex flex-col items-center gap-1 ${
              activeTab === 'prices' ? 'text-green-600' : 'text-gray-400'
            }`}
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium">Prices</span>
          </button>
          <button 
            onClick={() => setActiveTab('markets')}
            className={`flex flex-col items-center gap-1 ${
              activeTab === 'markets' ? 'text-green-600' : 'text-gray-400'
            }`}
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium">Markets</span>
          </button>
          <button 
            onClick={() => setActiveTab('alerts')}
            className={`flex flex-col items-center gap-1 relative ${
              activeTab === 'alerts' ? 'text-green-600' : 'text-gray-400'
            }`}
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <Bell className="w-6 h-6" />
              {alerts.filter(a => !a.read).length > 0 && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </div>
            <span className="text-xs font-medium">Alerts</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoconutRateApp;