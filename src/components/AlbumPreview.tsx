import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import type { AlbumProps } from "../routes/home";
import FramedImage from "./FramedImage";
import UserNameTag from "./UserNameTag";
import Logo from "../assets/skylogo.png";

export default function AlbumPreview({ id, name, ownerId, cover }: AlbumProps) {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/albums/${id}`);
  };
  return (
    <Wrapper onClick={handleClick}>
      {cover ? (
        <FramedImage url={cover} size="album" />
      ) : (
        <Image>
          <img src={Logo} alt="Album using Sky logo as default cover" />
        </Image>
      )}
      <strong>{name}</strong>
      <UserNameTag name={ownerId} />
    </Wrapper>
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
