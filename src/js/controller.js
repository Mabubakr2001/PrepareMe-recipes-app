// Application logic

import "../styles/style.css";
import * as model from "./model.js";
import bookmarksWindowView from "./views/modalWindows/bookmarksWindowView.js";
import checkDeleteWindow from "./views/modalWindows/checkDeleteWindow.js";
import hintWindowView from "./views/modalWindows/hintWindowView.js";
import newRecipeWindowView from "./views/modalWindows/newRecipeWindowView.js";
import paginationView from "./views/paginationView.js";
import recipeView from "./views/recipeView.js";
import resultView from "./views/resultView.js";
import searchView from "./views/searchView.js";

const controlSearchResults = async function () {
  try {
    const query = searchView.getQuery();

    if (!query) return;

    resultView.renderSpinner();

    await model.loadRecipes(query);

    resultView.render(model.getRecipesPerPage());

    paginationView.render(model.state.resultData);
  } catch (error) {
    console.error(error);
  }
};

const controlPagination = function (pageNum) {
  resultView.render(model.getRecipesPerPage(pageNum));
  paginationView.render(model.state.resultData);
};

const controlRecipes = async function () {
  try {
    const recipeId = window.location.hash.slice(1);

    if (!recipeId) return;

    bookmarksWindowView.hideModal();

    recipeView.renderSpinner();

    await model.loadRecipe(recipeId);

    recipeView.render(model.state.recipe);

    resultView.update(model.getRecipesPerPage());

    bookmarksWindowView.update(model.state.bookmarkedRecipes);
  } catch (error) {
    recipeView.renderError();
    console.error(error);
  }
};

const controlServings = function (newServings) {
  model.updateServings(newServings);
  recipeView.update(model.state.recipe);
};

const controlAddBookmarks = function () {
  !model.state.recipe.bookmarked
    ? model.addBookmark(model.state.recipe)
    : model.removeBookmark(model.state.recipe.id);

  recipeView.update(model.state.recipe);

  bookmarksWindowView.render(model.state.bookmarkedRecipes);
};

const controlBookmarks = function () {
  bookmarksWindowView.render(model.state.bookmarkedRecipes);
};

const controlAddNewRecipe = async function (newRecipeData) {
  try {
    hintWindowView.renderSpinner();

    await model.uploadNewRecipe(newRecipeData);

    recipeView.render(model.state.recipe);

    bookmarksWindowView.render(model.state.bookmarkedRecipes);

    window.history.pushState(null, "", `#${model.state.recipe.id}`);

    bookmarksWindowView.update(model.state.bookmarkedRecipes);

    newRecipeWindowView.renderSuccessMessage();

    newRecipeWindowView.clearAllInputs();
  } catch (error) {
    hintWindowView.renderError(error.message);
    console.error(error);
  }
};

const controlDeleteRecipe = async function (recipeId) {
  try {
    checkDeleteWindow.renderSpinner();

    checkDeleteWindow.hideModal();

    await model.deleteRecipe(recipeId);

    window.history.pushState(null, "", "/");
    bookmarksWindowView.render(model.state.bookmarkedRecipes);

    recipeView.renderMessage();

    resultView.update(model.getRecipesPerPage());

    checkDeleteWindow.renderSuccessMessage();
  } catch (error) {
    console.error(error);
  }
};

const init = function () {
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmarkRecipe(controlAddBookmarks);
  bookmarksWindowView.addHandlerRender(controlBookmarks);
  newRecipeWindowView.addHandlerUpload(controlAddNewRecipe);
  checkDeleteWindow.addHandlerDeleteRecipe(controlDeleteRecipe);
};

init();
