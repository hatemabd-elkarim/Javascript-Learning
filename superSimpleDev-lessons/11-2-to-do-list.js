const todoList = [];

renderTodoList();

function renderTodoList() {
  let todoListHTML = "";

  for (let i = 0; i < todoList.length; i++) {
    const todoObj = todoList[i];
    const { name, date } = todoObj;
    const html = `
        <div>${name}</div>
        <div>${date}</div>
        <button onclick="
            todoList.splice(${i},1);
            renderTodoList();
        "
        class="delete-todo-button">
        Delete
        </button>
    `;
    todoListHTML += html;
  }
  document.querySelector(".js-todo-list").innerHTML = todoListHTML;
}
function addTodo() {
  const nameInputElement = document.querySelector(".js-name-input");
  const name = nameInputElement.value;

  const dateInputElement = document.querySelector(".js-date-input");
  const date = dateInputElement.value;

  todoList.push({
    name,
    date,
  });

  nameInputElement.value = "";
  dateInputElement.value = "";
  renderTodoList();
}
