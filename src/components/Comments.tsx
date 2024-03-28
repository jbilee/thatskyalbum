import styled from "styled-components";
import { BsFillPersonFill } from "react-icons/bs";
import { RiDeleteBin4Fill } from "react-icons/ri";
import type { User } from "firebase/auth";

type CommentsProps = {
  comments: CommentProps[] | undefined;
  currentUser: User | null;
  handleDelete: (id: string, uid: string) => void;
};

type CommentProps = {
  user: string;
  uid: string;
  text: string;
  time: number;
  id: string;
};

export default function Comments({ comments, currentUser, handleDelete }: CommentsProps) {
  return (
    <Wrapper>
      <Container>
        {comments?.map(({ user, text, time, uid, id }, i) => (
          <>
            <span>
              <BsFillPersonFill />
              {user}
            </span>
            <Comment key={i}>{text}</Comment>
            {currentUser?.uid === uid ? (
              <RiDeleteBin4Fill onClick={() => handleDelete(id, uid)} />
            ) : null}
            {time}
          </>
        ))}
      </Container>
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
  background: #866767;
  padding: 12px;
  margin-left: auto;
`;
