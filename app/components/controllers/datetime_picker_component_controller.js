import {Controller} from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["datetimePicker"]
  static values = { open: {type: Boolean, default: false} }

  connect() {
    this.boundOutsideClickHandler = this.outsideClickHandler.bind(this);
    document.addEventListener("click", this.boundOutsideClickHandler);
  }

  disconnect() {
    document.removeEventListener("click", this.boundOutsideClickHandler);
  }

  openValueChanged() {
    if(this.openValue) this.show();

    if(!this.openValue) this.hide();
  }

  show() {
    this.datetimePickerTarget.classList.remove("hidden");
    this.adjustPosition();
  }

  hide() {
    this.datetimePickerTarget.classList.add("hidden");
    this.datetimePickerTarget.style.transform = '';
  }

  toggle() {
    this.openValue = !this.openValue;
  }

  adjustPosition() {
    const rect = this.datetimePickerTarget.getBoundingClientRect();

    if (rect.top < 0) {
      const translate = Math.abs(rect.top);

      this.datetimePickerTarget.style.transform = `translateY(${translate}px)`;
    }

    if (rect.bottom > window.innerHeight) {
      const translate = window.innerHeight - rect.bottom;

      this.datetimePickerTarget.style.transform = `translateY(${translate}px)`;
    }
  }

  outsideClickHandler(event) {
    if (!this.element.contains(event.target)) {
      this.hide();
    }
  }
}
