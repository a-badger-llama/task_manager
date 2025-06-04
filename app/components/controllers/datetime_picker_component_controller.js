import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["datetimePicker", "badge"]

  connect() {
    this.boundOutsideClickHandler = this.outsideClickHandler.bind(this);
    document.addEventListener("click", this.boundOutsideClickHandler);
  }
  disconnect() {
    document.removeEventListener("click", this.boundOutsideClickHandler);
  }

  show() {
    this.datetimePickerTarget.classList.remove("hidden");
  }

  hide() {
    this.datetimePickerTarget.classList.add("hidden");
  }

  toggle() {
    this.datetimePickerTarget.classList.toggle("hidden");
  }

  outsideClickHandler(event) {
    if (!this.element.contains(event.target)) {
      this.hide();
    }
  }
}
