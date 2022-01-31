import {useState, useEffect} from 'react';
import {get, remove} from './Calls.js';
import {Button, Paper, Table, TableBody, TableCell, TableRow, TableContainer, TableHead, IconButton} from '@material-ui/core';
import ArrowBackIosTwoToneIcon from '@material-ui/icons/ArrowBackIosTwoTone';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import {participantRoute} from './ApiRoutes.js';
import { useNavigate } from 'react-router-dom';



export default function ParticipantList(){
    
    const [rows, setRows] = useState([]);
    const [needUpdate, setNeedUpdate] = useState(false);
    const navigate = useNavigate();

    useEffect(async () => {
        let data = await get(participantRoute);
        setRows(data);
    }, [needUpdate]);

    const deleteParticipant = async(id, index) => {
        await remove(participantRoute, id);

        rows.splice(index, 1);
        setRows(rows);
        setNeedUpdate(!needUpdate);
        alert("Participant id:" + id + " has been successfully deleted!")
    }

    return(
        <div>

            <h1>Welcome to Meetings Sessions</h1> <br></br>
          

            <br/>
            
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Participant Id</TableCell>
                            <TableCell align="center">Participant Name</TableCell>
                        
                            <TableCell align="center">Edit or Delete</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => (
                            <TableRow key={row.ParticipantId}>
                                <TableCell component="th" scope="row" align="center">
                                    {row.ParticipantId}
                                </TableCell>
                                <TableCell align='center'>{row.ParticipantName}</TableCell>
                                <TableCell align="center">
                                    <IconButton onClick={() => navigate(`/AddParticipant/${row.ParticipantId}`)}>
                                        <EditIcon color="primary" />
                                    </IconButton>
                                    <IconButton onClick={() => deleteParticipant(row.ParticipantId, index)}>
                                        <DeleteIcon color="secondary" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            
            <br></br>
                     <div>
                          <Button
                           variant='contained'
                            color="inherit"
                         startIcon={<ArrowBackIosTwoToneIcon />}
                         onClick={() => {navigate("/")}}
                             >
                              Go back
                      </Button>
                     </div>

        </div>
    )
}