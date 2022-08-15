import { useEffect, useState } from "react";

import "./App.css";
type ITodo = {
  id?: number;
  todo: string;
  completed: boolean;
};

function App() {
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [search, setSearch] = useState("");
  const [ searchedTodos , setSearchedTodos] = useState([])

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
  function updateTodos(todo: ITodo) {
    let updatedTodo: ITodo = {
      id: todo.id,
      todo: todo.todo,
      // completed: !todo.completed,
      completed:
        todo.completed === true
          ? false
          : todo.completed === false
          ? true
          : true,
    };
    console.log(updatedTodo);
    fetch(`http://localhost:4000/todos/${todo.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTodo),
    })
      .then((resp) => resp.json())
      .then((data) => {
        let newTodos: ITodo[] = structuredClone(updatedTodo);
        //@ts-ignore
        newTodos[todo.id].completed = data.completed;

        setTodos(newTodos);
      });

    // const findTodo: ITodo = newTodos.find((item) => item.id === todo.id);
    // const newUpdatedTodo: ITodo = {
    //   id: todos[todos.length - 1]?.id! + 1,
    //   todo: todo.todo,
    //   completed: !todo.completed,
    // };

    // setTodos(newTodos);
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

  function filteredTodos() {
    const todosClone = structuredClone(todos);
   let filteredTodos = todosClone.filter((todo : ITodo) =>todo.todo.toUpperCase().includes(search.toUpperCase() ));
    setTodos(filteredTodos)
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
            <input
              type="text"
              placeholder="search..."
              onChange={(e) => {
                setSearch(e.target.value);
                filteredTodos()
              }}
            />
          </label>
          <label htmlFor="">
            <input type="text" name="todo" />
            <button>Create</button>
          </label>
        </form>
        <ul>
          {todos.map((todo) => (
            <li
              onClick={() => {
                updateTodos(todo);
              }}
              className={``}
              key={todo.id}
            >
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
