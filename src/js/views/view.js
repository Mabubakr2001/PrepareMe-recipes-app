// Presentation logic

export default class View {
  _data;

  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;

    const markup = this._generateMarkup();

    this._clearParentElement();

    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  renderSpinner() {
    const spinnerElement = `
        <i class="bx bx-loader-circle loading-spinner"></i>
    `;

    this._clearParentElement();

    this._parentElement.insertAdjacentHTML("afterbegin", spinnerElement);
  }

  renderError(errorMessage = this._errorMessage) {
    const markup = `
      <div class="error">
        <i class="bx bx-error"></i>
        <p>${errorMessage}</p>
      </div>
    `;

    this._clearParentElement();

    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  _clearParentElement() {
    this._parentElement.innerHTML = "";
  }

  update(data) {
    this._data = data;

    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);

    const newElements = Array.from(newDOM.querySelectorAll("*"));
    const oldElements = Array.from(this._parentElement.querySelectorAll("*"));

    newElements.forEach((newElement, index) => {
      const oldElement = oldElements[index];

      if (
        !newElement.isEqualNode(oldElement) &&
        newElement.firstChild?.nodeValue.trim() !== ""
      )
        oldElement.textContent = newElement.textContent;

      if (!newElement.isEqualNode(oldElement))
        Array.from(newElement.attributes).forEach(attribute => {
          oldElement.setAttribute(attribute.name, attribute.value);
        });
    });
  }
}
