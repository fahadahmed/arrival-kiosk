import { useEffect, useState } from 'react';
import './App.css';
import createDatabase from './utils/db';

type Todo = {
  id?: string;
  description: string;
  completed: boolean;
};

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState<string>('');
  const [filter, setFilter] = useState<string>('all');
  const [db, setDb] = useState<any>(null);

  useEffect(() => {
    const initDb = async () => {
      const database = await createDatabase();
      setDb(database);

      const todosFromDb = await database.todos.find().exec();
      setTodos(todosFromDb.map((todo: any) => todo.toJSON()));
    };

    initDb();
  }, []);

  const completeTask = async (todo: Todo) => {
    const updatedTodo = { ...todo, completed: !todo.completed };
    await db.todos.upsert(updatedTodo);
    setTodos(todos.map(t => t.id === todo.id ? updatedTodo : t));
  };

  const deleteTask = async (todo: Todo) => {
    const todoDoc = await db.todos.findOne(todo.id).exec();
    await todoDoc.remove();
    setTodos(todos.filter(t => t.id !== todo.id));
  };

  const addTask = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (text !== '') {
      const newTask = {
        id: Math.random().toString(),
        description: text,
        completed: false,
      };
      await db.todos.upsert(newTask);
      setTodos([...todos, newTask]);
      setText('');
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'notCompleted') return !todo.completed;
    return true;
  });

  return (
    <>
      <h1>Arrival Kiosk App</h1>
      <form onSubmit={addTask} className="add-form">
        <input
          type="text"
          name="task"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What do you want to do?"
          className="add-task-input"
        />
        <button type="submit">Add</button>
      </form>
      <div className="filters">
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
        <button onClick={() => setFilter('notCompleted')}>Not Completed</button>
      </div>
      <div>
        {filteredTodos.map(task => (
          <div key={task.id} className="todo-item">
            <span className={task.completed ? 'completed' : ''}>{task.description}</span>
            <button type="button" onClick={() => completeTask(task)}>
              {task.completed ? '⎌' : '✅'}
            </button>
            <button type="button" onClick={() => deleteTask(task)}>🗑️</button>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
