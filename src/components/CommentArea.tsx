import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import styled from "styled-components";
import { RiDeleteBin4Fill } from "react-icons/ri";
import UserNameTag from "./UserNameTag";
import { db } from "../firebase";
import { getStringDate } from "../utils/functions";
import type { OwnerProps } from "../routes/home";

type CommentAreaProps = {
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

export default function CommentArea({ comments, currentUser, handleDelete }: CommentAreaProps) {
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
                    <DateRow>
                      <span>{getStringDate(time)}</span>
                      {currentUser?.uid === uid ? <TrashIcon onClick={() => handleDelete(id, uid)} /> : null}
                    </DateRow>
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
  @media (min-width: 1200px) {
    overflow-y: auto;
    height: 500px;
    min-width: 330px;
  }
`;

const Container = styled.div`
  display: flex;
  line-height: 1.5rem;
  flex-direction: column;
  gap: 1.3rem;
`;

const DateRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  & > span {
    font-size: 0.8rem;
  }
`;

const TrashIcon = styled(RiDeleteBin4Fill)`
  cursor: pointer;
`;

const Comment = styled.div`
  border-radius: 6px;
  background: #edeff1;
  padding: 12px;
  margin-left: auto;
  white-space: pre-wrap;
`;
