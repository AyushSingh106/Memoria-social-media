import React, { useState } from "react";
import UserContext from "./UserContext";

const UserContextProvider = ({ children }) => {
    const [User, setUser] = useState(null);
    const [Clicks, setClicks] = useState(null);
    const [count,setCount] = useState(0);
    
    return (
        <UserContext.Provider value={{ User, setUser, Clicks, setClicks,count,setCount }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContextProvider;
