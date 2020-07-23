const express = require('express');
const tasksRoutes = require('./routes/tasks');
const mongoose = require('mongoose');
const axios = require('axios');
const Mailgun = require('mailgun-js');
const { nextTick } = require('process');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/tasks', tasksRoutes);

/* --------------------------------- Mail gun init --------------------------------- */

var api_key = <MAIL_GUN_API_KEY>;
var domain = <MAIL_GUN_DOMAIN>;
var from_who = 'iot_noti@appnoti.com';

var mailTemplate = ['<h1>Cảnh báo có thể xảy ra cháy!</h1> <h3>Hãy kiểm tra vị trí đặt thiết bị!</h3>',
                '<h3>あの、Em thấy nóng trong người quá a về nhà luôn đi</h3>',
                '<img src ="https://lh3.googleusercontent.com/pw/ACtC-3ccBL_zA1vshdovTwXfrra12woR4rfkjfUn8ZWBQX0LOroKS57DQH1Dq4dAxMbpN9PNGVdmyYvD5eX5HT2bWVKfQa8ZGza_9F42J5hhDcSTezlYpCY-s32Yvp-lhbG9SWgEGY345C13tqFWLynCfNUx=w577-h433-no">'];

var tempNum = Math.floor(Math.random() * 2);

app.get('/submit/:mail', async (req,res,next) => {
    var mailgun = new Mailgun({apiKey: api_key, domain: domain});
    var data = {
        from: 'iot_noti@alarmiot.me',
        to: req.params.mail,
        subject: 'Báo cháy IoT: cảnh báo!',
        html: mailTemplate[tempNum]
    }
    mailgun.messages().send(data, (err, body) => {
        if (err){
            console.log("got an err: ", err);
            res.status(500).json({messages: 'err!'});
        }
        else {
            console.log('submitted!');
            res.status(200).json({messages: 'mail sent successfully!'});
        }
    });
});


/* ---------------------------------End of mailgun --------------------------------- */

var port = process.env.PORT || 5000;                //port connection
mongoose.connect(
    <MONGODB_CONNECT_URI>,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    },
).then(() => {
    http.listen(port, () => { console.log('API is running')});

    app.use(express.static('public'));
    app.get('/', (req,res) => {
        res.sendFile(__dirname + '/index.html');
    });

    var sensorData = [0, 0, 0];
    var count = 0;

    io.sockets.on('connection', function (socket){

        axios.get('http://pdnledctrl.herokuapp.com/api/tasks/getTask/h_t_sensor')
        .then(function(res) {
            console.log(res.data[0]);

            sensorData[0] = res.data[0].temp;
            sensorData[1] = res.data[0].humid;
            sensorData[2] = res.data[0].conc;
        })
        .then(() => {
            io.sockets.emit('sensorData', {sensorData:sensorData});  
            if (count == 0) {
                count++;
                var mailgun = new Mailgun({apiKey: api_key, domain: domain});
                var data = {
                    from: 'iot_noti@alarmiot.me',
                    to: 'bithoix01@gmail.com',
                    subject: 'Báo cháy IoT: cảnh báo!',
                    html: mailTemplate[tempNum]
                }
                mailgun.messages().send(data, (err, body) => {
                    if (err){
                        console.log("got an err: ", err);
                    }
                    else {
                        console.log('submitted!');
                    }
                });
            }
        });
    
    });


}).catch((err) => {
    console.log(err);
});
