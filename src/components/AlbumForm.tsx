import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../firebase";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import styled from "styled-components";
import type { ChangeEvent, FormEvent } from "react";

const AlbumForm = () => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [cover, setCover] = useState<File | null>(null);
  const [isPrivate, setIsPrivate] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;
    if (name === "") return;
    try {
      const doc = await addDoc(collection(db, "albums"), {
        owner: user.displayName,
        ownerId: user.uid,
        name: name,
        desc: desc,
        private: isPrivate,
        timeCreated: Date.now(),
      });

      if (cover) {
        const locationRef = ref(storage, `covers/${doc.id}`);
        const result = await uploadBytes(locationRef, cover);
        console.log(result);
        const url = await getDownloadURL(result.ref);
        console.log(url);
        await updateDoc(doc, { cover: url });
      }
    } catch (e) {
      console.log(e);
    } finally {
      navigate("/");
    }
  };

  const handleName = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    if (input.length > 20) return;
    setName(input);
  };

  const handleDesc = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.value;
    if (input.length > 100) return;
    setDesc(input);
  };

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      setCover(files[0]);
    }
  };

  return (
    <Wrapper onSubmit={handleSubmit}>
      <div>
        <input type="text" value={name} onChange={handleName} />
        {name.length} / 20
      </div>
      <div>
        <textarea onChange={handleDesc} value={desc}></textarea>
        {desc.length} / 100
      </div>
      <div>
        <select onChange={(e) => setIsPrivate(e.target.value === "Private")}>
          <option>Private</option>
          <option>Public</option>
        </select>
      </div>
      <div>
        Cover image
        <input type="file" onChange={handleFile} />
      </div>
      <input type="submit" value="Create" />
    </Wrapper>
  );
};

const Wrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 500px;

  textarea {
    resize: none;
  }
`;

export default AlbumForm;
