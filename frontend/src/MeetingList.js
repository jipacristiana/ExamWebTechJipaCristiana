import {useState, useEffect} from 'react';
import {get, remove} from './Calls.js';
import {Button, Paper, Table, TableBody, TableCell, TableRow, TableContainer, TableHead, IconButton} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import SendSharpIcon from '@material-ui/icons/SendSharp';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import PersonIcon from '@material-ui/icons/Person';
import {meetRoute} from './ApiRoutes.js';
import { useNavigate } from 'react-router-dom';

export default function MeetingList(){
    
    const [rows, setRows] = useState([]);
    const [needUpdate, setNeedUpdate] = useState(false);
    const navigate = useNavigate();

    useEffect(async () => {
        let data = await get(meetRoute);
        setRows(data);
    }, [needUpdate]);

    const deleteMeeting = async(id, index) => {
        await remove(meetRoute, id);

        rows.splice(index, 1);
        setRows(rows);
        setNeedUpdate(!needUpdate);
        alert("Meeting id:" + id + " has been successfully deleted!")
    }

    return(
        <div>

            <h1>Welcome to Meetings Sessions</h1> <br></br>
            <h2>See  your following meetings, add one, edit and delete.</h2>

            <br/>

            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Meeting Id</TableCell>
                            <TableCell align="right">Meeting Description</TableCell>
                            <TableCell align="right">Meeting URL</TableCell>
                            <TableCell align="right">Meeting Date</TableCell>
                            <TableCell align="right">Participants</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => (
                            <TableRow key={row.MeetingId}>
                                <TableCell component="th" scope="row">
                                    {row.MeetingId}
                                </TableCell>
                                <TableCell align='right'>{row.MeetingDescription}</TableCell>
                                <TableCell align='right'>{row.MeetingURL}</TableCell>
                                <TableCell align='right'>{row.MeetingDate}</TableCell>
                                <TableCell align='right'>
                                    <IconButton onClick={() => navigate(`/Participant/${row.MeetingId}`)}>
                                        <PersonIcon />
                                    </IconButton>
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => navigate(`/AddMeeting/${row.MeetingId}`)}>
                                        <EditIcon color="primary" />
                                    </IconButton>
                                    <IconButton onClick={() => deleteMeeting(row.MeetingId, index)}>
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
                            color="dark"
                         startIcon={<AddIcon />}
                         onClick={() => {navigate("AddMeeting")}}
                             >
                              Add a new Meeting
                      </Button>
                     </div>

                     <br></br>
                     <div>
                          <Button
                           id = 'export'
                         startIcon={<SendSharpIcon />}
                         
                             >
                              Import data
                      </Button>
                     </div>

                     <br></br>
                     <div>
                          <Button
                           id= 'import'
                         startIcon={<ImportExportIcon />}
                         
                             >
                              Export data
                      </Button>
                     </div>
        </div>
    )
}