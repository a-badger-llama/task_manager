import { Controller } from "@hotwired/stimulus";
import flatpickr from "flatpickr";

export default class extends Controller {
  static targets = ["input"]

  connect() {
    const options = {
      inline: true,
    };

    this.picker = flatpickr(this.inputTarget, options);
  }

  disconnect() {
    if (this.picker) {
      this.picker.destroy();
    }
  }
}
