import ViewClass from "./view.js";

class ResultView extends ViewClass {
  _parentElement = document.querySelector(".recipes-search--results");
  _errorMessage =
    "Sorry, we could not find any recipes for that query. Please try another one!";

  _generateMarkup() {
    const id = window.location.hash.slice(1);
    return this._data
      .map(pieceOfData => {
        return `
      <li>
        <a href="#${pieceOfData.id}" class="recipe ${
          pieceOfData.id === id && "recipe-active"
        }">
          <img src="${pieceOfData.imgURL}" alt="" class="recipe-img" />
          <div class="sub-recipe--view">
            <h4 class="sub-recipe--name">${pieceOfData.title}</h4>
            <span class="recipe-publisher">${pieceOfData.publisher}</span>
          </div>
          <i class="bx bxs-user user-generated ${
            pieceOfData.key ? "" : "hidden"
          }"></i>
        </a>
      </li>
    `;
      })
      .join("");
  }
}

export default new ResultView();
