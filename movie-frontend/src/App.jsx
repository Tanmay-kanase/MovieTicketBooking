import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/auth/Signin";
import SignUp from "./pages/auth/Signup";

function App() {
  return (
    <>
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="signin" element={<SignIn />} />
        <Route path="signup" element={<SignUp />} />
      </Routes>
    </>
  );
}

export default App;
