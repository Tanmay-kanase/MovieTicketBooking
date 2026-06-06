import { Route, Router } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/auth/Signin";

function App() {
  return (
    <>
      <Router>
        <Route path="" element={<Home />} />
        <Route path="sigin" element={<SignIn />} />
      </Router>
    </>
  );
}

export default App;
