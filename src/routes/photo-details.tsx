import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  DocumentData,
  DocumentReference,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import styled from "styled-components";
import Comments from "../components/Comments";
import NewComment from "../components/NewComment";
import PhotoNotFound from "../components/PhotoNotFound";
import { auth, db, storage } from "../firebase";
import { getDate } from "../utils/functions";
import { PHOTO_UI } from "../utils/strings";

type PhotoProps = {
  owner: string;
  ownerId: string;
  photo: string;
  comments?: Array<{
    text: string;
    user: string;
    time: number;
    uid: string;
    id: string;
  }>;
  title?: string;
  desc?: string;
};

export default function PhotoDetailsPage() {
  const params = useParams();
  const [error, setError] = useState(false);
  const [photo, setPhoto] = useState<PhotoProps | null>(null);
  const [photoRef] = useState<DocumentReference<DocumentData>>(
    doc(db, `albums/${params.albumId}/photos`, params.photoId!)
  );
  const user = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const snapshotData = (await getDoc(photoRef)).data();
      if (!snapshotData) return setError(true);
      const data = { ...snapshotData } as PhotoProps;
      setPhoto({ ...data });
    };

    fetchData();
  }, [params.albumId, params.photoId, photoRef]);

  if (error) return <PhotoNotFound />;

  const handleComment = async (comment: string) => {
    if (!user || comment === "" || !photo) return;
    const newComment = {
      uid: user.uid,
      text: comment,
      time: getDate(),
      id: crypto.randomUUID(),
    };
    const comments = photo.comments ? [...photo.comments, newComment] : [newComment];
    await updateDoc(photoRef, { comments });
    setPhoto(
      (prev) =>
        ({
          ...prev,
          comments,
        } as PhotoProps)
    );
  };

  const deleteComment = async (id: string, uid: string) => {
    if (!user || user.uid !== uid || !photo) return;
    const filteredComments = photo.comments!.filter((comment) => comment.id !== id);
    await updateDoc(photoRef, { comments: filteredComments });
    setPhoto((prev) => ({ ...prev, comments: filteredComments } as PhotoProps));
  };

  const deletePhoto = async () => {
    if (!user || !photo || user.uid !== photo.ownerId) return;
    const storageRef = ref(storage, `photos/${params.photoId}`);
    try {
      await deleteDoc(photoRef);
      await deleteObject(storageRef);
    } catch (e) {
      console.log(e);
    } finally {
      navigate(`/albums/${params.albumId}`);
    }
  };

  return (
    <Wrapper>
      {photo ? (
        <>
          <div>
            <img src={photo.photo} />
            <button onClick={deletePhoto}>{PHOTO_UI.delete}</button>
            <h2>{photo.title || "Untitled"}</h2>
            <p>{photo.desc}</p>
          </div>
          <div>
            <h1>{PHOTO_UI.comments}</h1>
            <Comments comments={photo.comments} currentUser={user} handleDelete={deleteComment} />
            <NewComment handleComment={handleComment} />
          </div>
        </>
      ) : null}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  gap: 12px;
`;
