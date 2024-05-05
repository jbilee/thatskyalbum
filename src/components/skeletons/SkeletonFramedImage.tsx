import styled from "styled-components";

export default function SkeletonFramedImage() {
  return <Wrapper className="skeleton" />;
}

const Wrapper = styled.div`
  width: 260px;
  height: 150px;
  border-radius: 8px;
`;
