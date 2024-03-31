import { ChangeEvent, useState } from "react";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import styled from "styled-components";
import { PiNotePencilFill } from "react-icons/pi";
import { FaSave } from "react-icons/fa";
import { auth, db } from "../firebase";

export default function ProfilePage() {
  const user = auth.currentUser;
  const [displayName, setDisplayName] = useState(user?.displayName);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [editedName, setEditedName] = useState(displayName || "");

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    if (input.length > 20) return;
    setEditedName(input);
  };

  const changeName = async () => {
    if (!user) return;
    if (displayName === editedName) return setIsEditing(false);
    setIsLoading(true);
    try {
      const docRef = doc(db, "users", user.uid);
      await updateProfile(user, { displayName: editedName });
      await updateDoc(docRef, { name: editedName });
    } catch (e) {
      console.log(e);
      setIsError(true);
    } finally {
      setIsEditing(false);
      setIsLoading(false);
      if (!isError) setDisplayName(editedName);
    }
  };

  return (
    <Wrapper>
      {isEditing ? (
        <Container>
          <span className="bold">Display Name</span>
          <input type="text" value={editedName} onChange={handleInput} />
          <Icon onClick={changeName}>
            <FaSave size="1.3rem" />
          </Icon>
        </Container>
      ) : (
        <Container>
          <span className="bold">Display Name</span>
          <div>
            {displayName || ""}
            <Icon onClick={() => setIsEditing(true)}>
              <PiNotePencilFill size="1.3rem" />
            </Icon>
          </div>
        </Container>
      )}
      {isLoading ? <div>changing your name........</div> : null}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  place-items: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  div {
    display: flex;
    gap: 6px;
  }
  .bold {
    font-weight: 700;
  }
`;

const Icon = styled.div`
  display: flex;
  place-items: center;
  color: #485159;
  cursor: pointer;
`;
