const namelist = document.querySelector("#namelist");
let allmeals = [];
const button = document.querySelectorAll(".nav-btn");
const searchingredient= document.querySelector("#searchrecipe")
const search_btn= document.querySelector(".search-btn");

search_btn.addEventListener("click", () => {
  const ingre = searchingredient.value.trim().toLowerCase();

  if (ingre === "") {
    alert("Please enter an ingredient!");
    return;
  }

  searchIngredientByButton(ingre);
});

// ⌨️ Press Enter to search
searchingredient.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    search_btn.click();
  }
});

async function searchIngredientByButton(ingredient) {
  if (ingredient === "") {
    showfullmeals();
    return;
  }

  namelist.innerHTML = "Loading recipes...";

  try {
    // First search by NAME
    let res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${ingredient}`
    );
    let data = await res.json();

    if (data.meals) {
      namelist.innerHTML = "";
      data.meals.forEach(meal => displayMeal(meal));
      return;
    }

    // If not found by name → search by ingredient
    fetchmealsbyingredient(ingredient);

  } catch (error) {
    namelist.innerHTML = "<p>Something went wrong</p>";
  }
}


async function fetchmealsbyingredient(ingredient) {
  namelist.innerHTML = "Loading recipes...";
  allmeals = [];

  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
  );
  const data = await res.json();

  namelist.innerHTML = "";

  if (!data.meals) {
    namelist.innerHTML = "<p>Recipe not found</p>";
    return;
  }

  for (let meal of data.meals) {
    allmeals.push(meal.idMeal);
    getfullrecipe(meal.idMeal);
  }
}

async function showfullmeals() {
  namelist.innerHTML = "Loading recipes...";
  namelist.innerHTML = "";

  // Load 6 random meals
  for (let i = 0; i < 6; i++) {
    const res = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
    const data = await res.json();
    const meal = data.meals[0];

    let ingredients = "";

    for (let j = 1; j <= 20; j++) {
      const ing = meal[`strIngredient${j}`];
      const meas = meal[`strMeasure${j}`];

      if (ing && ing.trim() !== "") {
        ingredients += `<li>${ing} - ${meas}</li>`;
      }
    }

namelist.innerHTML += `
  <div class="meal-card">
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
    
    <div class="meal-overlay">
      <h3>${meal.strMeal}</h3>
      <p>${meal.strArea} Cuisine</p>
      <button onclick="viewRecipe('${meal.idMeal}')">
        View Recipe
      </button>
    </div>
  </div>
`;
  }
}

async function getfullrecipe(id) {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  const data = await res.json();

  const meal = data.meals[0];
  let ingredients = "";

  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const meas = meal[`strMeasure${i}`];

    if (ing && ing.trim() !== "") {
      ingredients += `<li>${ing} - ${meas}</li>`;
    }
  }

namelist.innerHTML += `
  <div class="meal-card">
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
    
    <div class="meal-overlay">
      <h3>${meal.strMeal}</h3>
      <p>${meal.strArea} Cuisine</p>
      <button onclick="viewRecipe('${meal.idMeal}')">
        View Recipe
      </button>
    </div>
  </div>
`;
}


// display full meal when search ny its name not ingredient
function displayMeal(meal) {
  let ingredients = "";

  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const meas = meal[`strMeasure${i}`];

    if (ing && ing.trim() !== "") {
      ingredients += `<li>${ing} - ${meas}</li>`;
    }
  }

namelist.innerHTML += `
  <div class="meal-card">
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
    
    <div class="meal-overlay">
      <h3>${meal.strMeal}</h3>
      <p>${meal.strArea} Cuisine</p>
      <button onclick="viewRecipe('${meal.idMeal}')">
        View Recipe
      </button>
    </div>
  </div>
`;
}

button.forEach((btn) => {
  btn.addEventListener("click", () => {
    button.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  });
});
function viewRecipe(id) {
  window.location.href = `recipe.html?id=${id}`;
}

searchIngredientByButton("");