import {Controller} from "@hotwired/stimulus";
import flatpickr    from "flatpickr";

export default class extends Controller {
  static targets = ["input"]

  connect() {
    this.inputField = this.element.querySelector("input");

    this.picker = flatpickr(this.inputField, {
      inline:            true,
      monthSelectorType: "static",
    });
  }

  disconnect() {
    if (this.picker) {
      this.picker.destroy();
    }
  }
}
