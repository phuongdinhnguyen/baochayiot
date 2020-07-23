const taskSchema = require('../models/tasks');

var ledStatus;

const createTask = (req, res) => {
    const task = new taskSchema({ 
        title: req.body.title,
        status: req.body.status,
        temp: req.body.temp,
        humid: req.body.humid,
        conc: req.body.conc

     });

    task.save().then(() => {
        console.log('Task created');
        res.status(200).json({message: 'Task created'});
    }).catch((err) => {
        res.status(500).json({message: err});
    }); 
};

//change status
const changeStatus = async (req, res) => {
    const taskUpdate = await taskSchema.findOneAndUpdate({title: req.params.title}, {
        $set: {
            title: 'ledCtrl',
            status: req.params.status
        },
    }, {new: true});

    // if (taskUpdate){
    //     res.status(200).json({message: "succesfully updated"});
    // } else {
    //     res.status(500).json({message: "update failed"});
    // }

    res.redirect('/');
};

const updateStatus = async (req, res) => {
    const taskUpdate = await taskSchema.findOneAndUpdate({title: req.params.title}, {
        $set: {
            title: req.params.title,
            status: req.body.val,
            temp: req.body.temp,
            humid: req.body.humid,
            conc: req.body.conc
        },
    }, {new: true});

    // if (taskUpdate){
    //     res.status(200).json({message: "succesfully updated"});
    // } else {
    //     res.status(500).json({message: "update failed"});
    // }

    res.redirect('/');
};



// end of change status

const getTask = (req, res) => {
    taskSchema.find({title: req.params.title}, (err, result) => {
        if (err){
            console.log(err);
            res.status(500).json({message: err});
        } else {
            res.status(200).json(result);
        }
    });
};



//end of status control
const updateTask = async (req, res) => {
    const taskUpdate = await taskSchema.findOneAndUpdate({title: req.params.title}, {
        $set: {
            title: req.body.title,
            status: req.body.status
        },
    }, {new: true});

    if (taskUpdate){
        res.status(200).json({message: "succesfully updated"});
    } else {
        res.status(500).json({message: "update failed"});
    }
};

const deleteTask = async (req, res) => {
    const taskDelete = await taskSchema.findByIdAndDelete({_id: req.params.id});
    if (taskDelete) {
        res.status(200).json({message: 'task deleted'});
    } else {
        res.status(500).json({message: 'could not delete'});
    }
    res.status(200).json({taskId: req.params.id});
};
module.exports = {createTask, getTask, updateTask, deleteTask, changeStatus, updateStatus}