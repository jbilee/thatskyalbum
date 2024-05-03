import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import styled from "styled-components";
import { AiOutlineClose } from "react-icons/ai";
import CommentArea from "../components/CommentArea";
import FramedImage from "../components/FramedImage";
import NewComment from "../components/NewComment";
import NotFound from "../components/NotFound";
import { type DocRef, auth, db, storage, type ColRef } from "../firebase";
import { PHOTO_UI } from "../utils/strings";
import type { CommentProps } from "../components/CommentArea";

type PhotoProps = {
  ownerId: string;
  photo: string;
  title: string;
  desc: string;
};

export default function PhotoDetailsPage() {
  const params = useParams();
  const [error, setError] = useState(false);
  const [photo, setPhoto] = useState<PhotoProps | null>(null);
  const [comments, setComments] = useState<CommentProps[] | null>(null);
  const [photoRef] = useState<DocRef>(doc(db, `albums/${params.albumId}/photos`, params.photoId!));
  const [commentRef] = useState<ColRef>(collection(db, `albums/${params.albumId}/photos/${params.photoId!}/comments`));
  const [isViewMode, setIsViewMode] = useState(false);
  const user = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const photoSnapshot = (await getDoc(photoRef)).data();
      if (!photoSnapshot) return setError(true);
      setPhoto({ ...photoSnapshot } as PhotoProps);

      const commentSnapshot = await getDocs(commentRef);
      const userComments = commentSnapshot.docs.map((doc) => {
        const comment = doc.data();
        return { ...comment, id: doc.id } as CommentProps;
      });
      userComments.sort((a, b) => a.time - b.time);
      setComments(userComments);
    };

    fetchData();
  }, [params.albumId, params.photoId, photoRef, commentRef]);

  if (error) return <NotFound />;

  const handleComment = async (comment: string, callback: Dispatch<SetStateAction<string>>) => {
    if (!user || comment === "" || !photo) return;
    const id = crypto.randomUUID();
    const newComment = {
      uid: user.uid,
      text: comment,
      time: Date.now(),
    };
    try {
      await setDoc(doc(db, `albums/${params.albumId}/photos/${params.photoId!}/comments`, id), newComment);
      setComments((prev) => (prev ? [...prev, { ...newComment, id }] : [{ ...newComment, id }]));
      callback("");
    } catch (e) {
      console.log(e);
      // Display toast
    }
  };

  const deleteComment = async (id: string, uid: string) => {
    if (!user || user.uid !== uid || !photo || !comments) return;
    const filteredComments = comments.filter((comment) => comment.id !== id);
    const commentRef = doc(db, `albums/${params.albumId}/photos/${params.photoId!}/comments`, id);
    await deleteDoc(commentRef);
    setComments(filteredComments);
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

  const handleClick = () => {
    setIsViewMode((prev) => !prev);
  };

  return (
    <Wrapper>
      {photo ? (
        <>
          {isViewMode ? (
            <>
              <Backdrop />
              <ViewModeImage>
                <img src={photo.photo} />
              </ViewModeImage>
              <CloseBtn onClick={handleClick} />
            </>
          ) : null}
          <div>
            <div onClick={handleClick}>
              <FramedImage url={photo.photo} size="largePhoto" cursorType="pointer" />
            </div>
            {user?.uid === photo.ownerId ? <button onClick={deletePhoto}>{PHOTO_UI.delete}</button> : null}
            <h2>{photo.title || "Untitled"}</h2>
            <p>{photo.desc}</p>
          </div>
          <div>
            <h1>{PHOTO_UI.comments}</h1>
            <CommentArea comments={comments || []} currentUser={user} handleDelete={deleteComment} />
            <NewComment handleComment={handleComment} />
          </div>
        </>
      ) : null}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  @media (min-width: 1200px) {
    flex-direction: row;
  }
`;

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.8);
`;

const ViewModeImage = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: grid;
  place-content: center center;
  & > img {
    width: 100%;
    height: 100%;
  }
`;

const CloseBtn = styled(AiOutlineClose)`
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  color: white;
  font-size: 5rem;
  @media (min-width: 500px) {
    font-size: 2.5rem;
  }
  cursor: pointer;
`;
