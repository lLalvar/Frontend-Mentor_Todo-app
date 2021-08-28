// Theme icon selectors
const themeBtn = document.querySelector(".moon-icon");
const themeEl = document.querySelector("#theme");

//  Apply the cached theme on reload
const theme = localStorage.getItem("theme");
if (theme) {
  themeEl.classList.replace("light", theme);
}
// Change theme on click
themeBtn.addEventListener("click", () => {
  if (themeEl.classList.contains("light")) {
    themeEl.classList.replace("light", "dark");
    localStorage.setItem("theme", "dark");
  } else {
    themeEl.classList.replace("dark", "light");
    localStorage.setItem("theme", "light");
  }
});

// List item container, input and input btn selectors
const listItems = document.querySelector(".list-items");
const input = document.querySelector(".input");
const inputBtn = document.querySelector(".input-btn");
// Get item from local storage if local storage is empty than select empty array
const existingTodos = JSON.parse(localStorage.getItem("todos")) || [];
const todoData = [];

// Looping through local storage or todoData array
existingTodos.forEach((todo) => {
  addTodo(todo);
});

// Creating todo tasks nad saving to local storage
function addTodo(todoText) {
  todoData.push(todoText);
  const li = document.createElement("li");
  li.setAttribute("draggable", "true");
  li.classList.add("list-item");
  li.innerHTML = todoText;
  listItems.prepend(li);
  localStorage.setItem("todos", JSON.stringify(todoData));
}

// Clear completed
const clearCompeted = document.querySelectorAll(".clear-completed");
clearCompeted.forEach((e) => {
  e.addEventListener("click", () => {
    const circleJs = document.querySelectorAll(".circle-js");
    const li = document.querySelectorAll(".list-item");
    let clearedTodoData = [];
    li.forEach((li) => {
      if (!li.lastElementChild.classList.contains("active-p")) {
        clearedTodoData.push(li.innerHTML);
      }
    });
    localStorage.setItem("todos", JSON.stringify(clearedTodoData)); // save to local storage
    circleJs.forEach((btn) => {
      if (btn.classList.contains("circle-icon-s-active")) {
        btn.closest("li").remove();
        showItemsLeft();
      }
    });
  });
});

// Listen to input button and enter key press
inputBtn.addEventListener("click", function (e) {
  if (input.value) {
    addTodo(`<button type="button" class="check-btn">
    <div class="circle-icon">
      <div class="circle-icon-s-wrapper">
        <img
          class="check-icon"
          src="images/icon-check.svg"
          alt=""
        />
        <div class="circle-icon-s circle-js"></div>
      </div>
    </div>
  </button>
  <p class="list-items-text">${input.value}</p>`);
  }
  input.value = "";
  showItemsLeft();
  colsFun();
});
input.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    inputBtn.click();
  }
});

// Toggle list items active classes
listItems.addEventListener("click", (e) => {
  if (e.target.classList.contains("circle-js")) {
    e.target.classList.toggle("circle-icon-s-active");
    e.target.closest("li").lastElementChild.classList.toggle("active-p");
    showItemsLeft();
  }
});

// Left items count
const itemsLeft = document.querySelectorAll(".items-left");
function showItemsLeft() {
  li = document.querySelectorAll(".list-items-text:not(.active-p)");
  itemsLeft.forEach((item) => {
    item.textContent = `${li.length} items left`;
  });
}
showItemsLeft();

// Toggle filters active classes
const navBtnContainer = document.querySelector(".nav-btns");
const navBtns = document.querySelectorAll(".nav-btn");
navBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    const current = navBtnContainer.getElementsByClassName("active-btn");
    current[0].className = current[0].className.replace("active-btn", "");
    this.className += " active-btn";
    if (btn.classList.contains("active-btn")) {
    }
  });
});

// Filter Active and Completed todo tasks
navBtnContainer.addEventListener("click", (e) => {
  const circleJs = document.querySelectorAll(".circle-js");
  if (e.target.classList.contains("nav-btn")) {
    if (e.target.textContent === "Active") {
      circleJs.forEach((btn) => {
        if (btn.classList.contains("circle-icon-s-active")) {
          btn.closest("li").style.display = "none";
          // console.log(btn.closest("li"));
          showItemsLeft();
        } else {
          btn.closest("li").style.display = "flex";
        }
      });
    } else if (e.target.textContent === "Completed") {
      circleJs.forEach((btn) => {
        if (!btn.classList.contains("circle-icon-s-active")) {
          btn.closest("li").style.display = "none";
          showItemsLeft();
        } else {
          btn.closest("li").style.display = "flex";
        }
      });
    } else {
      circleJs.forEach((btn) => {
        btn.closest("li").style.display = "flex";
      });
    }
  }
});

let dragSrcEl = null;
function handleDragStart(e) {
  dragSrcEl = this;
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/html", this.innerHTML);
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault(); // Necessary. Allows us to drop.
  }

  e.dataTransfer.dropEffect = "move"; // See the section on the DataTransfer object.

  return false;
}

function handleDragEnter(e) {
  // this / e.target is the current hover target.
  this.classList.add("over");
}

function handleDragLeave(e) {
  this.classList.remove("over"); // this / e.target is previous target element.
}

function handleDrop(e) {
  // this/e.target is current target element.
  if (e.stopPropagation) {
    e.stopPropagation(); // Stops some browsers from redirecting.
  }
  // Don't do anything if dropping the same column we're dragging.
  if (dragSrcEl != this) {
    // Set the source column's HTML to the HTML of the column we dropped on.
    dragSrcEl.innerHTML = this.innerHTML;
    this.innerHTML = e.dataTransfer.getData("text/html");
  }
  return false;
}

function colsFun() {
  const cols = document.querySelectorAll(".list-items .list-item");
  [].forEach.call(cols, function (col) {
    col.addEventListener("dragstart", handleDragStart, false);
    col.addEventListener("dragenter", handleDragEnter, false);
    col.addEventListener("dragover", handleDragOver, false);
    col.addEventListener("dragleave", handleDragLeave, false);
    col.addEventListener("drop", handleDrop, false);
    col.addEventListener("dragend", handleDragEnd, false);
  });
  function handleDragEnd(e) {
    // this/e.target is the source node.
    [].forEach.call(cols, function (col) {
      col.classList.remove("over");
    });
  }
}
colsFun();
