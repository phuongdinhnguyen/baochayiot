const express = require('express');
const taskController = require('../controllers/tasks');

// Router initialisation
const router = express.Router();

// CRUD
// Create (task) POST
router.post('/createTask', taskController.createTask);

// Change status with POST method -----////
router.post('/changeStatus/:title/:status', taskController.changeStatus);
router.post('/updateStatus/:title/', taskController.updateStatus);

// Read (task) GET
router.get('/getTask/:title', taskController.getTask);

// Update (task) PATCH
router.patch('/updateTask/:title', taskController.updateTask);

// Delete (task) DELETE
router.delete('/deleteTask/:title', taskController.deleteTask);

module.exports = router;