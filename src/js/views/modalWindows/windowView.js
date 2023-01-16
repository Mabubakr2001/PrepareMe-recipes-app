import ViewClass from "../view.js";

export default class WindowView extends ViewClass {
  _overlay = document.querySelector(".overlay");
  _allModals = Array.from(document.querySelectorAll(".modal"));
  _hintMessage = document.querySelector(".hint-message");
  _hintBtn = document.querySelector(".hint-btn");

  showModal() {
    this._parentElement.classList.add("active");
    this._overlay.classList.add("active");
  }

  hideModal() {
    const targetModal = this._allModals.find(modal =>
      modal.classList.contains("active")
    );

    if (!targetModal) return;

    targetModal.classList.remove("active");
    this._overlay.classList.remove("active");
  }

  renderSuccessMessage(successMessage = this._successMessage) {
    const markup = `
        <p class="hint color-green">${successMessage}</p>
    `;

    this._clearHintMessage();

    this._hintMessage.insertAdjacentHTML("afterbegin", markup);
  }

  _clearHintMessage() {
    this._hintMessage.innerHTML = "";
  }

  handleShowModal() {
    this._openModalWindowBtn.addEventListener(
      "click",
      this.showModal.bind(this)
    );
  }

  handleHideModal() {
    this._overlay.addEventListener("click", this.hideModal.bind(this));
    const keyPress = function (keyPress) {
      if (keyPress.key === "Escape") return this.hideModal();
    };
    window.addEventListener("keydown", keyPress.bind(this));
  }

  renderSpinner() {
    const markup = `
        <i class="bx bx-loader-circle upload-spinner"></i>
    `;

    this._clearHintMessage();

    this._hintMessage.insertAdjacentHTML("afterbegin", markup);
  }

  renderError(errorMessage = this._errorMessage) {
    const markup = `
      <div class="error window-error">
        <i class="bx bx-error"></i>
        <p class="error-message">${errorMessage}</p>
      </div>
    `;

    this._clearParentElement();

    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
}
