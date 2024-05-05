import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { collection, deleteDoc, doc, getDoc, getDocs } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import styled from "styled-components";
import FramedImage from "../components/FramedImage";
import NotFound from "../components/NotFound";
import SkeletonAlbumPage from "../components/skeletons/SkeletonAlbumPage";
import { type ColRef, type DocRef, auth, db, storage } from "../firebase";
import { ALBUM_DELETION_WARNING, ALBUM_UI, EMPTY_ALBUM } from "../utils/strings";

type PhotoProps = {
  id: string;
  photo: string;
  time: number;
};

type AlbumProps = {
  cover?: string;
  desc: string;
  name: string;
  isPrivate: boolean;
  ownerId: string;
};

export default function AlbumDetailsPage() {
  const params = useParams();
  const user = auth.currentUser!;
  const [albumRef] = useState<DocRef>(doc(db, `albums/${params.albumId}`));
  const [photosRef] = useState<ColRef>(collection(db, `albums/${params.albumId}/photos`));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [photos, setPhotos] = useState<PhotoProps[]>([]);
  const [album, setAlbum] = useState<AlbumProps | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const albumSnapshot = await getDoc(albumRef);
      const albumData = albumSnapshot.data();
      if (!albumData) return setError(true);
      setAlbum(albumData as AlbumProps);
      const photosSnapshot = await getDocs(photosRef);
      const photos = photosSnapshot.docs.map((doc) => {
        const { photo, time } = doc.data();
        return { photo, time, id: doc.id } as PhotoProps;
      });
      photos.sort((a, b) => a.time - b.time);
      setPhotos(photos);
      setIsLoading(false);
    };

    fetchData();
  }, [photosRef, albumRef]);

  if (isLoading) return <SkeletonAlbumPage />;
  if (error || !album) return <NotFound />;

  const handleDelete = async () => {
    if (photos.length > 0) return alert(ALBUM_DELETION_WARNING);

    const albumData = (await getDoc(albumRef)).data();
    try {
      await deleteDoc(albumRef);
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
      <Details $bg={album.cover}>
        <span className="strong">{album.name}</span>
        <span>
          {photos.length < 1 ? "No photos" : photos.length === 1 ? `${photos.length} photo` : `${photos.length} photos`}
        </span>
        {album.ownerId === user.uid ? (
          <input type="button" className="btn__delete" onClick={handleDelete} value={ALBUM_UI.delete} />
        ) : null}
      </Details>
      {photos.length === 0 ? (
        <div>{EMPTY_ALBUM}</div>
      ) : (
        <Photos>
          {photos.map(({ photo, id }, i) => (
            <div key={i} onClick={() => navigate(`/albums/${params.albumId}/${id}`)}>
              <FramedImage key={i} url={photo} size="smallPhoto" cursorType="pointer" />
            </div>
          ))}
        </Photos>
      )}
      <input type="button" onClick={() => navigate(`/albums/${params.albumId}/add`)} value={ALBUM_UI.add} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  width: 100%;
  min-width: 230px;
  max-width: 800px;
  word-wrap: break-word;
`;

const Details = styled.div<{ $bg?: string }>`
  position: relative;
  border-radius: 12px;
  background-image: linear-gradient(to bottom, rgba(3, 17, 37, 0.9), rgba(20, 121, 183, 0.619)),
    url(${({ $bg }) => ($bg ? $bg : null)});
  background-size: cover;
  background-position: 0 25%;
  width: 100%;
  height: 150px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: white;
  .strong {
    font-size: 1.2rem;
    font-weight: 700;
  }
  .btn__delete {
    position: absolute;
    top: 0;
    right: 0;
  }
`;

const Photos = styled.div`
  display: grid;
  width: 100%;
  gap: 10px;
  grid-template-columns: repeat(2, 1fr);
  @media (min-width: 700px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;
