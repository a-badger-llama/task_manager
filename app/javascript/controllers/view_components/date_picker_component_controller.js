import { Controller } from "@hotwired/stimulus";
import flatpickr from "flatpickr";

export default class extends Controller {
  static targets = ["input"]

  connect() {
    this.picker = flatpickr(this.inputTarget, {
      inline: true,
      dateFormat: "Y-m-d",
      yearSelectorType: "dropdown"
    });
  }

  disconnect() {
    if (this.picker) {
      this.picker.destroy();
    }
  }
}
