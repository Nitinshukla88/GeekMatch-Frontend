import { BrowserRouter, Route, Routes } from "react-router-dom";
import Body from "./components/Body";
import Login from "./components/Login";
import Profile from "./components/Profile";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import Feed from "./components/Feed";
import Connections from "./components/Connections";
import Requests from "./components/Requests";
import Premium from "./components/Premium";
import Chat from "./components/Chat";
import VideoChat from "./components/VideoChat";
import LandingPage from "./components/LandingPage";

function App() {
  return (
    <>
      <Provider store={appStore}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/app" element={<Body />}>
              <Route path="/app/profile" element={<Profile />} />
              <Route path="/app/login" element={<Login />} />
              <Route path="/app/feed" element={<Feed />} />
              <Route path="/app/connections" element={<Connections />} />
              <Route path="/app/requests" element={<Requests />} />
              <Route path="/app/premium" element={<Premium />} />
              <Route path="/app/chat/:targetUserId" element={<Chat />} />
              <Route
                path="/app/videoChat/:targetUserId"
                element={<VideoChat />}
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
