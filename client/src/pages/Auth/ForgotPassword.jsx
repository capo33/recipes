import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

 import { forgotPassword } from "../../redux/feature/Auth/authSlice";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
    answer: "",
    newPassword: "",
  });

  const [passwordShown, setPasswordShown] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Show password toggle
  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  const resetForm = () => {
    setFormData({
      email: "",
      answer: "",
      newPassword: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(forgotPassword({ formData, toast, navigate }));
    resetForm();
  };

  return (
    <div className='container max-w-full mx-auto py-24 px-6'>
      <div className='font-sans'>
        <div className='max-w-sm mx-auto px-6'>
          <div className='relative flex flex-wrap'>
            <div className='w-full relative'>
              <form className='bg-white' onSubmit={handleSubmit}>
                <h1 className='text-gray-800 font-bold text-2xl mb-1'>
                  No Worries! We got you!
                </h1>
                <p className='text-sm font-normal text-gray-600 mb-7'>
                  Do you remember your security answer? 😉
                </p>
                <div className='mx-auto max-w-lg'>
                  <div className='py-2'>
                    <span className='px-1 text-sm text-gray-600'>Email</span>
                    <input
                      type='email'
                      name='email'
                      value={formData.email}
                      onChange={handleChange}
                      placeholder=' Enter your email'
                      className='text-md block px-3 py-2 rounded-lg w-full bg-white border-2 border-gray-300 placeholder-gray-600 shadow-md focus:placeholder-gray-500 focus:bg-white focus:border-gray-600 focus:outline-none'
                    />
                  </div>
                  <div className='py-2'>
                    <span className='px-1 text-sm text-gray-600'>Answer</span>
                    <input
                      type='text'
                      name='answer'
                      value={formData.answer}
                      onChange={handleChange}
                      placeholder='Enter your security answer'
                      className='text-md block px-3 py-2 rounded-lg w-full bg-white border-2 border-gray-300 placeholder-gray-600 shadow-md focus:placeholder-gray-500 focus:bg-white focus:border-gray-600 focus:outline-none'
                    />
                  </div>

                  <div className='py-2'>
                    <span className='px-1 text-sm text-gray-600'>
                      New Password
                    </span>
                    <div className='relative'>
                      <input
                        type={passwordShown ? "text" : "password"}
                        name='newPassword'
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder='Enter your new password'
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
                  <p className='mt-3 font-light text-gray-500 dark:text-gray-400'>
                    Remember your password?{" "}
                    <Link
                      to='/login'
                      className='font-medium text-gray-800 dark:text-gray-200 hover:underline'
                    >
                      Login
                    </Link>
                  </p>
                  <button
                    className='mt-3 text-lg font-semibold bg-gray-800 w-full text-white rounded-lg px-6 py-3 block shadow-xl hover:text-white hover:bg-black'
                    type='submit'
                  >
                    Reset Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
