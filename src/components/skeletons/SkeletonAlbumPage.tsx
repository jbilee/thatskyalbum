import styled from "styled-components";
import SkeletonAlbumDetails from "./SkeletonAlbumDetails";
import SkeletonFramedImage from "./SkeletonFramedImage";

export default function SkeletonAlbumPage() {
  return (
    <Wrapper>
      <SkeletonAlbumDetails />
      <Photo>
        <SkeletonFramedImage />
        <SkeletonFramedImage />
        <SkeletonFramedImage />
      </Photo>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  width: 100%;
  min-width: 230px;
  max-width: 800px;
`;

const Photo = styled.div`
  display: grid;
  width: 100%;
  gap: 10px;
  grid-template-columns: repeat(2, 1fr);
  @media (min-width: 700px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;
