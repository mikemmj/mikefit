const app = document.querySelector(".app");
const navItems = document.querySelectorAll("nav a");

let water = 1.4;
let completed = 1;
let currentPage = "home";

const pages = {
  home: `
    <header>
      <div>
        <small>MIKEFIT</small>
        <h1>Good afternoon, Mike 👋</h1>
      </div>
      <div class="avatar">M</div>
    </header>

    <main>
      <section class="hero">
        <span>TODAY</span>
        <h2>Keep the streak alive.</h2>
        <p>Small actions today build the body you want tomorrow.</p>

        <div class="streak">
          <strong>7</strong>
          <p>day streak 🔥</p>
        </div>
      </section>

      <section>
        <div class="section-title">
          <h2>Today's plan</h2>
          <span id="completed-count">${completed} of 3</span>
        </div>

        <div class="task" data-task="mobility">
          <div class="check">✓</div>
          <div>
            <strong>Morning mobility</strong>
            <small>10 min • Recovery</small>
          </div>
        </div>

        <div class="task" data-task="strength">
          <div class="check">+</div>
          <div>
            <strong>Full body strength</strong>
            <small>35 min • Beginner</small>
          </div>
        </div>

        <div class="task" data-task="water">
          <div class="check">+</div>
          <div>
            <strong>Hit your water goal</strong>
            <small>${water.toFixed(1)}L of 2.5L</small>
          </div>
        </div>
      </section>

      <section class="stats">
        <div>
          🔥
          <strong>7</strong>
          <small>day streak</small>
        </div>

        <div>
          💧
          <strong>${water.toFixed(1)}L</strong>
          <small>of 2.5L water</small>
        </div>

        <div>
          ⚡
          <strong>320</strong>
          <small>calories planned</small>
        </div>
      </section>

      <section>
        <h2>Quick start</h2>

        <div class="quick-grid">
          <button data-page="workouts">
            🏋️
            <strong>Start workout</strong>
            <small>Build strength</small>
          </button>

          <button data-page="nutrition">
            🥗
            <strong>Log a meal</strong>
            <small>Track nutrition</small>
          </button>

          <button data-page="hydration">
            💧
            <strong>Add water</strong>
            <small>Stay hydrated</small>
          </button>

          <button data-page="progress">
            📈
            <strong>View progress</strong>
            <small>See your journey</small>
          </button>
        </div>
      </section>
    </main>
  `,

  workouts: `
    <header>
      <div>
        <small>WORKOUTS</small>
        <h1>Let's get moving 💪</h1>
      </div>
      <div class="avatar">M</div>
    </header>

    <main>
      <section class="hero">
        <span>BEGINNER</span>
        <h2>Full Body Strength</h2>
        <p>A simple 35-minute workout designed to build strength without overwhelming you.</p>
      </section>

      <section>
        <h2>Today's workout</h2>

        <div class="task">
          <div class="check">1</div>
          <div>
            <strong>Bodyweight Squats</strong>
            <small>3 sets × 10 reps</small>
          </div>
        </div>

        <div class="task">
          <div class="check">2</div>
          <div>
            <strong>Incline Push-ups</strong>
            <small>3 sets × 8 reps</small>
          </div>
        </div>

        <div class="task">
          <div class="check">3</div>
          <div>
            <strong>Glute Bridges</strong>
            <small>3 sets × 12 reps</small>
          </div>
        </div>

        <div class="task">
          <div class="check">4</div>
          <div>
            <strong>Plank</strong>
            <small>3 × 20 seconds</small>
          </div>
        </div>

        <button class="primary-button" id="startWorkout">
          Start workout
        </button>
      </section>
    </main>
  `,

  nutrition: `
    <header>
      <div>
        <small>NUTRITION</small>
        <h1>Fuel your body 🥗</h1>
      </div>
      <div class="avatar">M</div>
    </header>

    <main>
      <section class="hero">
        <span>TODAY</span>
        <h2>Balanced meals.</h2>
        <p>Focus on protein, vegetables, whole foods and enough energy for your training.</p>
      </section>

      <section>
        <h2>Today's meals</h2>

        <div class="task">
          <div class="check">✓</div>
          <div>
            <strong>Breakfast</strong>
            <small>Eggs • Oats • Fruit</small>
          </div>
        </div>

        <div class="task">
          <div class="check">+</div>
          <div>
            <strong>Lunch</strong>
            <small>Chicken • Rice • Vegetables</small>
          </div>
        </div>

        <div class="task">
          <div class="check">+</div>
          <div>
            <strong>Dinner</strong>
            <small>Protein • Carbs • Vegetables</small>
          </div>
        </div>
      </section>

      <section class="stats">
        <div>
          🍗
          <strong>90g</strong>
          <small>protein target</small>
        </div>

        <div>
          🔥
          <strong>1,850</strong>
          <small>daily calories</small>
        </div>

        <div>
          🥬
          <strong>4</strong>
          <small>servings planned</small>
        </div>
      </section>
    </main>
  `,

  hydration: `
    <header>
      <div>
        <small>HYDRATION</small>
        <h1>Stay hydrated 💧</h1>
      </div>
      <div class="avatar">M</div>
    </header>

    <main>
      <section class="hero">
        <span>TODAY</span>
        <h2>${water.toFixed(1)}L / 2.5L</h2>
        <p>Keep sipping throughout the day. Your body performs better when hydrated.</p>
      </section>

      <section>
        <h2>Add water</h2>

        <div class="quick-grid">
          <button data-water="0.25">💧<strong>250ml</strong><small>Small glass</small></button>
          <button data-water="0.5">💧<strong>500ml</strong><small>Bottle</small></button>
          <button data-water="0.75">💧<strong>750ml</strong><small>Large bottle</small></button>
          <button data-water="1">💧<strong>1L</strong><small>Big bottle</small></button>
        </div>
      </section>
    </main>
  `,

  progress: `
    <header>
      <div>
        <small>PROGRESS</small>
        <h1>Your journey 📈</h1>
      </div>
      <div class="avatar">M</div>
    </header>

    <main>
      <section class="hero">
        <span>THIS WEEK</span>
        <h2>You're showing up.</h2>
        <p>Consistency matters more than perfection. Keep building the habit.</p>
      </section>

      <section class="stats">
        <div>
          🔥
          <strong>7</strong>
          <small>day streak</small>
        </div>

        <div>
          🏋️
          <strong>4</strong>
          <small>workouts</small>
        </div>

        <div>
          💧
          <strong>9.8L</strong>
          <small>water logged</small>
        </div>
      </section>

      <section>
        <h2>Weekly activity</h2>

        <div class="task">
          <div class="check">✓</div>
          <div>
            <strong>Monday</strong>
            <small>Strength • Completed</small>
          </div>
        </div>

        <div class="task">
          <div class="check">✓</div>
          <div>
            <strong>Tuesday</strong>
            <small>Mobility • Completed</small>
          </div>
        </div>

        <div class="task">
          <div class="check">✓</div>
          <div>
            <strong>Wednesday</strong>
            <small>Strength • Completed</small>
          </div>
        </div>

        <div class="task">
          <div class="check">+</div>
          <div>
            <strong>Thursday</strong>
            <small>Rest day</small>
          </div>
        </div>
      </section>
    </main>
  `,

  profile: `
    <header>
      <div>
        <small>PROFILE</small>
        <h1>Hey Mike 👋</h1>
      </div>
      <div class="avatar">M</div>
    </header>

    <main>
      <section class="hero">
        <span>MEMBER</span>
        <h2>Mike</h2>
        <p>Your fitness journey starts with one consistent day at a time.</p>
      </section>

      <section>
        <h2>Account</h2>

        <div class="task">
          <div class="check">⚙</div>
          <div>
            <strong>Settings</strong>
            <small>Preferences and notifications</small>
          </div>
        </div>

        <div class="task">
          <div class="check">🔒</div>
          <div>
            <strong>Account security</strong>
            <small>Authentication and password</small>
          </div>
        </div>

        <div class="task">
          <div class="check">?</div>
          <div>
            <strong>Help & support</strong>
            <small>Get help with Mikefit</small>
          </div>
        </div>
      </section>
    </main>
  `
};

function render(page) {
  currentPage = page;

  app.innerHTML = pages[page];

  renderNavigation();

  if (page === "home") {
    setupHome();
  }

  if (page === "hydration") {
    setupHydration();
  }

  if (page === "workouts") {
    setupWorkout();
  }

  document.querySelectorAll("[data-page]").forEach(button => {
    button.addEventListener("click", () => {
      render(button.dataset.page);
    });
  });
}

function renderNavigation() {
  const oldNav = document.querySelector("nav");

  if (oldNav) {
    oldNav.remove();
  }

  const nav = document.createElement("nav");

  const items = [
    ["home", "⌂", "Home"],
    ["workouts", "◈", "Workouts"],
    ["nutrition", "◉", "Nutrition"],
    ["progress", "◒", "Progress"],
    ["profile", "○", "Profile"]
  ];

  items.forEach(([page, icon, name]) => {
    const link = document.createElement("a");

    if (page === currentPage) {
      link.className = "active";
    }

    link.innerHTML = `${icon}<small>${name}</small>`;

    link.addEventListener("click", () => {
      render(page);
    });

    nav.appendChild(link);
  });

  app.appendChild(nav);
}

function setupHome() {
  document.querySelectorAll(".task").forEach(task => {
    task.addEventListener("click", () => {
      const check = task.querySelector(".check");

      if (task.dataset.task === "water") {
        water = Math.min(2.5, water + 0.25);
        render("home");
        return;
      }

      if (check.textContent === "+") {
        check.textContent = "✓";
        check.style.background = "#c8f36a";
        check.style.color = "#080c09";
        completed++;
      } else {
        check.textContent = "+";
        check.style.background = "";
        check.style.color = "";
        completed--;
      }

      const counter = document.querySelector("#completed-count");

      if (counter) {
        counter.textContent = `${completed} of 3`;
      }
    });
  });
}

function setupHydration() {
  document.querySelectorAll("[data-water]").forEach(button => {
    button.addEventListener("click", () => {
      water = Math.min(2.5, water + Number(button.dataset.water));

      render("hydration");
    });
  });
}

function setupWorkout() {
  const button = document.querySelector("#startWorkout");

  if (button) {
    button.addEventListener("click", () => {
      button.textContent = "Workout started ✓";
      button.style.background = "#c8f36a";
      button.style.color = "#080c09";
    });
  }
}

render("home");
