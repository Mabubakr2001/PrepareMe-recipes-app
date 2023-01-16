class SearchView {
  _parentElement = document.querySelector(".search-recipes--form");

  getQuery() {
    const query = this._parentElement.querySelector(
      ".search-recipes--input"
    ).value;
    this._clearSearchInput();
    return query;
  }

  _clearSearchInput() {
    this._parentElement.querySelector(".search-recipes--input").value = "";
  }

  addHandlerSearch(handler) {
    this._parentElement.addEventListener("submit", function (event) {
      event.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
