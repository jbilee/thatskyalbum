import { useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { resizeImage } from "../utils/resizer";
import { FORM_UI, REGEX_IMG } from "../utils/strings";
import type { ChangeEvent, FormEvent, Reducer } from "react";

type AlbumFormState = {
  name: string;
  desc: string;
  cover?: File;
  isPrivate: boolean;
};

type Action =
  | { type: "name"; payload: string }
  | { type: "desc"; payload: string }
  | { type: "cover"; payload: File }
  | { type: "privacy"; payload: boolean };

const albumReducer: Reducer<AlbumFormState, Action> = (state, action) => {
  switch (action.type) {
    case "name": {
      if (action.payload.length > 20) return { ...state, name: action.payload.slice(0, 20) };
      return { ...state, name: action.payload };
    }
    case "desc": {
      if (action.payload.length > 100) return { ...state, name: action.payload.slice(0, 100) };
      return { ...state, desc: action.payload };
    }
    case "cover": {
      return { ...state, cover: action.payload };
    }
    case "privacy": {
      return { ...state, isPrivate: action.payload };
    }
    default:
      return state;
  }
};

export default function CreateAlbumPage() {
  const navigate = useNavigate();
  const [{ name, desc, cover, isPrivate }, dispatch] = useReducer(albumReducer, {
    name: "",
    desc: "",
    isPrivate: true,
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files || files.length > 1) return;
    const file = files[0];
    const fileType = file.type;
    if (!REGEX_IMG.test(fileType)) {
      console.log("Invalid file type");
      return;
    }
    dispatch({ type: "cover", payload: file });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || name === "") return;
    let doc;

    try {
      doc = await addDoc(collection(db, "albums"), {
        name,
        desc,
        isPrivate,
        ownerId: user.uid,
        timeCreated: Date.now(),
      });
      if (cover) {
        const resizedCover = await resizeImage(cover, "cover");
        const storageRef = ref(storage, `covers/${doc.id}`);
        const result = await uploadBytes(storageRef, resizedCover);
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc, { cover: url });
      }
    } catch (e) {
      console.log(e);
    } finally {
      if (doc) navigate(`/albums/${doc.id}`, { replace: true });
    }
  };

  return (
    <Wrapper>
      <h3>{FORM_UI.album.title}</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">{FORM_UI.album.name}</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => dispatch({ type: "name", payload: e.target.value })}
          />
          {name.length} / 20
        </div>
        <div>
          <label htmlFor="desc">{FORM_UI.album.desc}</label>
          <textarea
            onChange={(e) => dispatch({ type: "desc", payload: e.target.value })}
            value={desc}
            id="desc"
          />
          {desc?.length ?? "0"} / 100
        </div>
        <div>
          <label htmlFor="privacy">{FORM_UI.album.privacy}</label>
          <select
            id="privacy"
            onChange={(e) => dispatch({ type: "privacy", payload: e.target.value === "Private" })}
          >
            <option>Private</option>
            <option>Public</option>
          </select>
        </div>
        <div>
          <label htmlFor="form__file">{FORM_UI.album.cover}</label>
          <input id="form__file" type="file" onChange={handleFileChange} accept="images/*" />
        </div>
        <input type="submit" value={FORM_UI.album.btn} />
      </form>
    </Wrapper>
  );
}

const Wrapper = styled.div``;
