import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import {
  updateUserProfile,
  userProfile,
} from "../../redux/feature/Auth/authSlice";
import Input from "../../components/ProfileForm/Input";
import BackLink from "../../components/BackLink/BackLink";
import Textarea from "../../components/ProfileForm/Textarea";
import RecipeButton from "../../components/RecipeForm/RecipeButton";
import UploadPicture from "../../components/RecipeForm/UploadPicture";

const UpdateProfile = () => {
  const { user } = useSelector((state) => state.auth);

  const formData = {
    name: user?.name,
    email: user?.email,
    address: user?.address,
    phone: user?.phone,
    about: user?.about,
    birthday: user?.birthday,
    image: user?.image,
    interests: user?.interests,
  };

  const [userData, setUserData] = useState(formData);
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = user?.token;

  // Handle change for all input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (token) {
      dispatch(userProfile(token));
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (user) {
      setUserData(user);
    }
  }, [user]);

  // Upload image handler
  const handleUpload = async (e) => {
    const file = e?.target?.files[0];
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);
    try {
      const response = await axios.post("/api/v1/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setUserData((prevUser) => ({
        ...prevUser,
        image: response.data.image,
      }));
      setUploading(false);
    } catch (error) {
      toast.error(error.response.data.message);

      console.error(error);
      setUploading(false);
    }
  };

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      updateUserProfile({
        userData: userData,
        token,
        toast,
        navigate,
      })
    );
    navigate("/profile");
  };

  return (
    <section className='p-6 dark:bg-gray-800 dark:text-gray-50 mt-5 '>
      <BackLink link='/profile' name='back to prfoile' />
      <form
        className='container flex flex-col mx-auto space-y-12'
        onSubmit={handleSubmit}
      >
        <fieldset className='grid grid-cols-4 gap-6 p-6 rounded-md shadow-sm dark:bg-gray-900'>
          <div className='space-y-2 col-span-full lg:col-span-1'>
            <p className='font-medium'>Personal Inormation</p>
            <p className='text-xs'>
              Add your personal information to complete your profile
            </p>
          </div>
          <div className='grid grid-cols-6 gap-4 col-span-full lg:col-span-3'>
            <div className='col-span-full sm:col-span-3'>
              <Input
                label='Name'
                type='text'
                name='name'
                value={userData?.name || ""}
                handleChange={handleChange}
                placeholder='Name'
              />
            </div>
            <div className='col-span-full sm:col-span-3'>
              <Input
                label='Address'
                type='text'
                name='address'
                value={userData?.address || ""}
                handleChange={handleChange}
                placeholder='Address'
              />
            </div>
            <div className='col-span-full sm:col-span-3'>
              <Input
                label='Email'
                type='email'
                name='email'
                value={userData?.email || ""}
                handleChange={handleChange}
                placeholder='Email'
              />
            </div>
            <div className='col-span-full sm:col-span-3'>
              <Input
                label='Phone'
                type='tel'
                name='phone'
                value={userData?.phone || ""}
                handleChange={handleChange}
                placeholder='Phone'
              />
            </div>
            <div className='col-span-full sm:col-span-2'>
              <Input
                label='Birthday'
                type='date'
                name='birthday'
                value={userData?.birthday?.toString().slice(0, 10) || ""}
                handleChange={handleChange}
                placeholder='Birthday'
              />
            </div>
          </div>
        </fieldset>
        <fieldset className='grid grid-cols-4 gap-6 p-6 rounded-md shadow-sm dark:bg-gray-900'>
          <div className='space-y-2 col-span-full lg:col-span-1'>
            <p className='font-medium'>Profile</p>
            <p className='text-xs'>
              Here you can add your profile picture and write a little about you
            </p>
          </div>
          <div className='grid grid-cols-6 gap-4 col-span-full lg:col-span-3'>
            <div className='col-span-full'>
              <Input
                label='Interests'
                type='text'
                name='interests'
                value={userData?.interests || ""}
                handleChange={handleChange}
                placeholder='Interests'
              />
            </div>

            <div className='col-span-full'>
              <Textarea
                label='About Me'
                name='about'
                value={userData?.about || ""}
                handleChange={handleChange}
                placeholder='About Me'
              />
            </div>

            <div className='col-span-full'>
              <label htmlFor='bio' className='text-sm'>
                Photo
              </label>
              <div className='flex justify-around flex-wrap'>
                <img
                  src={userData?.image}
                  alt=''
                  className='w-20 h-20 flex justify-center'
                />
                <UploadPicture
                  handleUpload={handleUpload}
                  uploading={uploading}
                />
              </div>
              <RecipeButton title='Update' />
            </div>
          </div>
        </fieldset>
      </form>
    </section>
  );
};

export default UpdateProfile;
