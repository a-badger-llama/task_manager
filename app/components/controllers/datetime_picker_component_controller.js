import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["datetimePicker"]

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
    this.element.blur();
  }

  toggle() {
    this.element.focus();
    this.datetimePickerTarget.classList.toggle("hidden");
  }

  outsideClickHandler(event) {
    // Check if the click happens outside the datetimePicker or the widget itself
    if (!this.element.contains(event.target)) {
      this.hide();
    }
  }
}
