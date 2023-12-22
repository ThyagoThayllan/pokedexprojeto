import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { SignIn } from "../Screens/SignIn";
import { SignUp } from "../Screens/SignUp";
import { App } from "../App";

export type UsersTypes = {
  username: string;
  password: string;
};

export const Routes = () => {
  const [users, setUsers] = useState<UsersTypes[]>([]);
  const [user, setUser] = useState<UsersTypes>({} as UsersTypes);

  const getUsers = async () => {
    try {
      await axios
        .get("http://localhost:3000/users")
        .then((response) => setUsers([...response.data]));
    } catch (error) {
      console.log(error);
    }
  };

  const changeUser = (newUser: UsersTypes) => {
    setUser(newUser);
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <SignIn users={users} getUsers={getUsers} changeUser={changeUser} />
      ),
    },
    {
      path: "/signup",
      element: (
        <SignUp users={users} getUsers={getUsers} changeUser={changeUser} />
      ),
    },
    {
      path: "/pokedex",
      element: <App user={user} changeUser={changeUser} />,
    },
  ]);

  return (
      <RouterProvider router={router} />
  );
};
