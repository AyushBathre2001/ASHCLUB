import './App.css';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Signup from './components/Signup';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import ChatPage from './components/ChatPage';
import Homepage from './components/Homepage';


function App() {
  return (
    <>
      <Router>

        <Navbar />
        <Routes>
          <Route exact path='/' element={< Homepage />}></Route>
          <Route exact path='/login' element={< Login />}></Route>
          <Route exact path='/signup' element={< Signup />}></Route>
          <Route exact path='/chat' element={< ChatPage/>}></Route>
        </Routes>

     

      </Router>
    </>
  );
}

export default App;
