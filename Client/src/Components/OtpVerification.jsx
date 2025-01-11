import React, { useState } from 'react';
import './OtpVerification.css';

function OtpVerification() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const [otpSent, setOtpSent] = useState(false);

    const handleSendOtp = async () => {
        try {
            const response = await fetch('http://localhost:5000/send-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phoneNumber }),
            });
            const data = await response.json();
            setMessage(data.message);
            setOtpSent(true);
        } catch (error) {
            setMessage('Error sending OTP');
        }
    };

    const handleVerifyOtp = async () => {
        try {
            const response = await fetch('http://localhost:5000/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phoneNumber, otp }),
            });
            const data = await response.json();
            setMessage(data.message);
        } catch (error) {
            setMessage('Invalid OTP');
        }
    };

    return (
        <div className="otp-verification-container">
            <h2>OTP Verification</h2>
            <input 
                type="text" 
                placeholder="Enter your phone number" 
                value={phoneNumber} 
                onChange={(e) => setPhoneNumber(e.target.value)} 
                className="input-field"
            />
            <button onClick={handleSendOtp} className="send-button">
                Send OTP
            </button>
            {otpSent && (
                <>
                    <input 
                        type="text" 
                        placeholder="Enter OTP" 
                        value={otp} 
                        onChange={(e) => setOtp(e.target.value)} 
                        className="input-field"
                    />
                    <button onClick={handleVerifyOtp} className="verify-button">
                        Verify OTP
                    </button>
                </>
            )}
            {message && <div className="message">{message}</div>}
        </div>
    );
}

export default OtpVerification;
