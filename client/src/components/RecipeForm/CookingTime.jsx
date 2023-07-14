import React from "react";

const CookingTime = ({ recipe, handleChange }) => {
  return (
    <div className='mt-1'>
      <label className='text-lg leading-6 font-medium text-gray-900'>
        Cooking Time
      </label>
      <input
        type='number'
        name='cookingTime'
        value={recipe.cookingTime ? recipe.cookingTime : ""}
        onChange={handleChange}
        id='cookingTime'
        className='shadow-sm p-2 focus:outline-none focus:ring-teal-500 focus:border-teal-500 mt-1 block  border border-gray-300 rounded-md'
        placeholder='Enter cooking time'
      />
    </div>
  );
};

export default CookingTime;
