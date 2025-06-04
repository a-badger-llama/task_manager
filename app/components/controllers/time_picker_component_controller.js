import { Dropdown } from "tailwindcss-stimulus-components"

export default class extends Dropdown {
  connect() {
    super.connect();

    this.inputField = this.element.querySelector("input");
    this.boundOutsideClickHandler = this.outsideClickHandler.bind(this);
    ["click", "touchstart"].forEach(eventType => {
      document.addEventListener(eventType, this.boundOutsideClickHandler);
    })
  }

  disconnect() {
    super.disconnect();

    ["click", "touchstart"].forEach(eventType => {
      document.removeEventListener(eventType, this.boundOutsideClickHandler);
    })
  }

  select(event) {
    const value = event.target.dataset.value;
    this.inputField.value = value;
    this.inputField.dispatchEvent(new Event('input', {bubbles: true}));
    this.close();
  }

  show() {
    super.show();
    this.adjustDropdownPosition();
    this.inputField.classList.add("border-b-2", "border-secondary")
  }

  close() {
    super.close();
    this.inputField.classList.remove("border-b-2", "border-secondary")
  }

  adjustDropdownPosition() {
    const dropdownEl = this.menuTarget;
    const triggerEl = this.inputField

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

  outsideClickHandler(event) {
    if (!this.element.contains(event.target) && this.openValue === true) {
      this.close();
    }
  }
}
