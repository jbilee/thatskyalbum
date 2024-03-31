import { Navigate, useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { signInAnonymously, updateProfile } from "firebase/auth";
import styled from "styled-components";
import { auth, db } from "../firebase";

export default function LoginPage() {
  const navigate = useNavigate();

  if (auth.currentUser) return <Navigate to="/" />;

  const onClick = async () => {
    try {
      const credentials = await signInAnonymously(auth);
      const name = `guest${Date.now().toString().slice(0, 4)}`;
      await updateProfile(credentials.user, { displayName: name });
      const newUser = { id: credentials.user.uid, name };
      await addDoc(collection(db, "users"), newUser);
      navigate("/");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Wrapper>
      <Button onClick={onClick}>Guest Login</Button>
      <Button>Create Account</Button>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  height: 80vh;
  justify-content: flex-end;
`;

const Button = styled.div`
  background: #e4e2e2;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  cursor: pointer;
`;
