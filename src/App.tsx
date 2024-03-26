import { useEffect, useState } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { auth } from "./firebase";
import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./routes/Home";
import Login from "./routes/Login";
import NewAlbum from "./routes/NewAlbum";

const GlobalStyles = createGlobalStyle`${reset};
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
  }
`;

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { path: "", element: <Home /> },
      { path: "new", element: <NewAlbum /> },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const init = async () => {
    await auth.authStateReady();
    setIsLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <GlobalStyles />
      {isLoading ? <div></div> : <RouterProvider router={router} />}
    </>
  );
}
