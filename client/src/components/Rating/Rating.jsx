import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

export const Rating = ({ value, text, color }) => {
  return (
    <div className='rating'>
      <span>
        {value >= 1 ? (
          <FaStar color={color} />
        ) : value >= 0.5 ? (
          <FaStarHalfAlt color={color} />
        ) : (
          <FaRegStar color={color} />
        )}
        {value >= 2 ? (
          <FaStar color={color} />
        ) : value >= 1.5 ? (
          <FaStarHalfAlt color={color} />
        ) : (
          <FaRegStar color={color} />
        )}
        {value >= 3 ? (
          <FaStar color={color} />
        ) : value >= 2.5 ? (
          <FaStarHalfAlt color={color} />
        ) : (
          <FaRegStar color={color} />
        )}
        {value >= 4 ? (
          <FaStar color={color} />
        ) : value >= 3.5 ? (
          <FaStarHalfAlt color={color} />
        ) : (
          <FaRegStar color={color} />
        )}
        {value >= 5 ? (
          <FaStar color={color} />
        ) : value >= 4.5 ? (
          <FaStarHalfAlt color={color} />
        ) : (
          <FaRegStar color={color} />
        )}
        <span className='rating-text'>
          <strong>{text && text}</strong>
        </span>
      </span>
    </div>
  );
};
