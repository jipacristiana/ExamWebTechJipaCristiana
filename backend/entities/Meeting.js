import db from '../dbConfig.js'
import Sequelize from 'sequelize';


const Meeting = db.define("Meeting", 
{
    MeetingId:
    {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    
   MeetingDescription: 
    {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [3,200]
        }
    },

    MeetingURL:
    {
        type: Sequelize.STRING,
        allowNull: false,
        isUrl: true
    },

    MeetingDate: 
    {
        type: Sequelize.DATE,
        allowNull: false
    },
});

export default Meeting;
