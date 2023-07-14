import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BsEyeSlashFill, BsEyeFill } from "react-icons/bs";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import { login } from "../../redux/feature/Auth/authSlice";
 
const Login = () => {
  const { isLoading, user } = useSelector((state) => state.auth);

  const [passwordShown, setPasswordShown] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Show password toggle
  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const token = user?.token;

  const redirect = location.search ? location.search.split("=")[1] : "/";

  // Redirect user to home page if user is already logged in
  useEffect(() => {
    if (token) {
      navigate(redirect);
    } else {
      navigate("/login");
    }
  }, [token, navigate, redirect]);

  // Change input value
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(login({ formData, toast, navigate }));
  };

  return (
    <>
      {isLoading && <p> Loading...</p>}
      <div className='container max-w-full mx-auto py-24 px-6'>
        <div className='font-sans'>
          <div className='max-w-sm mx-auto px-6'>
            <div className='relative flex flex-wrap'>
              <div className='w-full relative'>
                <form className='' onSubmit={handleSubmit}>
                  <h1 className='text-gray-800 font-bold text-2xl mb-1'>
                    Hello there,
                  </h1>
                  <p className='text-sm font-normal text-gray-600 mb-7'>
                    Welcome & Login to your account.
                  </p>
                  <div className='mx-auto max-w-lg'>
                    <div className='py-2'>
                      <span className='px-1 text-sm text-gray-600'>Email</span>
                      <input
                        type='text'
                        name='email'
                        placeholder=' Enter your email'
                        onChange={handleChange}
                        value={formData.email}
                        className='text-md block px-3 py-2 rounded-lg w-full bg-white border-2 border-gray-300 placeholder-gray-600 shadow-md focus:placeholder-gray-500 focus:bg-white focus:border-gray-600 focus:outline-none'
                      />
                    </div>
                    <div className='py-2'>
                      <span className='px-1 text-sm text-gray-600'>
                        Password
                      </span>
                      <div className='relative'>
                        <input
                          type={passwordShown ? "text" : "password"}
                          name='password'
                          placeholder=' Enter your password'
                          onChange={handleChange}
                          value={formData.password}
                          className='text-md block px-3 py-2 rounded-lg w-full bg-white border-2 border-gray-300 placeholder-gray-600 shadow-md focus:placeholder-gray-500 focus:bg-white focus:border-gray-600 focus:outline-none'
                        />
                        <div className='absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5'>
                          <span
                            onClick={togglePasswordVisiblity}
                            className='cursor-pointer'
                          >
                            {passwordShown ? <BsEyeFill /> : <BsEyeSlashFill />}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className='flex items-center justify-between'>
                      <Link
                        to='/forgot-password'
                        className='text-sm font-medium text-primary-600 border-b-2 border-gray-200 hover:border-gray-400'
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <button className='mt-3 text-lg font-semibold bg-gray-800 w-full text-white rounded-lg px-6 py-3 block shadow-xl hover:text-white hover:bg-black'>
                      Login
                    </button>
                  </div>
                  <p className='mt-3 font-light text-gray-500 dark:text-gray-400'>
                    Don't have an account?{" "}
                    <Link
                      to='/register'
                      className='text-sm font-medium text-primary-600 border-b-2 border-gray-200 hover:border-gray-400'
                    >
                      Register
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
