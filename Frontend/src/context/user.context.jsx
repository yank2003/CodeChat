import { createContext, useState } from "react";
import PropTypes from "prop-types";

// Creating user context
export const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Define prop types for UserProvider
UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
