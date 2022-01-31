import './App.css';
import MeetingList from './MeetingList';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import AddMeeting from './AddMeeting';
import Participant from './Participant';



function App() {
  return (
    <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element = {<MeetingList/>} />
            <Route path="/AddMeeting" element = {<AddMeeting/>} />
            <Route path="/AddMeeting/:id" element = {<AddMeeting/>} />
            <Route path="/Participant/:id" element = {<Participant/>} />
          </Routes>
        
        </BrowserRouter>
    </div>
  );
}

export default App;
