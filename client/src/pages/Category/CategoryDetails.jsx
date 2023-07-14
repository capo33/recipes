import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import BackLink from "../../components/BackLink/BackLink";
import { getCategoryBySlug } from "../../redux/feature/Category/categorySlice";

const CategoryDetails = () => {
  const { slug } = useParams();

  const { category } = useSelector((state) => state.category);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCategoryBySlug(slug));
  }, [dispatch, slug]);

  return (
    <section className='bg-white container px-6 py-10 mx-auto'>
      <h2 className='text-center m-5 text-3xl font-semibold text-gray-800 capitalize lg:text-4xl dark:text-white'>
        {category?.name}
      </h2>
      <BackLink link='/categories' name='Back to categories' />
      <div className='flex justify-center mt-10'>
        <img
          className='object-cover max-w-screen-lg w-full h-56 rounded-lg'
          src={category?.image}
          alt={category?.name}
        />
      </div>
      <div className='grid grid-cols-1 gap-6 mt-16 md:grid-cols-2'>
        {category?.recipes?.length === 0 && (
          <div className='text-center'>
            <h2 className='text-2xl font-semibold text-gray-800 capitalize dark:text-white'>
              No recipes found
            </h2>
          </div>
        )}
        {category?.recipes?.map((recipe) => (
          <div
            className='max-w-xs p-6 rounded-md shadow-md dark:bg-gray-900 dark:text-gray-50'
            key={recipe?._id}
          >
            <Link to={`/recipe-details/${recipe?._id}`}>
              <img
                src={recipe?.image}
                alt={recipe?.name}
                loading="lazy"
                className='object-cover w-full h-56 rounded-md dark:bg-gray-500'
              />
              <div className='px-6 py-4'>
                <h2 className='text-xl font-semibold tracki'>{recipe?.name}</h2>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryDetails;
