import express from 'express';
import cors from 'cors';
import twilio from 'twilio';

const app = express();
app.use(express.json());
app.use(cors());

// Twilio credentials (replace with your own)
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// Mock database to store OTPs
const otpStore = new Map();

// Function to generate a random OTP
function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Function to store OTP
function storeOtp(phoneNumber, otp) {
    otpStore.set(phoneNumber, otp);
}

// Function to verify OTP
function verifyOtp(phoneNumber, otp) {
    const storedOtp = otpStore.get(phoneNumber);
    if (storedOtp === otp) {
        otpStore.delete(phoneNumber); // OTP should be used only once
        return true;
    }
    return false;
}

// Endpoint to send OTP
app.post('/send-otp', async (req, res) => {
    const { phoneNumber } = req.body;
    const otp = generateOtp();
    storeOtp(phoneNumber, otp);
    try {
        await client.messages.create({
            body: `Your OTP code is ${otp}`,
            from: '+1 443 981 2070', // Replace with your Twilio phone number
            to: `+91${phoneNumber}`
        });
        res.send({ message: 'OTP sent successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error sending OTP', error });
    }
});

// Endpoint to verify OTP
app.post('/verify-otp', (req, res) => {
    const { phoneNumber, otp } = req.body;
    if (verifyOtp(phoneNumber, otp)) {
        res.send({ message: 'OTP verified successfully' });
    } else {
        res.status(400).send({ message: 'Invalid OTP' });
    }
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
