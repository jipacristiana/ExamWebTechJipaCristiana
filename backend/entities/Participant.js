import db from '../dbConfig.js'
import Sequelize from 'sequelize';


const Participant = db.define("Participant", 
{
    ParticipantId:
    {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },

   ParticipantName: 
    {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [5,200]
        }
    },

    MeetingId:
    {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

export default Participant;
