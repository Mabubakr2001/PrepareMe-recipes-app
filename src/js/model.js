// Business logic
import { API_KEY, API_URL, RECIPES_PER_PAGE } from "./config.js";
import { AJAXCall } from "./helpers.js";

export const state = {
  resultData: {
    query: "",
    recipes: [],
    page: 1,
    recipesPerPage: RECIPES_PER_PAGE,
  },
  recipe: {},
  bookmarkedRecipes: [],
};

export const loadRecipes = async function (query) {
  try {
    if (state.resultData.page > 1) state.resultData.page = 1;

    const serverResponseData = await AJAXCall(
      `${API_URL}?search=${query}&key=${API_KEY}`
    );

    state.resultData.query = query;

    state.resultData.recipes = serverResponseData.data.recipes.map((recipe) => {
      return {
        id: recipe.id,
        imgURL: recipe.image_url,
        publisher: recipe.publisher,
        title: recipe.title,
        ...(recipe.key && { key: recipe.key }),
      };
    });
  } catch (error) {
    throw error;
  }
};

export const getRecipesPerPage = function (pageNum = state.resultData.page) {
  state.resultData.page = pageNum;
  const startPoint = (pageNum - 1) * state.resultData.recipesPerPage; // (3 - 1) * 10 = 20
  const endPoint = pageNum * state.resultData.recipesPerPage; // 3 * 10 = 30
  return state.resultData.recipes.slice(startPoint, endPoint);
};

const createNewRecipeObject = function (oldData) {
  const { recipe } = oldData.data;
  return {
    id: recipe.id,
    publisher: recipe.publisher,
    title: recipe.title,
    imgURL: recipe.image_url,
    sourceURL: recipe.source_url,
    servings: recipe.servings,
    ingredients: recipe.ingredients,
    cookingTime: recipe.cooking_time,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (recipeID) {
  try {
    const serverResponseData = await AJAXCall(
      `${API_URL}${recipeID}?key=${API_KEY}`
    );
    state.recipe = createNewRecipeObject(serverResponseData);

    state.bookmarkedRecipes.some(
      (bookmarkedRecipe) => bookmarkedRecipe.id === recipeID
    )
      ? (state.recipe.bookmarked = true)
      : (state.recipe.bookmarked = false);
  } catch (error) {
    throw error;
  }
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach((ingredient) => {
    // newQt = (oldQt * newServings) / oldServings -> (2 * 8) / 4 = 4
    // newQt = (oldQt * newServings) / oldServings -> (4 * 10) / 8 = 5
    ingredient.quantity =
      (ingredient.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem(
    "bookmarkedRecipes",
    JSON.stringify(state.bookmarkedRecipes)
  );
};

export const addBookmark = function (choosenRecipe) {
  const bookmarkedBefore = state.bookmarkedRecipes.find(
    (bookmarkedRecipe) => bookmarkedRecipe.id === choosenRecipe.id
  );

  if (!bookmarkedBefore) state.bookmarkedRecipes.push(choosenRecipe);

  if (state.recipe.id === choosenRecipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const removeBookmark = function (choosenRecipeID) {
  const targetRecipe = state.bookmarkedRecipes.findIndex(
    (bookmarkedRecipe) => bookmarkedRecipe.id === choosenRecipeID
  );

  state.bookmarkedRecipes.splice(targetRecipe, 1);

  if (state.recipe.id === choosenRecipeID) state.recipe.bookmarked = false;

  state.bookmarkedRecipes.length > 0
    ? persistBookmarks()
    : localStorage.removeItem("bookmarkedRecipes");
};

export const uploadNewRecipe = async function (newRecipeData) {
  try {
    const ingredients = Object.entries(newRecipeData)
      .filter((entry) => entry.at(0).startsWith("ing") && entry.at(1) !== "")
      .map((ingredient) => {
        const ingredientChunksArr = ingredient
          .at(1)
          .split(",")
          .map((ingredientChunk) => ingredientChunk.trim());
        if (ingredientChunksArr.length !== 3)
          throw new Error(
            "Wrong ingredient format. Please use the correct format 💥"
          );
        const [quantity, unit, description] = ingredientChunksArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipeToUpload = {
      title: newRecipeData.title,
      source_url: newRecipeData.sourceURL,
      image_url: newRecipeData.image,
      publisher: newRecipeData.publisher,
      cooking_time: +newRecipeData.prepTime,
      servings: +newRecipeData.servings,
      ingredients: ingredients,
    };

    Object.entries(recipeToUpload).forEach((data) => {
      if (Boolean(data.at(1)) === false)
        throw new Error(`Please put some data in the ${data.at(0)} 💥`);
      if (
        Boolean(data.at(1)) !== false &&
        Array.isArray(data.at(1)) &&
        data.at(1).length === 0
      )
        throw new Error(
          "Please put at least one ingredient! It's a recipe, you know 💥"
        );
    });

    const serverResponseData = await AJAXCall(
      `${API_URL}?key=${API_KEY}`,
      recipeToUpload
    );

    state.recipe = createNewRecipeObject(serverResponseData);
    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
};

export const deleteRecipe = async function (choosenRecipeID) {
  await fetch(`${API_URL}${choosenRecipeID}?key=${API_KEY}`, {
    method: "DELETE",
  });

  state.bookmarkedRecipes.forEach((recipe, index) => {
    if (recipe.id === choosenRecipeID) {
      state.bookmarkedRecipes.splice(index, 1);
      state.bookmarkedRecipes.length > 0
        ? persistBookmarks()
        : localStorage.removeItem("bookmarkedRecipes");
    }
  });

  state.resultData.recipes.forEach((recipe, index) => {
    if (recipe.id === choosenRecipeID)
      state.resultData.recipes.splice(index, 1);
  });
};

const init = function () {
  const storage = localStorage.getItem("bookmarkedRecipes");
  if (storage) state.bookmarkedRecipes = JSON.parse(storage);
};

init();
