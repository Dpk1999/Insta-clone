import React, { useEffect, createContext, useReducer, useContext } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import NavBar from "./components/NavBar";
import { Home, Profile, Signin, SignUp, CreatePost } from './components/pages';
import UserProfile from './components/pages/UserProfile'
import { reducer, initialState } from './reducers/userReducer'

export const UserContext = createContext();

const Routing = () => {
  const navigate = useNavigate()
  const { state, dispatch } = useContext(UserContext)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      dispatch({ type: 'USER', payload: user })
    }
    else {
      navigate('/signin')
    }
  }, [])
  return (
    <Routes>
      <Route exact path='/' element={<Home />} />
      <Route path='/profile' exact element={<Profile />} />
      <Route path='/signin' element={<Signin />} />
      <Route path='/signup' element={<SignUp />} />
      <Route path='/createPost' exact element={<CreatePost />} />
      <Route path='/profile/:userid' exact element={<UserProfile />} />
    </Routes>
  )
}
function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <NavBar />
        <Routing />
      </BrowserRouter >
    </UserContext.Provider>
  );
}

export default App;
