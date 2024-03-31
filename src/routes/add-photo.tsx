import { ChangeEvent, FormEvent, useReducer } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import PreviewImage from "../components/PreviewImage";
import { auth, db, storage } from "../firebase";
import { resizeImage } from "../utils/resizer";
import { FORM_UI, REGEX_IMG } from "../utils/strings";
import type { Reducer } from "react";

type PhotoFormState = {
  title: string;
  desc: string;
  photo: File | null;
};

type Action =
  | { type: "title"; payload: string }
  | { type: "desc"; payload: string }
  | { type: "file"; payload: File };

const photoReducer: Reducer<PhotoFormState, Action> = (state, action) => {
  switch (action.type) {
    case "title": {
      if (action.payload.length > 20) return { ...state, title: action.payload.slice(0, 20) };
      return { ...state, title: action.payload };
    }
    case "desc": {
      if (action.payload.length > 100) return { ...state, desc: action.payload.slice(0, 100) };
      return { ...state, desc: action.payload };
    }
    case "file": {
      return { ...state, photo: action.payload };
    }
    default:
      return state;
  }
};

export default function AddPhotoPage() {
  const navigate = useNavigate();
  const [{ title, desc, photo }, dispatch] = useReducer(photoReducer, {
    title: "",
    desc: "",
    photo: null,
  });
  const params = useParams();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files || files.length > 1) return;
    const file = files[0];
    const fileType = file.type;
    if (!REGEX_IMG.test(fileType)) {
      console.log("Invalid file type");
      return;
    }
    dispatch({ type: "file", payload: file });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || !photo) return;
    let doc;

    try {
      const storeRef = collection(db, `albums/${params.albumId}/photos`);
      doc = await addDoc(storeRef, {
        title,
        desc,
        owner: user.displayName,
        ownerId: user.uid,
      });
      const resizedImage = await resizeImage(photo, "photo");
      const storageRef = ref(storage, `photos/${doc.id}`);
      const result = await uploadBytes(storageRef, resizedImage);
      const url = await getDownloadURL(result.ref);
      await updateDoc(doc, { photo: url });
    } catch (e) {
      console.log(e);
    } finally {
      if (doc) navigate(`/albums/${params.albumId}/${doc.id}`, { replace: true });
    }
  };

  return (
    <>
      <h3>{FORM_UI.photo.title}</h3>
      <form onSubmit={handleSubmit}>
        {photo ? <PreviewImage file={photo} /> : <div>No file selected</div>}
        <div>
          <input type="file" id="form__file" onChange={handleFileChange} />
        </div>
        <div>
          <label htmlFor="title">{FORM_UI.photo.name}</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => dispatch({ type: "title", payload: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="desc">{FORM_UI.photo.desc}</label>
          <textarea
            id="desc"
            value={desc}
            onChange={(e) => dispatch({ type: "desc", payload: e.target.value })}
          />
        </div>
        <input type="submit" value={FORM_UI.photo.btn} />
      </form>
    </>
  );
}
