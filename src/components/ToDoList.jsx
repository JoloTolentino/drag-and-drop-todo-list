
import { useEffect, useState } from "react";
import './ToDo.css';

const ToDoHeader = () => {
  return <h1>To Do List</h1>
}

const Button = ({func}) => {
  return <div className='AddButton' onClick = {()=>func()}>Add Task</div>
}

const Input = ({func}) => {
  return <input className="Input" onChange={(e)=>func(e.target.value)}></input>
}

const AddBar = ({InputFunc,ButtonFunc}) => {
  return (<div className="AddBar">
    <Input func = {InputFunc}/>
    <Button func = {ButtonFunc}/>
  </div>
  );
};
const Paper = ({Name, data}) =>{
  return( 
    <div className="Paper">
      <div className="Title">
        <h1>{Name}</h1>
      </div>
      <div className="Data">
          {!data || data == [] ?`No Data`:data.map((element) => 
            <div className= "Row">{element}</div>
          )}
      </div>
    </div>
  );
};


const ToDoList = ({ todos }) => {

  const [item, setItem] = useState(null); 
  const [task,setTask] = useState([]); 

const handleItemChange = (todo) => {
  setItem(todo) 
}


const handleAdd = () =>{
  setTask([...task, item])
}


useEffect(()=>{
  console.log(task)
}, [task])




  return (
    <div className="ToDoContainer">
      <ToDoHeader />
      <AddBar InputFunc={handleItemChange} ButtonFunc={handleAdd}/>
      <div className="ProgressSection">
        <Paper Name ="ToDo" data ={task}/>
        <Paper Name ="InProgress"/>
        <Paper Name ="Done"/>
      </div>
    </div>
  );
};

export default ToDoList;
