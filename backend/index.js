import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import db from './dbConfig.js';
import mysql from 'mysql2/promise';
import { DB_USERNAME, DB_PASSWORD } from './Consts.js';
import Meeting from './entities/Meeting.js';
import Participant from './entities/Participant.js';
import LikeOp from './Operators.js';



let app = express();
let router = express.Router();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
app.use('/api', router);


let conn;
mysql.createConnection({
    user: DB_USERNAME,
    password: DB_PASSWORD
})
.then((connection)=>{
    conn = connection
    return connection.query('CREATE DATABASE IF NOT EXISTS Meet')
})
.then(()=>{
    return conn.end();
})
.catch((err)=>{
    console.warn(err.stack);
})


Meeting.hasMany(Participant, {as : "Participants", foreignKey: "MeetingId"});
Participant.belongsTo(Meeting, { foreignKey: "MeetingId"})

db.sync();

//-------------------------- LOGIC FUNCTIONS --------------------------\\


async function createMeeting(meeting) {
    return await Meeting.create(meeting, {include: [{model: Participant, as: "Participants"}]});
}

async function createParticipant(participant){
    return await Participant.create(participant);
}


async function getMeeting() {
    return await Meeting.findAll({include: ["Participants"]});
}

async function getParticipant(){
    return await Participant.findAll();
}


async function getParticipantbyPK(id){
    return await Participant.findByPk(id);
}

async function getMeetingbyId(id) {
    return await Meeting.findByPk(id, {include: ["Participants"]});
}

async function getMeetingbyDescription(description) {
    return await Meeting.findAll({
       where: description ? {MeetingDescription: description} : undefined
    });
    
}


async function updateMeeting(id, meeting){
    if(parseInt(id) !== meeting.MeetingId){
        console.log("Entity id different")
        return;
    }

    let updateEntity = await getMeetingbyId(id);

    if(!updateEntity){
        console.log("There isn't a meeting with this id");
        return;
    }

    return updateEntity.update(meeting);

}

async function updateParticipant(id, participant){
    if(parseInt(id) !== participant.ParticipantId){
        console.log("Entity id different")
        return;
    }

    let updateEntity = await getParticipantbyPK(id);

    if(!updateEntity){
        console.log("There isn't a participant with this id");
        return;
    }

    return updateEntity.update(participant);

}

async function deleteMeeting(id){

    let deleteEntity = await getMeetingbyId(id);

    if(!deleteEntity){
        console.log("There isn't a meeting with this id");
        return;
    }

    return await deleteEntity.destroy();

}

async function deleteParticipant(id){

    let deleteEntity = await getParticipantbyPK(id);

    if(!deleteEntity){
        console.log("There isn't a participant with this id");
        return;
    }

    return await deleteEntity.destroy();

}



async function filterMeeting(filter) {
    let whereClause = {};

    if(filter.meetingURL)
        whereClause.MeetingURL = {[LikeOp] : `%${filter.meetingURL}%`};

    if(filter.meetingDescription)
        whereClause.MeetingDescription = {[LikeOp] : `%${filter.meetingDescription}%`};

    return await Meeting.findAll({
        where: whereClause
    });

}

//----------------------------------------------------------------------\\





//-------------------------- ROUTES --------------------------\\

//will create our table
router.route('/create').get(async (req, res)=>{
    try {
        await db.sync({force : true}) //whenever we call this route will recreate the table
        res.status(201).json({message: 'created'});
    
    } catch (error) {
        console.warn(error.stack);
        res.status(500).json({message: 'server error'});
    }
})


router.route('/meeting').post(async (req, res) =>{
    return res.json(await createMeeting(req.body));
})

router.route('/participant').post(async (req, res) =>{
    return res.json(await createParticipant(req.body));
})




router.route('/meeting').get(async (req, res) =>{
    return res.json(await getMeeting());
})

router.route('/participant').get(async (req, res) =>{
    return res.json(await getParticipant());
})




router.route('/meeting/:id').get(async (req, res) =>{
    return res.json(await getMeetingbyId(req.params.id));
})

router.route('/participant/:id').get(async (req, res) =>{
    return res.json(await getParticipantbyPK(req.params.id));
})





router.route ('/meeting/:id').put(async (req, res)=>{

    res.json(await updateMeeting(req.params.id, req.body));

})

router.route ('/participant/:id').put(async (req, res)=>{

    res.json(await updateParticipant(req.params.id, req.body));

})


router.route ('/meeting/:id').delete(async (req, res)=>{

    res.json(await deleteMeeting(req.params.id));

})

router.route ('/participant/:id').delete(async (req, res)=>{

    res.json(await deleteParticipant(req.params.id));

})


router.route('/meetingFilter').get(async (req, res) =>{
    return res.json(await filterMeeting(req.query));
})

router.route('/meetingSort').get(async (req, res) =>{
    return res.json(await getMeetingbyDescription(req.query.des));
})







let port = process.env.PORT || 8000;
app.listen(port);
console.log(`API is running at ${port}`);