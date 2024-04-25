import styled from "styled-components";

type PreviewImageProps = {
  file: File;
};

export default function PreviewImage({ file }: PreviewImageProps) {
  const url = URL.createObjectURL(file);
  return <Image src={url} />;
}

const Image = styled.img`
  width: 300px;
`;
