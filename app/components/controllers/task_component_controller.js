import {Controller} from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["attribute"]
  connect() {
    this.handleInsideClick = this.handleInsideClick.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);

    document.addEventListener("click", this.handleInsideClick);
    document.addEventListener("click", this.handleOutsideClick);
  }

  disconnect() {
  }

  handleInsideClick(event) {
    if (this.element.contains(event.target)) {
      this.editAttributes();
    }
  }

  handleOutsideClick(event) {
    if (!this.element.contains(event.target)) {
      this.displayAttributes();
    }
  }

  displayAttributes() {
    this.element.classList.remove("bg-accent");
    this.dispatch("display");
  }

  editAttributes() {
    this.element.classList.add("bg-accent");
    this.dispatch("edit");
  }
}
