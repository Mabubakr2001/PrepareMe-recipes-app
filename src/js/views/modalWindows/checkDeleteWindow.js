import hintWindowView from "./hintWindowView.js";
import WindowViewClass from "./windowView.js";

class CheckDeleteWindow extends WindowViewClass {
  _parentElement = document.querySelector(".delete-check");
  _successMessage = "The recipe was successfully deleted ✅";

  addHandlerDeleteRecipe(handler) {
    this._parentElement.addEventListener("click", event => {
      const clickedBtn = event.target.closest(".check-btn");
      if (!clickedBtn) return;
      if (clickedBtn.classList.contains("no-btn")) return this.hideModal();
      handler(window.location.hash.slice(1));
      hintWindowView.showModal();
    });
  }

  hideModal() {
    this._parentElement.classList.remove("active");
    this._overlay.classList.remove("active");
  }
}

export default new CheckDeleteWindow();
