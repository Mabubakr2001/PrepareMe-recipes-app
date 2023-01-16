import WindowViewClass from "./windowView.js";

class BookmarksWindowView extends WindowViewClass {
  _parentElement = document.querySelector(".bookmarked-recipes--modal");
  _openModalWindowBtn = document.querySelector(".main-btn--show---bookmarks");
  _errorMessage =
    "There are no bookmarks yet. Find a nice recipe and bookmark it!";

  constructor() {
    super();
    this.handleShowModal();
    this.handleHideModal();
  }

  addHandlerRender(handler) {
    window.addEventListener("load", handler);
  }

  _generateMarkup() {
    const id = window.location.hash.slice(1);
    return this._data
      .map(pieceOfData => {
        return `
      <div class="bookmarked-recipe--content ${
        pieceOfData.id === id ? "recipe-active" : ""
      }">
        <div class="recipe bookmarked-recipe">
          <img src="${pieceOfData.imgURL}" alt="" class="recipe-img" />
          <div class="sub-recipe--view bookmarked-sub--recipe---view">
            <h4 class="sub-recipe--name">${pieceOfData.title}</h4>
            <span class="recipe-publisher">${pieceOfData.publisher}</span>
          </div>
          <i class="bx bxs-user user-generated ${
            pieceOfData.key ? "" : "hidden"
          }"></i>
        </div>
        <a href="#${pieceOfData.id}" class="see-recipe">See Recipe</a>
      </div>
      `;
      })
      .join("");
  }
}

export default new BookmarksWindowView();
