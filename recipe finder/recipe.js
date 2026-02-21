const title = document.getElementById("recipe-title");
const area = document.getElementById("recipe-area");
const img = document.getElementById("recipe-img");
const ingredientList = document.getElementById("ingredient-list");
const instructions = document.getElementById("recipe-instructions");

const params = new URLSearchParams(window.location.search);
const id = params.get("id");
// search-button //
const searchBtn = document.querySelector(".search-btn");
const searchInput = document.getElementById("searchrecipe");

searchBtn.addEventListener("click", () => {
  searchRecipe();
});

searchInput.addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    searchRecipe();
  }
});
async function searchRecipe() {
  const query = searchInput.value.trim();
  if (!query) return;

  let res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
  );
  let data = await res.json();

  if (!data.meals) {
    res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${query}`
    );
    data = await res.json();
  }

  displaySearchResults(data.meals);
}
function displaySearchResults(meals) {

  const container = document.getElementById("search-results");
  const recipeSection = document.querySelector(".recipe-details");
  const relatedSection = document.querySelector(".related-recipes");

  container.innerHTML = "";

  if (!meals) {
    container.innerHTML = "<h2 style='color:black;text-align:center;'>No recipes found 😔</h2>";
  } else {
    meals.forEach(meal => {
      container.innerHTML += `
        <div class="meal-card">
          <img src="${meal.strMealThumb}">
          <div class="meal-overlay">
            <h3>${meal.strMeal}</h3>
            <button onclick="window.location.href='recipe.html?id=${meal.idMeal}'">
              View Recipe
            </button>
          </div>
        </div>
      `;
    });
  }

  // Hide recipe details
  recipeSection.style.display = "none";
  relatedSection.style.display = "none";

  // Show search results
  container.style.display = "grid";
}

//end search button code///

//when click view recipe //
async function loadRecipe() {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  const data = await res.json();
  const meal = data.meals[0];

  title.textContent = meal.strMeal;
  area.textContent = meal.strArea + " Cuisine";
  img.src = meal.strMealThumb;
  instructions.textContent = meal.strInstructions;

  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const meas = meal[`strMeasure${i}`];

    if (ing && ing.trim() !== "") {
      const li = document.createElement("li");
      li.textContent = `${ing} - ${meas}`;
      ingredientList.appendChild(li);
    }
  }

  loadRelated(meal.strCategory);
}

async function loadRelated(category) {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  );
  const data = await res.json();

  const container = document.getElementById("related-container");

  data.meals.slice(0, 3).forEach(meal => {
    container.innerHTML += `
      <div class="meal-card">
        <img src="${meal.strMealThumb}">
        <div class="meal-overlay">
          <h3>${meal.strMeal}</h3>
          <button onclick="window.location.href='recipe.html?id=${meal.idMeal}'">
            View Recipe
          </button>
        </div>
      </div>
    `;
  });
}

loadRecipe();