import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function RoomList(){
  const [rooms, setRooms] = useState([]);
  useEffect(()=> {
    axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/rooms`)
      .then(r=>setRooms(r.data)).catch(()=>{});
  }, []);
  return (
    <div style={{maxWidth:900, margin:'20px auto'}}>
      <h3>Available Rooms</h3>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
        {rooms.map(r=>(
          <div key={r._id} style={{padding:12, background:'#fff', borderRadius:8}}>
            <h4>{r.name}</h4>
            <p>{r.location}</p>
            <p>Capacity: {r.capacity}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
