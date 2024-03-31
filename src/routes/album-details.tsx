import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { collection, deleteDoc, doc, getDoc, getDocs } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "../firebase";
import { ALBUM_DELETION_WARNING, ALBUM_UI, EMPTY_ALBUM } from "../utils/strings";
import type { CollectionReference, DocumentData, DocumentReference } from "firebase/firestore";
import styled from "styled-components";

type PhotoProps = {
  id: string;
  photo: string;
};

type AlbumProps =
  | {
      cover: string;
      desc: string;
      name: string;
    }
  | undefined;

export default function AlbumDetailsPage() {
  const params = useParams();
  const [albumRef] = useState<DocumentReference<DocumentData, DocumentData>>(
    doc(db, `albums/${params.albumId}`)
  );
  const [photosRef] = useState<CollectionReference<DocumentData, DocumentData>>(
    collection(db, `albums/${params.albumId}/photos`)
  );
  const [isLoading, setIsLoading] = useState(true);
  const [photos, setPhotos] = useState<PhotoProps[]>([]);
  const [album, setAlbum] = useState<AlbumProps>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const albumSnapshot = await getDoc(albumRef);
      const albumData = albumSnapshot.data();
      setAlbum(albumData as AlbumProps);
      const photosSnapshot = await getDocs(photosRef);
      const photos = photosSnapshot.docs.map((doc) => {
        const { photo } = doc.data();
        return { photo, id: doc.id } as PhotoProps;
      });
      setPhotos(photos);
      setIsLoading(false);
    };

    fetchData();
  }, [photosRef, albumRef]);

  if (isLoading) return null;

  const handleDelete = async () => {
    if (photos.length > 0) {
      return alert(ALBUM_DELETION_WARNING);
    }

    const docRef = doc(db, "albums", params.albumId!);
    const albumData = (await getDoc(docRef)).data();
    try {
      await deleteDoc(docRef);
      if (albumData && albumData.cover) {
        const coverRef = ref(storage, `covers/${params.albumId}`);
        await deleteObject(coverRef);
      }
    } catch (e) {
      console.log(e);
    } finally {
      navigate("/");
    }
  };

  return (
    <Wrapper>
      <Details>
        <div>
          {album ? (
            <span className="strong">{album.name}</span>
          ) : (
            <span className="strong">"ALBUM NAME"</span>
          )}{" "}
          ({photos.length} photos) <br />
          {album ? <Image src={album.cover} alt={album.cover} /> : null}
        </div>
        <Button onClick={handleDelete}>{ALBUM_UI.delete}</Button>
      </Details>
      {photos.length === 0 ? (
        <>
          <div>{EMPTY_ALBUM}</div>
        </>
      ) : (
        <>
          <Photos>
            {photos.map(({ photo, id }, i) => (
              <Link to={`/albums/${params.albumId}/${id}`} key={i}>
                <div>
                  <img src={photo} width="200" />
                </div>
              </Link>
            ))}
          </Photos>
        </>
      )}
      <Button onClick={() => navigate(`/albums/${params.albumId}/add`)}>{ALBUM_UI.add}</Button>
    </Wrapper>
  );
}

const Details = styled.div`
  border-radius: 12px;
  background: #b7e0ee;
  width: 100%;
  height: 150px;
  padding: 12px;
  display: flex;

  .strong {
    font-size: 1.2rem;
    font-weight: 700;
  }
`;

const Image = styled.img`
  width: 150px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const Photos = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  max-width: 500px;

  img {
    border: 1px solid #a5adb0;
  }
`;

const Button = styled.button`
  border: none;
  border-radius: 12px;
  background: #167ade;
  color: white;
  margin: 12px;
  padding: 18px;
  max-width: 140px;
`;
