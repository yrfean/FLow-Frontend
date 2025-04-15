import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TokenCheck = ({ children }: any) => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) navigate("/login");
  });

  return children;
};

export default TokenCheck;
