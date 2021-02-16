import TweetComp from 'components/Tweet';
import TweetFactory from 'components/TweetFactory';
import { dbService } from 'fbase';
import React, { useEffect, useState } from 'react';

function Home({ userObj }) {

    const [Tweet, setTweet] = useState("")
    const [Tweets, setTweets] = useState([])
    const [Attachment, setAttachment] = useState("")

    useEffect(() => {
        dbService.collection("tweets").onSnapshot(snapshot => {
            const tweetArray = snapshot.docs.map(doc => ({
                id: doc.id, ...doc.data(),
            }))
            setTweets(tweetArray)
        })
    }, [])
    

    return (
        <div>
            <TweetFactory userObj={userObj}/>
            <div>
                {Tweets.map(tweet => (
                    <TweetComp key={tweet.id} tweetObj={tweet} isOwner={tweet.creatorId === userObj.uid}/>
                ))}
            </div>
        </div>
    )
}

export default Home
