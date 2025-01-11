import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { InputProvider } from './Context/InputContext.jsx'
import { MicProvider } from './Context/MicContext.jsx'
import { UserProvider } from './Context/UserContext.jsx'
import { BookingProvider } from './Context/BookingContext.jsx'
import { ChatbotProvider } from './Context/ChatbotContext.jsx'

createRoot(document.getElementById('root')).render(
    <ChatbotProvider>
    <BookingProvider>
    <UserProvider>
    <MicProvider>
    <InputProvider>
    <BrowserRouter>
    <App />
    </BrowserRouter>
    </InputProvider>
    </MicProvider>
    </UserProvider>
    </BookingProvider>
    </ChatbotProvider>
)