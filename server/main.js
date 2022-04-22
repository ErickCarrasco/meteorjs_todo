import { Meteor } from 'meteor/meteor';
import {TasksCollections} from '/imports/api/TasksCollections';
import {Accounts} from 'meteor/accounts-base'
import {ServiceConfiguration} from 'meteor/service-configuration';
import '/imports/api/tasksMethods';
import '/imports/api/tasksPublications';


const SEED_USERNAME = 'meteorite';
const SEED_PASSWORD = 'password';

const insertTask = (taskText, user) =>
  TasksCollections.insert({
    text:taskText,
    userId: user._id,
    createdAt: new Date(),
  })



Meteor.startup(() => {
  // If the Task collection is empty, add some data.
  if(TasksCollections.find().count() === 0){
    [
      'Read about Meteorjs',
      'Install any dependency needed',
      'Add another piece of Ram to the pc'
    ].forEach(insertTask)
  }

  if(!Accounts.findUserByUsername(SEED_USERNAME)){
    Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    });
  }
}



);
ServiceConfiguration.configurations.upsert(
  { service: 'github' },
  {
    $set: {
      loginStyle: 'popup',
      clientId: '18bd5d95486b78afc87a', // insert your clientId here
      secret: '9e06af10e6593457c2d94273ba9c142620a2d690', // insert your secret here
    },
  }
  
  
);
