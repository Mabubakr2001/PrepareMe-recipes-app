import ViewClass from "./view.js";

class PaginationView extends ViewClass {
  _parentElement = document.querySelector(".pagination");

  addHandlerClick(handler) {
    this._parentElement.addEventListener("click", function (event) {
      const clickedBtn = event.target.closest(".pagination-btn");
      if (!clickedBtn) return;
      const { goTo } = clickedBtn.dataset;
      handler(+goTo);
    });
  }

  _generateMarkup() {
    const currentPage = this._data.page;
    const numOfPages = Math.ceil(
      this._data.recipes.length / this._data.recipesPerPage
    );
    if (currentPage === 1 && numOfPages > 1)
      return `${this._generateCurrentPageHint(
        currentPage
      )}${this._generateMarkupButton(currentPage, "up")}`;

    if (currentPage < numOfPages)
      return `${this._generateMarkupButton(
        currentPage,
        "down"
      )}${this._generateCurrentPageHint(
        currentPage
      )}${this._generateMarkupButton(currentPage, "up")}`;

    if (currentPage === numOfPages && currentPage > 1)
      return `${this._generateCurrentPageHint(
        currentPage
      )}${this._generateMarkupButton(currentPage, "down")}`;

    return "";
  }

  _generateMarkupButton(currentPage, upOrDown) {
    const upOrDownLower = upOrDown.toLowerCase();
    if (upOrDownLower === "up")
      return `
        <button class="pagination-btn next-page--btn" title="Next page" data-go-to=${
          currentPage + 1
        }>
          Page
          <span class="page-num next-page--num">${currentPage + 1}</span
          ><i class="bx bx-right-arrow-alt"></i>
        </button>
      `;

    if (upOrDownLower === "down")
      return `
          <button class="pagination-btn previous-page--btn" title="Previous page" data-go-to=${
            currentPage - 1
          }>
            <i class="bx bx-left-arrow-alt"></i> Page
            <span class="page-num previous-page--num">${currentPage - 1}</span>
          </button>
        `;
  }

  _generateCurrentPageHint(currentPage) {
    return `<span class="current-page--num">${currentPage}</span>`;
  }
}

export default new PaginationView();
