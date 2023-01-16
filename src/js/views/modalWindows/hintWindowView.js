import WindowViewClass from "./windowView.js";

class HintWindowView extends WindowViewClass {
  _parentElement = document.querySelector(".hint-modal");

  constructor() {
    super();
    this.handleHideModal();
  }

  showModal() {
    this._parentElement.classList.add("active");
  }

  hideModal() {
    this._parentElement.classList.remove("active");
  }

  handleHideModal() {
    this._hintBtn.addEventListener("click", this.hideModal.bind(this));
    this._overlay.addEventListener("click", this.hideModal.bind(this));
  }

  renderError(errorMessage) {
    const markup = `
        <p class="hint color-red">${errorMessage}</p>
    `;

    this._clearHintMessage();

    this._hintMessage.insertAdjacentHTML("afterbegin", markup);
  }
}

export default new HintWindowView();
