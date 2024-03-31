import { Link, Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth } from "../firebase";
import { LOGOUT_WARNING } from "../utils/strings";

export default function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    const response = confirm(LOGOUT_WARNING);
    if (response) {
      auth.signOut();
      navigate("/login");
    }
  };

  return (
    <Wrapper>
      <Header>
        <Link to="/">Home</Link>
        <Link to="/albums/new">New Album</Link>
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
  display: flex;
  gap: 20px;

  & button {
    margin-left: auto;
  }
`;

const Main = styled.div`
  display: flex;
  justify-content: center;
  padding: 24px;
`;
