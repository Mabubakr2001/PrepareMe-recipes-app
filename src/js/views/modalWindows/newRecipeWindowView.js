import hintWindowView from "./hintWindowView.js";
import WindowViewClass from "./windowView.js";

class NewRecipeWindowView extends WindowViewClass {
  _parentElement = document.querySelector(".new-recipe--modal");
  _allForms = document.querySelectorAll(".new-recipe--data");
  _openModalWindowBtn = document.querySelector(".main-btn--add---recipe");
  _successMessage = "The recipe was successfully uploaded 🎉";

  constructor() {
    super();
    this.handleShowModal();
    this.handleHideModal();
  }

  addHandlerUpload(handler) {
    const allFormsArr = Array.from(this._allForms);
    this._parentElement.addEventListener("click", function (event) {
      const clickedBtn = event.target.closest(".upload-btn");
      if (!clickedBtn) return;
      const allEntriesArr = [];
      allFormsArr.forEach(form => {
        allEntriesArr.push(...new FormData(form));
      });
      const data = Object.fromEntries(allEntriesArr);
      handler(data);
      hintWindowView.showModal();
    });
  }

  clearAllInputs(formsArr = this._allForms) {
    formsArr.forEach(form => {
      form.querySelectorAll("input").forEach(input => (input.value = ""));
    });
  }
}

export default new NewRecipeWindowView();
