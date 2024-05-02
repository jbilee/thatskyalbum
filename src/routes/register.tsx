import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TwitterAuthProvider, createUserWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function RegistrationPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const credentials = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credentials.user, {
        displayName: name,
      });
      navigate("/");
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwitter = async () => {
    setIsLoading(true);
    try {
      const provider = new TwitterAuthProvider();
      const { user } = await signInWithPopup(auth, provider);
      const userQuery = await getDoc(doc(db, "users", user.uid));
      const userExists = userQuery.exists();
      if (!userExists) {
        const newUser = { id: user.uid, name: user.displayName };
        await setDoc(doc(db, "users", user.uid), newUser);
      }
      navigate("/");
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input type="submit" value="submit" disabled={isLoading} />
      </form>
      <br />
      <button onClick={handleTwitter}>Twitter login</button>
    </>
  );
}
