import Chatbot from './Components/Chatbot';
import Landing from './Components/Landing';
import {Routes, Route, Navigate} from 'react-router-dom';
import './App.css';
import AboutUs from './Components/AboutUs1';
import Login from './Components/LoginSignup'
import SignUp from './Components/Signup';
import Booking from './Components/BookingPage';
import { Navbar } from '@material-tailwind/react';
import UserProfile from './Components/UserProfile';
import BookingPage from './Components/BookingPage';
import BookingHistory from './Components/BookingHistory';
//import SignupWithSMS from './Components/SignupWithSMS';
import StepThree from './Components/StepThree';
import VerifyEmail from './Components/VerifyEmail';
import MuseumQuiz from './Components/MuseumQuiz';
import OtpVerification from './Components/OtpVerification'
import VirtualTour from './Components/VirtualTour';
import Shop from './Components/Shop';
import Payment from './Components/Payment';
import QrCodeScanner from './Components/QrCodeScanner.jsx';

function App() {
  return (
    <Routes>
      <Route path="/qr" element={<QrCodeScanner/>}/>
      <Route path='/payment' element={<Payment/>}/>
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/" element={<Landing />} />
      <Route path="/chatbot" element={<Chatbot />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<SignUp />} />
      <Route path='/booking' element={<Booking />} />
      <Route path='/aboutus' element={<AboutUs />} />
      <Route path='/history' element={<BookingHistory />} />
      <Route path='/verify-email' element={<VerifyEmail />} />
      <Route path='/quiz' element={<MuseumQuiz />} />
      <Route path='/otp' element={<OtpVerification/>}/> 
      <Route path='/vt' element={<VirtualTour/>}/>
      <Route path='/shop' element={<Shop />} />
    </Routes>
  )
}

export default App
