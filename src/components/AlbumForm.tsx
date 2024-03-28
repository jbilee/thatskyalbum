import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../firebase";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { resizeImage } from "../utils/resizer";
import type { ChangeEvent, FormEvent } from "react";

export default function AlbumForm() {
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
    let doc;
    try {
      doc = await addDoc(collection(db, "albums"), {
        owner: user.displayName,
        ownerId: user.uid,
        name: name,
        desc: desc,
        private: isPrivate,
        timeCreated: Date.now(),
      });

      if (cover) {
        const resizedCover = await resizeImage(cover, "cover");
        const locationRef = ref(storage, `covers/${doc.id}`);
        const result = await uploadBytes(locationRef, resizedCover);
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc, { cover: url });
      }
    } catch (e) {
      console.log(e);
    } finally {
      if (doc) navigate(`/albums/${doc.id}`);
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
    <form onSubmit={handleSubmit}>
      <div>
        <input type="text" value={name} onChange={handleName} />
        {name.length} / 20
      </div>
      <div>
        <textarea onChange={handleDesc} value={desc} />
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
    </form>
  );
}
