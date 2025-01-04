import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/user.context";
import { useContext, useEffect, useState } from "react";
const Userauth = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [loading, setloading] = useState(true);
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (user) {
      return setloading(false);
    }
    if (!token) {
      navigate("/login");
    }
    if (!user) {
      navigate("/login");
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  return <>{children}</>;
};

export default Userauth;
