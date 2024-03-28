import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  or,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import styled from "styled-components";
import AlbumPreview from "../components/AlbumPreview";
import { auth, db } from "../firebase";

export type AlbumProps = {
  id: string;
  owner: string;
  name: string;
  cover?: string;
};

export default function HomePage() {
  const user = auth.currentUser;
  const [albums, setAlbums] = useState<AlbumProps[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = query(
        collection(db, "albums"),
        or(where("ownerId", "==", user?.uid), where("private", "==", false)),
        orderBy("timeCreated", "asc")
      );

      const snapshot = await getDocs(fetchedData);
      const albums = snapshot.docs.map((doc) => {
        const { owner, name, cover } = doc.data();
        return { owner, name, cover, id: doc.id };
      });
      console.log(albums);
      setAlbums(albums);
    };

    fetchData();
  }, [user?.uid]);

  return (
    <List>
      {albums.map(({ owner, name, cover, id }, i) => (
        <AlbumPreview key={i} id={id} name={name} owner={owner} cover={cover} />
      ))}
    </List>
  );
}

const List = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;
