import { Link, Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth } from "../firebase";

export default function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.signOut();
    navigate("/login");
  };

  const handleNewAlbum = () => {
    navigate("/albums/new");
  };

  return (
    <Wrapper>
      <Header>
        <Link to="/">Home</Link>
        <button onClick={handleNewAlbum}>New Album</button>
        <Link to="/profile">Profile</Link>
        <button onClick={handleLogout}>Logout</button>
      </Header>
      <Main>
        <Outlet />
      </Main>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  height: 80px;
  width: 100%;
  border-bottom: 1px solid #cacaca;
  padding: 24px;
`;

const Main = styled.div`
  display: flex;
  justify-content: center;
  padding: 24px;
`;
