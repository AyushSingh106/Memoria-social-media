import Body from "./components/Body";
import toast, { Toaster } from 'react-hot-toast';
import UserContext from "./context/UserContext";
import UserContextProvider from "./context/UserContextProvider.js";

function App() {
  return (
    <UserContextProvider>
    <div className="bg-white">
      <Body />
      <Toaster/>
    </div>
    </UserContextProvider>
  );
}

export default App;
