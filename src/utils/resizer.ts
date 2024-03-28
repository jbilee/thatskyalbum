import FileResizer from "react-image-file-resizer";

const RESIZER_OPTIONS = {
  cover: {
    maxWidth: 1000,
    maxHeight: 200,
    format: "JPEG",
    quality: 80,
    rotation: 0,
  },
  photo: {
    maxWidth: 1000,
    maxHeight: 700,
    format: "JPEG",
    quality: 100,
    rotation: 0,
  },
};

type ResizerProps = {
  maxWidth: number;
  maxHeight: number;
  format: string;
  quality: number;
  rotation: number;
};

type ResizerTuple = [number, number, string, number, number];

const getResizerOptions = (obj: ResizerProps): ResizerTuple => {
  return [obj.maxWidth, obj.maxHeight, obj.format, obj.quality, obj.rotation];
};

export const resizeImage = async (image: File, type: string) => {
  return new Promise<Blob>((resolve) => {
    const options = getResizerOptions(
      RESIZER_OPTIONS[type as keyof typeof RESIZER_OPTIONS]
    );
    FileResizer.imageFileResizer(
      image,
      ...options,
      (resized) => resolve(resized as Blob),
      "blob"
    );
  });
};
