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
      clientId: '74cbc85a5c0a2368edfe', // insert your clientId here
      secret: '892c2e3f09964232211de49ef08d7125874977d4', // insert your secret here
    },
  }
  
);
