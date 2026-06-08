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
import MyTickets from "./pages/tickets/myTickets";
import AdminSignin from "./pages/auth/AdminSignin";
import UserRoute from "./routes/UserRoutes";
import AdminRoute from "./routes/AdminRoutes";


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/admin-signin" element={<AdminSignin />} />
        <Route path="/movie/:id" element={<Movie />} />
        <Route
          path="/profile"
          element={
            <UserRoute>
              <Profile />
            </UserRoute>
          }
        />
        <Route
          path="/my-tickets"
          element={
            <UserRoute>
              <MyTickets />
            </UserRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <AdminRoute>
              <AdminHome />
            </AdminRoute>
          }
        />
        <Route
          path="/add-movie"
          element={
            <AdminRoute>
              <AddMovie />
            </AdminRoute>
          }
        />
        <Route
          path="/movie-list"
          element={
            <AdminRoute>
              <MovieList />
            </AdminRoute>
          }
        />
        <Route
          path="/theater"
          element={
            <AdminRoute>
              <Theaters />
            </AdminRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
