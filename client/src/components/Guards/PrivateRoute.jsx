import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Guerd = () => {
  const { user } = useSelector((state) => state.auth);
  return user ? <Outlet /> : <Navigate to='/login' replace />; // replace: replace any path history with the new path
};

export default Guerd;
