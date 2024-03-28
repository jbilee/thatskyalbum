import styled from "styled-components";
import AlbumForm from "../components/AlbumForm";

export default function NewAlbumPage() {
  return (
    <Wrapper>
      <h3>Create a new album</h3>
      <AlbumForm />
    </Wrapper>
  );
}

const Wrapper = styled.div``;
