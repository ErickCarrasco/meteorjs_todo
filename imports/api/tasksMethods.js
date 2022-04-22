import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { TasksCollections } from './TasksCollections';
 
Meteor.methods({
  'tasks.insert'(text) {
    check(text, String);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    TasksCollections.insert({
      text,
      userId: this.userId,
      createdAt: new Date,
    })
  },

  'tasks.remove'(taskId) {
    check(taskId, String);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }
    const task = TasksCollections.findOne({_id: taskId, userId: this.userId})

    if(!task){
        throw new Meteor.error('Access denied')
    }
    TasksCollections.remove(taskId);
  },

  'tasks.setIsChecked'(taskId, isChecked) {
    check(taskId, String);
    check(isChecked, Boolean);
 
    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const task = TasksCollections.findOne({_id: taskId, userId: this.userId})
    if(!task){
        throw new Meteor.error('Access denied')
    }

    TasksCollections.update(taskId, {
      $set: {
        isChecked
      }
    });
  }
});