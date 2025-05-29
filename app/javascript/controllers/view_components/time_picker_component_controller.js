import { Dropdown } from "tailwindcss-stimulus-components"

export default class extends Dropdown {
  static targets = ["input"]

  connect() {}

  select(event) {
    const value = event.target.dataset.value;
    this.inputTarget.value = value;
    this.close();
  }
}
