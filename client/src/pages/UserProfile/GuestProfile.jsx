import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getUserById } from "../../redux/feature/Auth/authSlice";
import BackLink from "../../components/BackLink/BackLink";
import { formatDate } from "../../utils";

export const GuestProfile = () => {
  const { guestID } = useParams();
  const dispatch = useDispatch();
  const { guest } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getUserById(guestID));
  }, [dispatch, guestID]);

  return (
    <>
      <div className='container mx-auto my-5 p-5'>
        <BackLink link='/' name='Home' />

        <div className='md:flex no-wrap md:-mx-2 '>
          <div className='w-full md:w-3/12 md:mx-2'>
            <div className='bg-white p-3 border-t-4 border-green-600'>
              <img
                alt={guest?.user?.name}
                src={guest?.user?.image}
                className='shadow-xl rounded-full h-auto align-middle border-none max-w-40-px'
              />

              <h1 className='text-gray-900 font-bold text-xl leading-8 my-1'>
                {guest?.recipes && guest?.recipes?.length > 5 ? (
                  <span className='text-green-500'> (expert)</span>
                ) : guest?.recipes && guest?.recipes?.length > 0 ? (
                  <span className='text-blue-500'> (author)</span>
                ) : (
                  <span className='text-gray-500'> (newbie)</span>
                )}
              </h1>
              <h3 className='text-gray-600 font-lg text-semibold leading-6'>
                Role
                {guest?.user?.role === "admin" ? (
                  <span className='text-red-500'> (admin)</span>
                ) : (
                  <span className='text-blue-500'> (user)</span>
                )}
              </h3>

              <ul className='bg-gray-100 text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 mt-3 divide-y rounded shadow-sm'>
                <li className='flex items-center py-3'>
                  <span>Status</span>
                  {guest?.recipes && guest?.recipes?.length > 0 ? (
                    <span className='ml-auto'>
                      <span className='bg-green-600 py-1 px-2 rounded text-white text-sm'>
                        Active
                      </span>
                    </span>
                  ) : (
                    <span className='ml-auto'>
                      <span className='bg-red-600 py-1 px-2 rounded text-white text-sm'>
                        Inactive
                      </span>
                    </span>
                  )}
                </li>
                <li className='flex items-center py-3'>
                  <span>Member since:</span>
                  <span className='ml-auto'>
                    {formatDate(guest?.user?.createdAt)}
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className='w-full  md:w-9/12 mx-2 h-full'>
            <div className='bg-white p-3 shadow-sm rounded-sm'>
              <div className='flex items-center space-x-2 font-semibold text-gray-900 leading-8'>
                <span className='text-green-500'>
                  {/* <UserIcon className='h-4 w-4' /> */}
                </span>
                <span className='tracking-wide'>About</span>
              </div>
              <div className='text-gray-700'>
                <div className='grid md:grid-cols-2 text-sm'>
                  <div className='grid grid-cols-2'>
                    <div className='px-4 py-2 font-semibold'>Name</div>
                    <div className='px-4 py-2'>{guest?.user?.name}</div>
                  </div>

                  <div className='grid grid-cols-2'>
                    <div className='px-4 py-2 font-semibold'>Address</div>
                    <div className='px-4 py-2'>
                      {guest?.user?.address
                        ? guest?.user?.address
                        : "Not Available Yet"}
                    </div>
                  </div>

                  <div className='grid grid-cols-2'>
                    <div className='px-4 py-2 font-semibold'>Phone</div>
                    <div className='px-4 py-2'>
                      {guest?.user?.phone
                        ? guest?.user?.phone
                        : "Not Available Yet"}
                    </div>
                  </div>

                  <div className='grid grid-cols-2'>
                    <div className='px-4 py-2 font-semibold'>Birthday</div>
                    <div className='px-4 py-2'>
                      {guest?.user?.birthday?.toString().slice(0, 10)}
                    </div>
                  </div>

                  <div className='grid grid-cols-2'>
                    <div className='px-4 py-2 font-semibold'>Email</div>
                    <div className='px-4 py-2'>
                      {guest?.user?.email
                        ? guest?.user?.email
                        : "Not Available Yet"}
                    </div>
                  </div>
                  <div className='grid grid-cols-2'>
                    <div className='px-4 py-2 font-semibold'>
                      Written recipes
                    </div>
                    <div className='px-4 py-2'>
                      {guest?.recipes && guest?.recipes?.length > 0
                        ? guest?.recipes?.length + guest?.recipes?.length > 2
                          ? guest?.recipes?.length + " recipes"
                          : guest?.recipes?.length + " recipe"
                        : "Not Available Yet"}
                    </div>
                  </div>
                  <div className='grid grid-cols-2'>
                    <div className='px-4 py-2 font-semibold'>Interests</div>
                    <div className='px-4 py-2'>
                      {guest?.user?.interests &&
                      guest?.user?.interests?.length > 0
                        ? guest?.user?.interests?.map((interest, index) => (
                            <span key={index}>{interest}</span>
                          ))
                        : "Not Available Yet"}
                    </div>
                  </div>
                  <div className='grid grid-cols'>
                    <div className='px-4 py-2 font-bold'>Bio</div>
                    <div className='px-4 py-2'>
                      {guest?.user?.about
                        ? guest?.user?.about
                        : "Update your bio to tell more about yourself."}
                    </div>
                  </div>
                </div>

                <div className='  p-3 hover:shadow'>
                  <div className='flex items-center space-x-3 font-semibold text-gray-900 text-xl leading-8'>
                    <span className='text-green-500'>
                      <svg
                        className='h-5 fill-current'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                        />
                      </svg>
                    </span>
                    <span>Own Recipe</span>
                  </div>
                  <div className='flex flex-wrap gap-10'>
                    {guest?.recipes && guest?.recipes?.length > 0
                      ? guest?.recipes?.map((recipe, index) => (
                          <div className='text-center my-2' key={index}>
                            {recipe.name}
                            <img
                              className='h-16 w-16 rounded-full mx-auto'
                              src={recipe?.image}
                              alt='recipe'
                            />
                          </div>
                        ))
                      : "Not Available Yet"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
