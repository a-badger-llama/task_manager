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
    this.adjustDropdownPosition();
    this.inputTarget.classList.add("border-b-2", "border-secondary")
  }

  close() {
    super.close();
    this.inputTarget.classList.remove("border-b-2", "border-secondary")
  }

  adjustDropdownPosition() {
    const dropdownEl = this.menuTarget;
    const triggerEl = this.inputTarget

    if (!dropdownEl || !triggerEl) return;

    const rect = triggerEl.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    const shouldOpenAbove = spaceBelow < 250 && spaceAbove > spaceBelow;

    const maxHeight = shouldOpenAbove ? spaceAbove - 20 : spaceBelow - 20;
    dropdownEl.style.maxHeight = `${Math.max(maxHeight, 150)}px`;
    dropdownEl.style.overflowY = "auto";

    // Positioning
    dropdownEl.classList.remove("top-full", "bottom-full", "mt-2", "mb-2");
    if (shouldOpenAbove) {
      dropdownEl.classList.add("bottom-full", "mb-2"); // open upward
    } else {
      dropdownEl.classList.add("top-full", "mt-2"); // open downward
    }
  }
}
