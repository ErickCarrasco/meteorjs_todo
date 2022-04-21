import React, { useState, Fragment } from 'react';
import { Task } from './Task.jsx';
import { useTracker } from 'meteor/react-meteor-data';
import { TasksCollections } from '/imports/api/TasksCollections';
import { TaskForm } from './TaskForm.jsx';
import { LoginForm } from './LoginForm.jsx';
import {Meteor} from 'meteor/meteor'


const toggleChecked = ({ _id, isChecked }) => {
  /*
  TasksCollections.update(_id, {
    $set: {
      isChecked: !isChecked
    }
  })
  */
 Meteor.call('tasks.setIsChecked', _id, !isChecked);

}

const deleteTask = ({ _id }) => TasksCollections.remove(_id);

export const App = () => {
  
  const user = useTracker(() => Meteor.user())
  const logout = () => Meteor.logout();
  const [hideCompletedTasks, setHideCompletedTasks] = useState(false);
  //const tasks = useTracker(() => TasksCollections.find({}, { sort: { createdAt: -1 } }).fetch());

  const hideCompletedFilter = { isChecked: { $ne: true } }
  const userFilter= user ? {userId: user._id} : {}
  const pendingOnlyFilter ={...hideCompletedFilter, ...userFilter}
  /*
  const tasks = useTracker(() =>
    TasksCollections.find(hideCompletedTasks ? hideCompletedFilter : {}, {
      sort: { createdAt: -1 }
    }).fetch()
  );
    

  const tasks = useTracker(()=>{
    if(!user){
      return [];
    }

    return TasksCollections.find(
      hideCompletedTasks ? pendingOnlyFilter : userFilter,
      {
        sort: { createdAt: -1 },
      }
    ).fetch();
  })
  const pendingTaskCount = useTracker(() =>
    {
      if (!user) {
        return 0;
      }

      return TasksCollections.find(pendingOnlyFilter).count();
    }
  );

  const pendingTaskTitle = `${pendingTaskCount ? `(${pendingTaskCount})` : ''

    }`;
    */

    const {tasks, pendingTasksCount, isLoading} = useTracker(() =>{
      const noDataAvailable = {tasks: [], pendingTasksCount: 0}
      if(!Meteor.user()){
        return noDataAvailable;
      }

      const handler = Meteor.subscribe('tasks');

      if(!handler.ready()){
        return {...noDataAvailable, isLoading:true};
      }

      const tasks = TasksCollections.find(
        hideCompletedTasks ? pendingOnlyFilter : userFilter,
        {
          sort: {createdAt: -1},
        }
      ).fetch();

      const pendingTasksCount = TasksCollections.find(pendingOnlyFilter).count()

      return {tasks, pendingTasksCount}


    })
  
  return (
    <div className="app">
      <header>
        <div className="app-bar">
          <div className="app-header">
            <h1>Das Meteor Machen List {pendingTasksCount}</h1>
          </div>

        </div>
      </header>
      <div className="main">
        {user ? (
          <Fragment>
            <div className="user" onClick={logout}>
              {user.username || user.services.github.name}
            </div>
            <TaskForm  />
            <div className="filter">
              <button onClick={() => setHideCompletedTasks(!hideCompletedTasks)}>
                {hideCompletedTasks ? 'Show all' : 'hide completed tasks'}
              </button>
            </div>
            {isLoading && <div className="loading">Loading...</div>}
            <ul className="tasks">

              {tasks.map(task => <Task key={task._id}
                task={task}
                onCheckboxClick={toggleChecked}
                onDeleteClick={deleteTask}
              />)}
            </ul>

          </Fragment>
        ) : (

          <LoginForm />

        )};

      </div>
    </div>
  )
};
