import {createContext, useState} from 'react';

export const ChatbotContext = createContext();

export const ChatbotProvider = ({children}) => {
    const [isChatbotOpen, setChatbotOpen] = useState(false);
    return(
    <ChatbotContext.Provider  value={{isChatbotOpen, setChatbotOpen}}>
        {children}
        </ChatbotContext.Provider>);
}

