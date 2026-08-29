const todoList = [];

renderTodoList();

function renderTodoList() {
  let todoListHTML = "";

  todoList.forEach(function (todoObj, index) {
    const { name, date } = todoObj;
    const html = `
        <div>${name}</div>
        <div>${date}</div>
        <button
        class="delete-todo-button js-delete-todo-button">
        Delete
        </button>
    `;
    todoListHTML += html;
  });
  document.querySelector(".js-todo-list").innerHTML = todoListHTML;
  document
    .querySelectorAll(".js-delete-todo-button")
    .forEach((deleteButton, index) => {
      deleteButton.addEventListener("click", () => {
        todoList.splice(index, 1);
        renderTodoList();
      });
    });
}

document
  .querySelector(".js-add-todo-button")
  .addEventListener("click", addTodo); // look how we passed the name of the callback only not the return after calling it

document.body.addEventListener("keydown", (event) => {
  if ((event.key === "Enter")) {
    addTodo();
  }
});

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
