import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = () => {
  const { user } = useSelector((state) => state.auth);

  return user?.role ? <Outlet /> : <Navigate to='/' replace />;
};

export default AdminRoute;
