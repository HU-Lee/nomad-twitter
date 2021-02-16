import { authService, dbService } from 'fbase'
import React, { useEffect, useState } from 'react'

function Profile({ refreshUser, userObj }) {

    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

    const onLogOutClick = () => {
        authService.signOut();
    }

    const getMyTweets = async() => {
        const tweets = await dbService.collection("tweets")
        .where("creatorId", "==", userObj.uid)
        .orderBy("createdAt").get()
    }

    useEffect(() => {
        getMyTweets();
    }, [])

    const onChange = (event) => {
      const {
        target: { value },
      } = event;
      setNewDisplayName(value);
    };
    const onSubmit = async (event) => {
      event.preventDefault();
      if (userObj.displayName !== newDisplayName) {
        await userObj.updateProfile({
          displayName: newDisplayName,
        });
        refreshUser();
      }
    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input
                onChange={onChange}
                type="text"
                placeholder="Display name"
                value={newDisplayName}
                />
                <input type="submit" value="Update Profile" />
            </form>
            <button onClick={onLogOutClick}>Log Out</button>
        </div>
    )
}

export default Profile
