import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/auth/Signin";
import SignUp from "./pages/auth/Signup";
import Profile from "./pages/auth/Profile";

function App() {
  return (
    <>
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="signin" element={<SignIn />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="profile" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;
