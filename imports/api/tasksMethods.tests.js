import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { TasksCollections } from '/imports/api/TasksCollections';
import { mockMethodCall } from 'meteor/quave:testing';
import { assert } from 'chai';
import '/imports/api/tasksMethods';

if (Meteor.isServer) {
  describe('Tasks', () => {
    describe('methods', () => {
      //it('can delete owned task', () => {});
      const userId = Random.id();
      let taskId;
      beforeEach(()=>{
          TasksCollections.remove({});
          taskId =  TasksCollections.insert({
              text: 'Test Task',
              userId,
              createdAt: new Date(),
          })
      });

      it('can delete owned task', () => {
        mockMethodCall('tasks.remove', taskId, { context: { userId } });

        assert.equal(TasksCollections.find().count(), 0);
      });

      it(`can't delete task without an user authenticated`, () => {
        const fn = () => mockMethodCall('tasks.remove', taskId);
        assert.throw(fn, /Not authorized/);
        assert.equal(TasksCollections.find().count(), 1);
      });

      it(`can't delete task from another owner`, () => {
        const fn = () =>
          mockMethodCall('tasks.remove', taskId, {
            context: { userId: 'somebody-else-id' },
          });
          
        assert.equal(TasksCollections.find().count(), 1);
      });

      it('can change the status of a task', () => {
        const originalTask = TasksCollections.findOne(taskId);
        mockMethodCall('tasks.setIsChecked', taskId, !originalTask.isChecked, {
          context: { userId },
        });

        const updatedTask = TasksCollections.findOne(taskId);
        assert.notEqual(updatedTask.isChecked, originalTask.isChecked);
      });

      it('can insert new tasks', () => {
        const text = 'New Task';
        mockMethodCall('tasks.insert', text, {
          context: { userId },
        });

        const tasks = TasksCollections.find({}).fetch();
        assert.equal(tasks.length, 2);
        assert.isTrue(tasks.some(task => task.text === text));
      });

    });
  });
}