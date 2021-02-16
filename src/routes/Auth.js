import { authService, firebaseInstance } from 'fbase'
import React, { useState } from 'react'


function Auth() {
    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")
    const [NewAccount, setNewAccount] = useState(true)
    const [Error, setError] = useState("")

    const onChange = (e) => {
        const {target: {name, value}} = e;
        if(name === "email") {
            setEmail(value)
        } else if(name === "password") {
            setPassword(value)
        }
    }

    const onSubmit = async(e) => {
        e.preventDefault();
        try {
            if(NewAccount) {
                await authService.createUserWithEmailAndPassword(Email, Password)
            } else {
                await authService.signInWithEmailAndPassword(Email, Password)
            }
        } catch(error) {
            setError(error.message)
        }
    }

    const toggleAccount = () => setNewAccount(prev => !prev);

    const onSocialClick = async (e) => {
        const { target: {name}} = e;
        let provider;
        if(name === "google") {
            provider = new firebaseInstance.auth.GoogleAuthProvider();
        } else if (name === "github") {
            provider = new firebaseInstance.auth.GithubAuthProvider();
        }

        await authService.signInWithPopup(provider);
    }

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input name="email" type="email" placeholder="Email" 
                required value={Email}
                onChange={onChange}/>
                <input name="password" type="password" placeholder="Password"
                required value={Password}
                onChange={onChange}/>
                <input type="submit" value={NewAccount ? "Create Account" : "Log In"} />
                {Error}
            </form>
            <span onClick={toggleAccount}>{NewAccount ? "Log In" : "Create Account"}</span>
            <div>
                <button onClick={onSocialClick} name="google">Continue with Google</button>
                <button onClick={onSocialClick} name="github">Continue with Github</button>
            </div>
        </div>
    )
}

export default Auth