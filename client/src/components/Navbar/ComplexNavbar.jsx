import React, { useEffect } from "react";
import {
  Navbar,
  Collapse,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  IconButton,
} from "@material-tailwind/react";
import {
  PlusIcon,
  UserIcon,
  HomeIcon,
  ChevronDownIcon,
  PowerIcon,
  ArrowRightOnRectangleIcon,
  Bars2Icon,
  BookmarkIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { useNavigate, Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { logout, userProfile } from "../../redux/feature/Auth/authSlice";
import { getSavedRecipes } from "../../redux/feature/Recipe/recipeSlice";

// profile menu component
function ProfileMenu() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const avatar = user?.image;
  const admin = user?.role;
  const token = user?.token;

  useEffect(() => {
    if (token) {
      dispatch(userProfile(token));
    }
  }, [dispatch, token]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const profileMenuItems = [
    {
      label: "My Profile",
      icon: UserIcon,
      link: "/profile",
    },
    {
      label: "Add Recipe",
      icon: PlusIcon,
      link: "/add-recipe",
    },
    ...(admin === "admin"
      ? [
          {
            label: "Add Category",
            icon: PlusIcon,
            link: "/admin/add-category",
          },
          {
            label: "All Categories",
            icon: Squares2X2Icon,
            link: "/admin/allcategories",
          },
        ]
      : []),

    {
      label: "Sign Out",
      icon: PowerIcon,
      link: "/login",
      onClick: handleLogout,
    },
  ];

  const authMenuItems = [
    {
      label: "Login",
      icon: ArrowRightOnRectangleIcon,
      link: "/login",
    },
    {
      label: "Register",
      icon: ArrowRightOnRectangleIcon,
      link: "/register",
    },
  ];

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement='bottom-end'>
      <MenuHandler>
        <Button
          variant='text'
          color='blue-gray'
          className='flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto'
        >
          <Avatar
            variant='circular'
            size='sm'
            alt='candice wu'
            className='p-0.5'
            src={
              avatar
                ? avatar
                : "https://t4.ftcdn.net/jpg/03/32/59/65/240_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg"
            }
          />
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-3 w-3 transition-transform ${
              isMenuOpen ? "rotate-180" : ""
            }`}
          />
        </Button>
      </MenuHandler>
      <MenuList className='p-1'>
        {user
          ? profileMenuItems.map(({ label, link, icon, onClick }, key) => {
              const isLastItem = key === profileMenuItems.length - 1;
              return (
                <Link
                  to={link}
                  key={label}
                  onClick={link === "/login" ? onClick : undefined}
                  className='font-normal'
                  color={isLastItem ? "red" : "inherit"}
                >
                  <MenuItem
                    key={label}
                    onClick={closeMenu}
                    className={`flex items-center gap-2 rounded ${
                      isLastItem
                        ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                        : ""
                    }`}
                  >
                    {React.createElement(icon, {
                      className: `h-4 w-4 ${isLastItem ? "text-red-500" : ""}`,
                      strokeWidth: 2,
                    })}
                    {label}
                  </MenuItem>
                </Link>
              );
            })
          : authMenuItems.map(({ label, link, icon, onClick }, key) => {
              const isLastItem = key === authMenuItems.length - 1;
              return (
                <Link
                  to={link}
                  key={label}
                  onClick={link === "/login" ? onClick : undefined}
                  className='font-normal'
                  color={isLastItem ? "red" : "inherit"}
                >
                  <MenuItem
                    key={label}
                    onClick={closeMenu}
                    className={`flex items-center gap-2 rounded ${
                      isLastItem
                        ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                        : ""
                    }`}
                  >
                    {React.createElement(icon, {
                      className: `h-4 w-4 ${isLastItem ? "text-red-500" : ""}`,
                      strokeWidth: 2,
                    })}
                    {label}
                  </MenuItem>
                </Link>
              );
            })}
      </MenuList>
    </Menu>
  );
}

// nav list menu

function NavList() {
  const { user } = useSelector((state) => state.auth);
  const { savedRecipes } = useSelector((state) => state.recipe);

  const dispatch = useDispatch();

  const token = user?.token;
  const userID = user?._id;

  useEffect(() => {
    if (token) dispatch(getSavedRecipes({ userID, token }));
  }, [dispatch, token, userID]);

  // nav list component
  const navListItems = [
    {
      label: "Recipes",
      icon: HomeIcon,
      link: "/",
    },
    {
      label: "Categories",
      icon: Squares2X2Icon,
      link: "/categories",
    },
    ...(token
      ? [
          {
            label: "Saved Recipes",
            icon: BookmarkIcon,
            badge: true,
            link: "/saved-recipes",
          },
        ]
      : []),
  ];

  return (
    <ul className='mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center'>
      {navListItems.map(({ label, link, icon, badge }, key) => (
        <Link to={link} color='blue-gray' className='font-normal' key={label}>
          <MenuItem className='flex items-center gap-2 lg:rounded-full'>
            {React.createElement(icon, { className: "h-[18px] w-[18px]" })}{" "}
            {label}
            {badge && savedRecipes?.length > 0 && (
              <span className='flex h-2 w-2 items-center justify-center rounded-full bg-green-500 p-3 text-xs text-white'>
                {savedRecipes?.length}
              </span>
            )}
          </MenuItem>
        </Link>
      ))}
    </ul>
  );
}

export default function ComplexNavbar() {
  const [isNavOpen, setIsNavOpen] = React.useState(false);

  const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setIsNavOpen(false)
    );
  }, []);

  return (
    <Navbar className='mx-auto  p-2 lg:rounde lg:pl-6 sticky top-0 z-50'>
      <div className='relative mx-auto flex items-center text-blue-gray-900'>
        <Link to='/' className='mr-4 ml-2 cursor-pointer py-1.5 font-medium'>
          <img
            width='45'
            height='45'
            src='https://img.icons8.com/external-becris-lineal-color-becris/64/external-recipe-kitchen-cooking-becris-lineal-color-becris-1.png'
            alt='external-recipe-kitchen-cooking-becris-lineal-color-becris-1'
          />
        </Link>
        <div className='absolute top-2/3 left-2/4 hidden -translate-x-2/4 -translate-y-2/4 lg:block'>
          <NavList />
        </div>
        <IconButton
          size='sm'
          color='blue-gray'
          variant='text'
          onClick={toggleIsNavOpen}
          className='ml-auto mr-2 lg:hidden'
        >
          <Bars2Icon className='h-6 w-6' />
        </IconButton>
        <ProfileMenu />
      </div>
      <Collapse open={isNavOpen} className='text-blue-gray-800 '>
        <NavList />
      </Collapse>
    </Navbar>
  );
}
