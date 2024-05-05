import styled from "styled-components";

export default function SkeletonAlbumDetails() {
  return (
    <Wrapper className="skeleton">
      <div className="skeleton reverse text long" />
      <div className="skeleton reverse text short" />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  border-radius: 12px;
  width: 100%;
  height: 150px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: white;
  @media (min-width: 700px) {
    height: 180px;
  }
`;
