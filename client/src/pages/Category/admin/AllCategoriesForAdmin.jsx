import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import {
  deleteCategory,
  getAllCategories,
} from "../../../redux/feature/Category/categorySlice";
import BackLink from "../../../components/BackLink/BackLink";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

const AllCategoriesForAdmin = () => {
  const { categories, isLoading } = useSelector((state) => state.category);
  const { user } = useSelector((state) => state.auth);

  const token = user?.token;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  // Capitalize
  const capitalize = (str) => {
    return str.charAt(0)?.toUpperCase() + str.slice(1);
  };

  // Delete Category
  const handleDeleteCategory = (id) => {
    dispatch(
      deleteCategory({
        id,
        token,
        toast,
      })
    );
  };

  return (
    <div className='container px-5 py-10 mx-auto'>
      <BackLink link='/' name='Home' />
      <div className='bg-white rounded-lg shadow-lg p-4'>
        <div className='flex flex-col justify-around'>
          <div className='flex flex-wrap col justify-around'>
            <span className='text-lg '>Categories </span>
            {isLoading && <div>Loading...</div>}
          </div>
          <hr className='my-4' />
          <table className='text-center'>
            <thead>
              <tr>
                <th className='px-4 py-2'>category</th>
                <th className='px-4 py-2'>Edit</th>
                <th className='px-4 py-2'>Delete</th>
              </tr>
            </thead>
            <tbody>
              {categories?.map((category) => (
                <tr key={category._id}>
                  <td className='border px-4 py-2'>
                    {capitalize(category.name)}
                  </td>
                  <td className='border px-4 py-2'>
                    <Link
                      to={`/admin/edit-category/${category.slug}`}
                      className='text-center inline-flex  justify-center text-blue-700 hover:text-blue-900 focus:outline-none'
                    >
                      <PencilSquareIcon className='h-5 w-5 mr-1' />
                      <span className='text-sm'>Edit</span>
                    </Link>
                  </td>
                  <td className='border px-4 py-2'>
                    <button
                      className='text-center inline-flex  justify-center text-red-700 hover:text-red-900 focus:outline-none'
                      onClick={() => handleDeleteCategory(category._id)}
                    >
                      <TrashIcon className='h-5 w-5 mr-1' />
                      <span className='text-sm'>Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllCategoriesForAdmin;
