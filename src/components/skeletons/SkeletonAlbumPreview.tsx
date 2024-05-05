import styled from "styled-components";

export default function SkeletonAlbumPreview() {
  return (
    <>
      <Wrapper>
        <Image className="skeleton" />
        <div className="skeleton text long" />
        <div className="skeleton text short" />
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  border-radius: 6px;
  border: 1px solid #cacaca;
  padding: 20px;
`;

const Image = styled.div`
  height: 150px;
  border-radius: 6px;
`;
