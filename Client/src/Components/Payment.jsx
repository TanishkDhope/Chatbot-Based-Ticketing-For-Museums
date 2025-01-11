import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../firebase"; // Firebase config
import { doc, setDoc, collection } from "firebase/firestore";
import { BookingContext } from "../Context/BookingContext";
import "./Payment.css";

const Payment = () => {
  const ticketPrices = {
    normal: {
      Adult: 160,
      Student: 120,
      Child: 80,
      Disabled: 50,
      Senior: 80,
    },
    premium: {
      Adult: 200,
      Student: 150,
      Child: 100,
      Disabled: 70,
      Senior: 100,
    },
    vip: {
      Adult: 300,
      Student: 200,
      Child: 150,
      Disabled: 100,
      Senior: 150,
    },
  };

  const ticketTypeDescriptions = {
    normal: 'Standard tickets with basic access to all exhibits and facilities.',
    premium: 'Enhanced tickets with additional benefits such as priority entry and exclusive access.',
    vip: 'Luxury tickets offering the highest level of service, including guided tours and premium amenities.',
  };

  const nationalityDescriptions = {
    Indian: 'Prices are standard as per the listed rates.',
    Foreign: 'Prices are multiplied by 10 for foreign nationals.',
  };
  const navigate = useNavigate();
  const { newBooking, setNewBooking } = useContext(BookingContext);
  const location = useLocation();
  const { bookingData } = location.state;
  const { userDetails, ticketPrice, ticketDetails, ticketType = 'normal', selectedTiming } = bookingData;

  const [currency, setCurrency] = useState("INR"); // Default currency
  const [amount, setAmount] = useState(bookingData.totalPrice);
  const recieptId = "qwsaq1"; // Sample receipt ID
  const supportedCurrencies = ["INR", "USD", "EUR", "GBP"]; // Add more currencies if needed

  const handlePayment = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      // Step 1: Create order on your server
      const response = await fetch("http://localhost:5000/order", {
        method: "POST",
        body: JSON.stringify({
          amount: amount * 100,
          currency: currency,
          receipt: recieptId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const order = await response.json();

      // Step 2: Configure Razorpay payment options
      const options = {
        key: "rzp_test_rZy8sy8h3lgvoA", // Enter the Key ID generated from the Dashboard
        amount: amount * 100, // Amount in currency subunits
        currency,
        name: "Acme Corp",
        description: "Test Transaction",
        image: "https://example.com/your_logo",
        order_id: order.id, // Order ID from server
        handler: async function (response) {
          try {
            const body = { ...response };
            
            // Step 3: Validate payment on your server
            const validateRes = await fetch("http://localhost:5000/order/validate", {
              method: "POST",
              body: JSON.stringify(body),
              headers: {
                "Content-Type": "application/json",
              },
            });
            const validate = await validateRes.json();

            if (validate.msg === "Payment Successful") {
              // Step 4: Store booking data in Firebase
              await saveBookingToFirestore();
              alert("Payment successful! Booking confirmed.");
              navigate("/history", { state: { newBooking } });
            } else {
              alert("Payment validation failed. Please try again.");
            }
          } catch (error) {
            console.error("Error validating payment: ", error);
            alert("An error occurred while validating the payment.");
          }
        },
        prefill: {
          name: userDetails.name,
          email: userDetails.email,
          contact: userDetails.phone,
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };

      var rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", function (response) {
        console.error("Payment failed:", response);
        alert("Payment failed. Please try again.");
      });
      rzp1.open();
    } catch (error) {
      console.error("Error initiating payment: ", error);
      alert("An error occurred while processing the payment.");
    }
  };

  const saveBookingToFirestore = async () => {
    const bookingId = Math.floor(1000000000 + Math.random() * 9000000000).toString(); // Generate unique booking ID
    try {
      setNewBooking({ ...bookingData, totalPrice: amount });

      // Reference to the user's document
      const userRef = doc(db, 'users', userDetails.email);

      // Reference to the bookings sub-collection under the user's document
      const bookingRef = doc(userRef, 'bookings', bookingId);

      // Save booking details
      await setDoc(bookingRef, {
        userDetails: {
          name: userDetails.name,
          email: userDetails.email,
          phone: userDetails.phone,
          date: userDetails.date,
          nationality: bookingData.nationality,
        },
        ticketType,
        selectedTiming,
        totalPrice: amount,
        bookingId,
      });

      // Reference to the tickets sub-collection under this booking
      const ticketsRef = collection(bookingRef, 'tickets');
      for (const ticket of ticketDetails) {
        const ticketId = generateTicketId(); // Generate a 10-digit random ticketId
        const price = ticketPrice || 0;
        const adjustedPrice = bookingData.nationality === 'Indian' ? price : price * 10;

        // Save ticket details
        await setDoc(doc(ticketsRef, ticketId), {
          type: ticket.type,
          name: ticket.name,
          age: ticket.age,
          price: adjustedPrice,
          timing: ticket.timing || selectedTiming,
          details: ticketTypeDescriptions[ticketType],
          date: userDetails.date,
          specialRequirements: ticket.specialRequirements || "",
          ticketId,
          userId: userDetails.email,
          bookingId,
        });
      }

      alert("Booking stored in Firebase successfully.");
    } catch (error) {
      console.error("Error storing booking in Firebase: ", error);
      alert("An error occurred while storing the booking.");
    }
  };

  const generateTicketId = () => Math.floor(1000000000 + Math.random() * 9000000000).toString(); // Generate a 10-digit random ticketId

  return (
    <div className="main-portal">
    <div className="payment-portal">
      <h2>Payment Portal</h2>

      <div>
        <label>Total Amount: </label>
        <div className="amount">
          {currency} {amount}
        </div>
      </div>

      <div>
        <label>Currency: </label>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          style={{ padding: "8px" }}
        >
          {supportedCurrencies.map((cur) => (
            <option key={cur} value={cur}>
              {cur}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handlePayment}
        style={{
          padding: "10px 20px",
          marginTop: "20px",
          backgroundColor: "#3399cc",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        Pay Now
      </button>
    </div>
    </div>
  );
};

export default Payment;
