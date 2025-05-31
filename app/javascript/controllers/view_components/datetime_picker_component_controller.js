import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["datetimePicker"]

  connect() {
    document.addEventListener("click", this.outsideClickHandler.bind(this));
  }

  disconnect() {
    document.removeEventListener("click", this.outsideClickHandler.bind(this));
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
    console.log("show", document.activeElement)
    this.datetimePickerTarget.classList.toggle("hidden");
  }

  outsideClickHandler(event) {
    // Check if the click happens outside the datetimePicker or the widget itself
    if (!this.element.contains(event.target)) {
      this.hide();
    }
  }
}
