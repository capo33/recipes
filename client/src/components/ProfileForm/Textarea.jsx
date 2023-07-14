import React from "react";

const Textarea = ({ label, value, name, handleChange, placeholder }) => {
  return (
    <div>
      <label htmlFor='firstname' className='text-sm'>
        {label}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className='shadow-sm p-2 focus:outline-none focus:ring-teal-500 focus:border-teal-500 mt-1 block w-full border border-gray-300 rounded-md'
      ></textarea>
    </div>
  );
};

export default Textarea;
