import React, {useEffect, useState} from 'react';
import AppRouter from 'components/Router';
import {authService} from "fbase";


function App() {
  
  const [Init, setInit] = useState(false)
  const [UserObj, setUserObj] = useState(null)
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if(user) {
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(args)
        });
      } else {
        setUserObj(null)
      }
      setInit(true)
    } 
    )
  }, [])

  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => user.updateProfile(args)
    })
  }

  return (
    <React.Fragment>
      {Init ? <AppRouter refreshUser={refreshUser} isLoggedIn = {Boolean(UserObj)} userObj={UserObj}/> : "Loading..."}
      <footer>&copy; {new Date().getFullYear()} Twitter</footer>
    </React.Fragment>
  );
}

export default App;
