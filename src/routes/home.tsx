import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { collection, getDocs, or, orderBy, query, where } from "firebase/firestore";
import styled from "styled-components";
import AlbumPreview from "../components/AlbumPreview";
import SkeletonAlbumPreview from "../components/skeletons/SkeletonAlbumPreview";
import { auth, db } from "../firebase";

export type AlbumProps = {
  id: string;
  ownerId: string;
  name: string;
  cover?: string;
};

export type OwnerProps = {
  id: string;
  name: string;
};

export default function HomePage() {
  const user = auth.currentUser;
  const [isLoading, setIsLoading] = useState(true);
  const [albums, setAlbums] = useState<AlbumProps[]>([]);
  const [albumOwners, setAlbumOwners] = useState<OwnerProps[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const albumQuery = query(
          collection(db, "albums"),
          or(where("ownerId", "==", user?.uid), where("isPrivate", "==", false)),
          orderBy("timeCreated", "asc")
        );
        const albumSnapshot = await getDocs(albumQuery);
        const albums = albumSnapshot.docs.map((doc) => {
          const { ownerId, name, cover } = doc.data();
          return { ownerId, name, cover, id: doc.id };
        });

        const albumOwners: string[] = [];
        albums.forEach(({ ownerId }) => {
          if (!albumOwners.includes(ownerId)) albumOwners.push(ownerId);
        });
        const ownerQuery = query(collection(db, "users"), where("id", "in", albumOwners));
        const ownerSnapshot = await getDocs(ownerQuery);
        const owners = ownerSnapshot.docs.map((doc) => doc.data() as OwnerProps);
        setAlbums(albums);
        setAlbumOwners(owners);
        setIsLoading(false);
      } catch (e) {
        console.log(e);
      }
    };

    fetchData();
  }, [user?.uid]);

  return user ? (
    <List>
      {isLoading ? (
        <>
          <SkeletonAlbumPreview />
          <SkeletonAlbumPreview />
          <SkeletonAlbumPreview />
          <SkeletonAlbumPreview />
          <SkeletonAlbumPreview />
          <SkeletonAlbumPreview />
        </>
      ) : (
        albums.map(({ ownerId, name, cover, id }, i) => (
          <AlbumPreview
            key={i}
            id={id}
            name={name}
            ownerId={albumOwners.find((owner) => owner.id === ownerId)?.name ?? "Unknown"}
            cover={cover}
          />
        ))
      )}
    </List>
  ) : (
    <Navigate to="/login" />
  );
}

const List = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(1, minmax(230px, 1fr));
  @media (min-width: 500px) {
    grid-template-columns: repeat(2, minmax(230px, 1fr));
  }
  @media (min-width: 780px) {
    grid-template-columns: repeat(3, minmax(250px, 1fr));
  }
  @media (min-width: 1150px) {
    grid-template-columns: repeat(4, minmax(250px, 1fr));
  }
  @media (min-width: 1400px) {
    grid-template-columns: repeat(5, minmax(250px, 1fr));
  }
`;
