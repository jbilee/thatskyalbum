import { useEffect, useState } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { auth } from "./firebase";
import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import AddPhotoPage from "./routes/add-photo";
import AlbumDetailsPage from "./routes/album-details";
import CreateAlbumPage from "./routes/create-album";
import HomePage from "./routes/home";
import LoginPage from "./routes/login";
import PhotoDetailsPage from "./routes/photo-details";
import ProfilePage from "./routes/profile";
import RegistrationPage from "./routes/register";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

const GlobalStyles = createGlobalStyle`${reset}
*, html {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}`;
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { path: "", element: <HomePage /> },
      { path: "albums/new", element: <CreateAlbumPage /> },
      { path: "albums/:albumId", element: <AlbumDetailsPage /> },
      { path: "albums/:albumId/add", element: <AddPhotoPage /> },
      { path: "albums/:albumId/:photoId", element: <PhotoDetailsPage /> },
      { path: "profile", element: <ProfilePage /> },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegistrationPage />,
  },
]);

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await auth.authStateReady();
      setIsLoading(false);
    };
    init();
  }, []);

  return (
    <>
      <GlobalStyles />
      {isLoading ? <div></div> : <RouterProvider router={router} />}
    </>
  );
}
