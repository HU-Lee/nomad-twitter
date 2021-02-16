import { dbService, storageService } from 'fbase';
import React, { useState } from 'react'
import {v4 as uuidv4} from "uuid";

function TweetFactory({ userObj }) {

    const [Tweet, setTweet] = useState("")
    const [Attachment, setAttachment] = useState("")

    const onSubmit = async (e) => {
        e.preventDefault();
        let attachmentUrl = ""
        if(Attachment !== "") {
            const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
            const response = await attachmentRef.putString(Attachment, "data_url")
            attachmentUrl = await response.ref.getDownloadURL();
        }
        const tweetObj = {
            text: Tweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl
        }
        await dbService.collection("tweets").add(tweetObj)
        setTweet("");
        setAttachment("");
    }

    const onChange = (e) => {
        const {target: {value}} = e;
        setTweet(value)
    }

    const onFileChange = (e) => {
        const {target: {files}} = e;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const { currentTarget: { result }} = finishedEvent;
            setAttachment(result)
        }
        reader.readAsDataURL(theFile)
        
    }

    const onClearAttachment = () => setAttachment("")

    return (
        <form onSubmit={onSubmit}>
            <input type="text" onChange={onChange} value={Tweet} 
            placeholder="Message" maxLength={120} />
            <input type="file" accept="image/*" onChange={onFileChange}/>
            <input type="submit" value="Tweet" />
            {Attachment && <div>
                <img src={Attachment} width="50px" height="50px" />
                <button onClick={onClearAttachment}>Clear</button>
            </div>}
        </form>
    )
}

export default TweetFactory
