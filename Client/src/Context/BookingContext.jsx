import { createContext, useState } from "react";

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
    const [newBooking, setNewBooking] = useState({});
    
    return (
        <BookingContext.Provider value={{ newBooking, setNewBooking }}>
            {children}
        </BookingContext.Provider>
    );
};
    
    
    