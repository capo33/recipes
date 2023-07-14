import React from "react";
 
const Instructions = ({ recipe, handleChange }) => {
  return (
    <div>
      <label htmlFor='instructions' className='text-lg leading-6 font-medium '>
        Instructions
      </label>

      <div className='mt-1'>
        <textarea
          name='instructions'
          value={recipe.instructions ? recipe.instructions : ""}
          onChange={handleChange}
          id='desc'
          rows={3}
          className='shadow-sm p-2 focus:outline-none focus:ring-teal-500 focus:border-teal-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md'
          placeholder='Write a short instructions'
        />
      </div>
    </div>
  );
};

export default Instructions;
