import { useEffect, useState } from "react";

import "./App.css";
type ITodo = {
  id?: number;
  todo: string;
  completed: boolean;
};

function App() {
  const [todos, setTodos] = useState<ITodo[]>([]);

  useEffect(() => {
    fetch("http://localhost:4000/todos")
      .then((response) => response.json())
      .then((todosFromServer) => setTodos(todosFromServer));
  }, []);
  function creatingTodo(event: string) {
    let todoPost: ITodo = {
      // id: todos[todos.length - 1].id + 1,
      todo: event,
      completed: false,
    };

    fetch("http://localhost:4000/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todoPost),
    }).then((resp) => {
      resp.json();
    });

    let todo: ITodo = {
      id: todos[todos.length - 1]?.id! + 1,
      todo: event,
      completed: false,
    };

    // let newTodos: ITodo[] = [...todos, todo];
    let newTodos: ITodo[] = structuredClone(todos);
    const LastTodos: ITodo[] = [...newTodos, todo];
    setTodos(LastTodos);
  }
  function deletingTodo(todo: ITodo) {
    console.log(todo);
    fetch(`http://localhost:4000/todos/${todo.id}`, {
      method: "DELETE",
    }).then((resp) => {
      resp.json();
    });

    let newTodos: ITodo[] = structuredClone(todos);

    const lastTodos = newTodos.filter((item) => item.id !== todo.id);

    setTodos(lastTodos);
  }

  return (
    <div className="App">
      <div>
        <form
          action=""
          onSubmit={(event) => {
            event.preventDefault();
            // @ts-ignore
            creatingTodo(event.target.todo.value);
          }}
        >
          <label htmlFor="">
            <input type="text" name="todo" />
            <button>Create</button>
          </label>
        </form>
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>
              {todo.todo}
              <button
                onClick={() => {
                  deletingTodo(todo);
                }}
              >
                delete todo
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
