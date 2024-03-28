import { useEffect, useState } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { auth } from "./firebase";
import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import AddPhotoPage from "./routes/add";
import AlbumPage from "./routes/albums-album";
import HomePage from "./routes/home";
import LoginPage from "./routes/login";
import NewAlbumPage from "./routes/albums-new";
import PhotoPage from "./routes/albums-photo";
import ProfilePage from "./routes/profile";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

const GlobalStyles = createGlobalStyle`${reset}`;
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
      { path: "albums/new", element: <NewAlbumPage /> },
      { path: "albums/:albumId", element: <AlbumPage /> },
      { path: "albums/:albumId/add", element: <AddPhotoPage /> },
      { path: "albums/:albumId/:photoId", element: <PhotoPage /> },
      { path: "profile", element: <ProfilePage /> },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
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
