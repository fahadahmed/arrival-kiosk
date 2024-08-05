import { useState } from 'react'
import './App.css'

type Todo = {
  id?: string;
  description: string;
  completed: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [task, setTask] = useState<Todo>({
    description: '',
    completed: false
  });

  const completeTask = (todo: Todo) => {
    setTask({
      ...todo,
      completed: !todo.completed
    })
    setTodos([...todos, task])
    console.log(todo)
  }

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    console.log('We are here', task)
    // push the task to todos
    setTodos([...todos, task])

  }
  return (
    <>
      <h1>Arrival Kiosk App</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="task"
          value={task?.description}
          onChange={(e) => setTask({
            id: Math.random().toString(),
            description: e.target.value,
            completed: false
          })} placeholder="What do you want to do?" />
        <button type="submit">Add</button>
      </form>
      {todos?.map(task => (
        <li key={task.id}>
          {task.description}
          <button type="button" onClick={() => completeTask(task)}>Complete</button>
          <button>Delete</button>
        </li>
      ))}
    </>
  )
}

export default App
