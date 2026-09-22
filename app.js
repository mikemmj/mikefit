const tasks = document.querySelectorAll(".task");

tasks.forEach((task) => {
  task.addEventListener("click", () => {
    const check = task.querySelector(".check");

    task.classList.toggle("completed");

    if (task.classList.contains("completed")) {
      check.textContent = "✓";
      check.style.background = "#c8f36a";
      check.style.color = "#080c09";
    } else {
      check.textContent = "+";
      check.style.background = "";
      check.style.color = "";
    }
  });
});

const quickButtons = document.querySelectorAll(".quick-grid button");

quickButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const title = button.querySelector("strong").textContent;

    alert(`${title} — Mikefit feature coming next 🚀`);
  });
});
