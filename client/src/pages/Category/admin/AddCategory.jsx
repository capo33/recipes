import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

 import RecipeButton from "../../../components/RecipeForm/RecipeButton";
import UploadPicture from "../../../components/RecipeForm/UploadPicture";
 import { createCategory } from "../../../redux/feature/Category/categorySlice";
 
const AddCategory = () => {
  const [categoryData, setCategoryData] = useState({
    name: "",
    image: "",
  });

  const [uploading, setUploading] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const token = user?.token;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      createCategory({
        categoryData,
        token,
        toast,
        navigate,
      })
    );

    setCategoryData({
      name: "",
      image: "",
    });
  };

  // Upload image handler
  const handleUpload = async (e) => {
    const file = e?.target?.files[0];
    const formData = new FormData();
    formData.append("image", file );
    setUploading(true);
    try {
      const response = await axios.post("/api/v1/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);

      setCategoryData({
        ...categoryData,
        image: response.data.image,
      });
      setUploading(false);
    } catch (error) {
      console.log(error);
      setUploading(false);
    }
  };

  return (
    <>
      <div className='p-5 mt-10 max-w-md'>
        <div className='p-8 rounded border border-gray-200'>
          <h1 className='font-medium text-3xl'>Add Category</h1>
          <form onSubmit={handleSubmit}>
            <div className='mt-8 grid gap-4'>
              <div>
                <label
                  htmlFor='name'
                  className='text-sm text-gray-700 block mb-1 font-medium'
                >
                  Name
                </label>
                <input
                  type='text'
                  name='name'
                  value={categoryData.name}
                  id='name'
                  onChange={(e) =>
                    setCategoryData({ ...categoryData, name: e.target.value })
                  }
                  className='bg-gray-100 border border-gray-200 rounded py-1 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full'
                  placeholder='e.g. Sports'
                />
              </div>
            </div>
            <div className='mt-8'>
              <img src={categoryData?.image} alt={categoryData?.name} />
              <UploadPicture
                handleUpload={handleUpload}
                uploading={uploading}
              />
            </div>
            {uploading && <p>Uploading image...</p>}

            <div className=' mt-8'>
              <RecipeButton title='Add' />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddCategory;
