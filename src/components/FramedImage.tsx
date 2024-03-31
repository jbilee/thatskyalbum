import styled from "styled-components";
import { IMAGE_SIZES } from "../utils/values";

type FramedImageProps = {
  url: string;
  size: keyof typeof IMAGE_SIZES;
};

export default function FramedImage({ url, size }: FramedImageProps) {
  return (
    <Wrapper
      src={url}
      $width={IMAGE_SIZES[size].width}
      $height={IMAGE_SIZES[size].height}
      $radius={IMAGE_SIZES[size].radius}
    />
  );
}

const Wrapper = styled.img<{ $width: string; $height: string; $radius: string }>`
  width: ${({ $width }) => $width};
  height: ${({ $height }) => $height};
  border-radius: ${({ $radius }) => $radius};
  object-fit: cover;
`;
