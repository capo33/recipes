import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {  logoutUser } from "../features/auth/authSlice";

const NavBar = () => {
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const Navigate = useNavigate();

  const logout = () => {
    dispatch(logoutUser());
    Navigate("/login");
  };

  return (
    <div className='navbar'>
      <Link to='/'>Home</Link>
      {user?.token ? (
        <>
          <Link to='/create-recipe'>Create-recipe</Link>
          <Link to='/saved-recipes'>Saved-recipes</Link>

          <Link to='/login' onClick={logout}>
            Logout
          </Link>
        </>
      ) : (
        <>
          <Link to='/login'>Login</Link>
          <Link to='/register'>Register</Link>
        </>
      )}
    </div>
  );
};

export default NavBar;
