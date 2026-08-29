const todoList = [];

renderTodoList();

function renderTodoList() {
  let todoListHTML = "";

  todoList.forEach(function (todoObj, index) {
    const { name, date } = todoObj;
    const html = `
        <div>${name}</div>
        <div>${date}</div>
        <button onclick="
            todoList.splice(${index},1);
            renderTodoList();
        "
        class="delete-todo-button">
        Delete
        </button>
    `;
    todoListHTML += html;
  });
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
