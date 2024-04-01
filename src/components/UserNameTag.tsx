import styled from "styled-components";
import { BsFillPersonFill } from "react-icons/bs";

type UserNameTagProps = {
  name: string;
};

export default function UserNameTag({ name }: UserNameTagProps) {
  return (
    <Wrapper>
      <BsFillPersonFill />
      {name}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 4px 0px;
  gap: 4px;
`;
