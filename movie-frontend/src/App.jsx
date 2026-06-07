import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/auth/Signin";
import SignUp from "./pages/auth/Signup";
import Profile from "./pages/auth/Profile";
import AddMovie from "./pages/admin/AddMovie";
import MovieList from "./pages/admin/movie/movieList";
import Movie from "./pages/movie/movie";
import AdminHome from "./pages/admin/home/AdminHome";
import Theaters from "./pages/admin/theather/Theater";

function App() {
  return (
    <>
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="signin" element={<SignIn />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="profile" element={<Profile />} />
        <Route path="add-movie" element={<AddMovie />} />
        <Route path="movie-list" element={<MovieList />} />
        <Route path="movie/:id" element={<Movie />} />
        <Route path="admin-dashboard" element={<AdminHome />} />
        <Route path="theater" element={<Theaters />} />
      </Routes>
    </>
  );
}

export default App;
