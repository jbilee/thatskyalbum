import { Link } from "react-router-dom";
import styled from "styled-components";
import { BsFillPersonFill } from "react-icons/bs";
import type { AlbumProps } from "../routes/home";
import FramedImage from "./FramedImage";
import Logo from "../assets/skylogo.png";

export default function AlbumPreview({ id, name, ownerId, cover }: AlbumProps) {
  return (
    <DomLink to={`/albums/${id}`}>
      <Wrapper>
        {cover ? (
          <FramedImage url={cover} size="album" />
        ) : (
          <Image>
            <img src={Logo} alt="Album using Sky logo as default cover" />
          </Image>
        )}
        <strong>{name}</strong>
        <div>
          <BsFillPersonFill />
          {ownerId}
        </div>
      </Wrapper>
    </DomLink>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  border-radius: 6px;
  border: 1px solid #cacaca;
  background: #b7e0ee;
  width: 300px;
  padding: 20px;
  cursor: pointer;
  &:hover {
    opacity: 0.7;
  }
`;

const Image = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 6px;
  & img {
    height: 150px;
    align-self: center;
  }
`;

const DomLink = styled(Link)`
  & a {
    text-decoration: none;
    color: red;
  }
`;

// const Desc = styled.div`
//   display: flex;
//   justify-content: space-between;
//   width: 100%;
// `;
