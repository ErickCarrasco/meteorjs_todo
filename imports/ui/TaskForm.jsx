import React, {useState} from 'react';
import {Meteor} from 'meteor/meteor';

export const TaskForm = ({user}) =>{
    const [text, setText] = useState("")
    

    const handleSubmit = e =>{
        e.preventDefault();

        if(!text) return;

        /*
        TasksCollections.insert({
            text: text.trim(),
            userId: user._id,
            createdAt: new Date(),
        });
        */
       Meteor.call('tasks.insert', text)

        setText("")
    }

    return(
        <form className="task-form" onSubmit={handleSubmit}>
            <input 
                type="text" 
                placeholder="Type to add a task"  
                value={text} 
                onChange={(e)=>setText(e.target.value)}
            />
            <button type="submit">Add Task</button>
        </form>
    )

}