import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

type PhotoProps = {
  id: string;
  photo: string;
  uploader: string;
};

export default function AlbumPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [photos, setPhotos] = useState<PhotoProps[]>([]);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const ref = collection(db, `albums/${params.albumId}/photos`);
      const snapshot = await getDocs(ref);
      const photos = snapshot.docs.map((doc) => {
        const { photo, uploader } = doc.data();
        return { photo, uploader, id: doc.id } as PhotoProps;
      });
      setPhotos(photos);
      setIsLoading(false);
    };

    fetchData();
  }, [params.albumId]);

  if (isLoading) return null;

  return (
    <>
      {photos.length === 0 ? (
        <>
          <div>This album is empty. Why don't you add some photos?</div>
          <button onClick={() => navigate(`/albums/${params.albumId}/add`)}>Add photo</button>
        </>
      ) : (
        <>
          <div>
            {photos.map((photo, i) => (
              <Link to={`/albums/${params.albumId}/${photo.id}`} key={i}>
                <div>
                  <img src={photo.photo} width="200" />
                </div>
              </Link>
            ))}
          </div>
          <button onClick={() => navigate(`/albums/${params.albumId}/add`)}>Add photo</button>
        </>
      )}
    </>
  );
}
