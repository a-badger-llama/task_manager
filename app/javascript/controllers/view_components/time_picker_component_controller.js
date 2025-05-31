import { Dropdown } from "tailwindcss-stimulus-components"

export default class extends Dropdown {
  static targets = ["input"]

  connect() {}

  select(event) {
    const value = event.target.dataset.value;
    this.inputTarget.value = value;
    this.close();
  }

  show() {
    super.show();
    this.adjustDropdownHeight();
  }

  adjustDropdownHeight() {
    const dropdownEl = this.menuTarget;
    const triggerEl = this.inputTarget

    const rect = triggerEl.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const maxHeight = Math.max(spaceBelow, 200);

    dropdownEl.style.maxHeight = `${maxHeight - 20}px`;
    dropdownEl.style.overflowY = "auto";
  }
}
