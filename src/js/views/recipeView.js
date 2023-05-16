import { Fraction } from "fractional";
import icons from "../../assets/imgs/icons.svg";
import checkDeleteWindow from "./modalWindows/checkDeleteWindow.js";
import ViewClass from "./view.js";

class RecipeView extends ViewClass {
  _parentElement = document.querySelector(".right-side");
  _message = "Start by searching for a recipe or an ingredient. Have fun!";
  _errorMessage =
    "Sorry, we could not find that recipe. Please try another one!";

  constructor() {
    super();
    this.handleOpenDeleteWindow();
  }

  addHandlerRender(handler) {
    ["hashchange", "load"].forEach((event) =>
      window.addEventListener(event, handler)
    );
  }

  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener("click", function (event) {
      const clickedBtn = event.target.closest(".update-btn");
      if (!clickedBtn) return;
      const { updateTo } = clickedBtn.dataset;
      if (+updateTo > 0) handler(+updateTo);
    });
  }

  addHandlerBookmarkRecipe(handler) {
    this._parentElement.addEventListener("click", function (event) {
      const clickedBtn = event.target.closest(".bookmark-recipe--btn");
      if (!clickedBtn) return;
      handler();
    });
  }

  handleOpenDeleteWindow() {
    this._parentElement.addEventListener("click", (event) => {
      const clickedBtn = event.target.closest(".delete-btn");
      if (!clickedBtn) return;
      checkDeleteWindow.showModal();
    });
  }

  _generateMarkup() {
    return `
    <div class="main-recipe--view">
    <img src="${this._data.imgURL}" alt="" class="main-recipe--img" />
    <h1 class="main-recipe--name">
      ${this._data.title}
    </h1>
  </div>
  <div class="handle-recipe">
    <div class="handle handle-prep--minutes">
      <i class="bx bx-time-five"></i>
      <span class="handle-data handle-data--time">${
        this._data.cookingTime
      }</span>
      <span class="handle-text handle-text--time">Minutes</span>
    </div>
    <div class="handle handle-servings">
      <i class="bx bx-group"></i>
      <span class="handle-data handle-data--servings">${
        this._data.servings
      }</span>
      <span class="handle-text handle-text--servings">Servings</span>
      <div class="update-servings--btns">
        <i class="bx bx-minus-circle update-btn subtract-btn" data-update-to="${
          this._data.servings - 1
        }"></i>
        <i class="bx bx-plus-circle update-btn add-btn" data-update-to="${
          this._data.servings + 1
        }"></i>
      </div>
    </div>
    <div class="others">
      <i class="bx bxs-user user-generated ${
        this._data.key ? "" : "hidden"
      }"></i>
      <button class="bookmark-recipe--btn">
        <svg fill="#fff" width="32px" height="32px">
          <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? "--fill" : ""
    }"></use>
        </svg>
      </button>
    </div>
  </div>
  <div class="recipe-ingredients">
    <h1 class="heading-1">Recipe Ingredients</h1>
    <ul class="ingredients-content">
      ${this._data.ingredients.map(this._generateMarkupIngredient).join("")}
    </ul>
  </div>
  <div class="how-to--cook">
    <h1 class="heading-1">More about the recipe</h1>
    <p>
      This recipe was carefully designed and tested by
      <span class="publisher">${this._data.publisher}</span>. Please check out
      directions at their website.
    </p>
    <div class="btns-more">
      <a
        href="${this._data.sourceURL}"
        class="btn-more directions-btn"
        target="_blank"
        rel="noopener noreferrer"
      >
        Directions <i class="bx bx-right-arrow-alt directions-btn--icon"></i>
      </a>
      ${
        this._data.key
          ? `<button class="btn-more delete-btn">
                Delete recipe <i class="fa-solid fa-trash"></i>
            </button>`
          : ""
      }
    </div>
  </div>
    `;
  }

  _generateMarkupIngredient(ingredient) {
    return `
    <li class="recipe-ingredient">
      <i class="fa-solid fa-check"></i>
      <span class="recipe-quantity">${
        ingredient.quantity
          ? new Fraction(ingredient.quantity.toFixed(1)).toString()
          : ""
      }</span>
      <div class="recipe-description">
        <span class="recipe-unit">${ingredient.unit}</span>
        ${ingredient.description}
      </div>
    </li>
    `;
  }

  renderMessage(message = this._message) {
    const markup = `
    <div class="message">
      <i class="fa-regular fa-face-smile-wink"></i>
      <p>${message}</p>
    </div>
  `;

    this._clearParentElement();

    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
}

export default new RecipeView();
