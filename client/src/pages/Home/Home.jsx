import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Landing from "./Landing";
import RecipeCard from "../../components/RecipeCard/RecipeCard";
import { getAllRecipes } from "../../redux/feature/Recipe/recipeSlice";

const Home = () => {
  const { recipes } = useSelector((state) => state.recipe);
  console.log(recipes);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllRecipes());
  }, [dispatch]);

  return (
    <>
      <section className='bg-white dark:bg-gray-900 mb-5'>
        <Landing />
        <div className='grid grid-cols-1 gap-8 mt-8 md:mt-16 md:grid-cols-2 xl:grid-cols-3 '>
          {recipes && recipes?.length === 0 && (
            <div className='flex justify-center items-center'>
              <h1 className='text-2xl text-gray-500'>No recipes found</h1>
            </div>
          )}

          {recipes &&
            recipes?.length > 0 &&
            recipes?.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
        </div>
      </section>
    </>
  );
};

export default Home;
