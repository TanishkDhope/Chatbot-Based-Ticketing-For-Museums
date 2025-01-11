import { createContext,useState } from 'react';

export const MicContext = createContext();

export const MicProvider = ({ children }) => {        
    const [isMicrophoneActive, setIsMicrophoneActive] = useState(false);

    return (
        <MicContext.Provider value={{ isMicrophoneActive, setIsMicrophoneActive }}>
            {children}
        </MicContext.Provider>
    );
};