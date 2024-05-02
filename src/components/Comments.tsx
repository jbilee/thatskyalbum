import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import styled from "styled-components";
import { RiDeleteBin4Fill } from "react-icons/ri";
import UserNameTag from "./UserNameTag";
import { db } from "../firebase";
import type { OwnerProps } from "../routes/home";

type CommentsProps = {
  comments: CommentProps[] | undefined;
  currentUser: User | null;
  handleDelete: (id: string, uid: string) => void;
};

export type CommentProps = {
  uid: string;
  text: string;
  time: number;
  id: string;
};

export default function Comments({ comments, currentUser, handleDelete }: CommentsProps) {
  const [commentOwners, setCommentOwners] = useState<OwnerProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!comments || comments.length === 0) return setIsLoading(false);

    const fetchData = async () => {
      const commentOwners: string[] = [];
      comments?.forEach(({ uid }) => {
        if (!commentOwners.includes(uid)) commentOwners.push(uid);
      });
      const ownerQuery = query(collection(db, "users"), where("id", "in", commentOwners));
      const ownerSnapshot = await getDocs(ownerQuery);
      const owners = ownerSnapshot.docs.map((doc) => doc.data() as OwnerProps);
      setCommentOwners(owners);
      setIsLoading(false);
    };

    fetchData();
  }, [comments]);
  return (
    <Wrapper>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Container>
          {comments && comments.length > 0
            ? comments.map(({ text, time, uid, id }, i) => {
                const displayName = commentOwners.find((owner) => owner.id === uid)?.name ?? "Anonymous";
                return (
                  <div key={i}>
                    <UserNameTag name={displayName} />
                    <Comment>{text}</Comment>
                    {currentUser?.uid === uid ? <RiDeleteBin4Fill onClick={() => handleDelete(id, uid)} /> : null}
                    {time}
                  </div>
                );
              })
            : null}
        </Container>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  height: 500px;
  overflow-y: auto;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: auto;
`;

const Comment = styled.div`
  border-radius: 6px;
  background: #edeff1;
  padding: 12px;
  margin-left: auto;
  white-space: pre-wrap;
`;
