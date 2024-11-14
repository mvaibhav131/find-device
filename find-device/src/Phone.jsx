import { useState } from 'react';
import { parsePhoneNumberFromString } from 'libphonenumber-js'; // For phone number parsing

const PhoneInfo = () => {
    const [number, setNumber] = useState('');
    const [locationInfo, setLocationInfo] = useState(null);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        setNumber(e.target.value);
    };

    const fetchPhoneInfo = async () => {
        try {
            // Phone number parsing using libphonenumber-js
            const phoneNumber = parsePhoneNumberFromString(number);
            if (!phoneNumber || !phoneNumber.isValid()) {
                setError('Invalid phone number');
                return;
            }
            
            const numberLocation = phoneNumber.country; // Get the country from the phone number
            const carrierName = phoneNumber.carrier || 'Unknown'; // Carrier name may not always be available
            
            // OpenCage API call
            const apiKey = '9cd5830d10e841e2a6abdeb69643a46b'; // Your API key
            const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${numberLocation}&key=${apiKey}`;

            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.results.length > 0) {
                const result = data.results[0];
                const { lat, lng } = result.geometry;
                const timezone = result.annotations.timezone.name;
                const currencyName = result.annotations.currency.name;
                const currencySymbol = result.annotations.currency.symbol;

                setLocationInfo({
                    numberLocation,
                    carrierName,
                    lat,
                    lng,
                    timezone,
                    currencyName,
                    currencySymbol,
                });
                setError('');
            } else {
                setError('Location not found');
            }
        } catch (err) {
            console.log(err);
            setError('Invalid phone number or API error');
        }
    };

    return (
        <div>
            <h1>Phone Number Info</h1>
            <input
                type="text"
                value={number}
                onChange={handleInputChange}
                placeholder="Enter phone number with country code"
            />
            <button onClick={fetchPhoneInfo}>Get Info</button>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {locationInfo && (
                <div>
                    <h2>Information:</h2>
                    <p>Location: {locationInfo.numberLocation}</p>
                    <p>Service Provider: {locationInfo.carrierName}</p>
                    <p>Latitude: {locationInfo.lat}</p>
                    <p>Longitude: {locationInfo.lng}</p>
                    <p>Time Zone: {locationInfo.timezone}</p>
                    <p>Currency: {locationInfo.currencyName} ({locationInfo.currencySymbol})</p>
                </div>
            )}
        </div>
    );
};

export default PhoneInfo;
