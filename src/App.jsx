import ToDoList from "./components/ToDoList";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';



function App() {
  return (
    <DndProvider backend = {HTML5Backend}>
      <ToDoList
        todos={[
          { id: 1, text: "buy milk", status: "to-do" },
          { id: 2, text: "wash bike", status: "in-progress" },
          { id: 3, text: "do the budget", status: "done" },
          { id: 4, text: "call jane", status: "to-do" },
        ]}
      />
    </DndProvider>
    
  );
}

export default App;
