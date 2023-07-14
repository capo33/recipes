import React, { useEffect } from "react";

import { getAllCategories } from "../../redux/feature/Category/categorySlice";
import { useDispatch, useSelector } from "react-redux";

const Category = ({ recipe, handleChange }) => {
  const { categories } = useSelector((state) => state.category);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  return (
    <div className='mt-1'>
      <label className='text-lg leading-6 font-medium text-gray-900'>
        Category
      </label>
      <select
        id='category'
        name='category'
        value={recipe?.category?._id ? recipe.category._id : ""}
        onChange={handleChange}
        className='shadow-sm p-2 focus:outline-none focus:ring-teal-500 focus:border-teal-500 mt-1 block  border border-gray-300 rounded-md'
      >
        <option value=''>Select a category</option>
        {categories.map((category) => (
          <option key={category?._id} value={category?._id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Category;
