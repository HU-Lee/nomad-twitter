import { dbService, storageService } from 'fbase'
import React, { useState } from 'react'

function TweetComp({tweetObj, isOwner}) {
    
    const [Editing, setEditing] = useState(false)
    const [NewTweet, setNewTweet] = useState(tweetObj.text)

    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure?")
        if(ok) {
            await dbService.doc(`tweets/${tweetObj.id}`).delete()
            if(tweetObj.attachmentUrl !== "")
                await storageService.refFromURL(tweetObj.attachmentUrl).delete();
        } 
    }

    const toggleEditing = () => setEditing((prev) => !prev)
    const onSubmit = async (e) => {
        e.preventDefault();
        await dbService.doc(`tweets/${tweetObj.id}`).update({
            text: NewTweet
        })
        setEditing(false)
    }
    const onChange = (e) => {
        const {target: {value}} = e;
        setNewTweet(value)
    }


    return (
        <div>
            {Editing ? ( <>
                {isOwner && (
                    <>
                    <form onSubmit={onSubmit}>
                        <input type="text" placeholder="edit it" value={NewTweet} onChange={onChange} equired/>
                        <input type="submit" value="Update Tweet" />
                    </form>
                    <button onClick={toggleEditing}>Cancel</button>
                    </>
                )}
            </>
            ) : (
                <>
                    <h4>{tweetObj.text}</h4>
                    {tweetObj.attachmentUrl && <img src={tweetObj.attachmentUrl} width="50px"/>}
                    {isOwner && (<>
                    <button onClick={onDeleteClick}>Delete Tweet</button>
                    <button onClick={toggleEditing}>Edit Tweet</button>
                    </>)}
                </>
            )}
        </div>
    )
}

export default TweetComp
