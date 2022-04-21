import {Meteor} from 'meteor/meteor';
import { TasksCollections } from './TasksCollections';

Meteor.publish('tasks', function publishTasks(){
    return TasksCollections.find({userId: this.userId});
});

