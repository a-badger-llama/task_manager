import {Controller} from "@hotwired/stimulus";
import {Turbo}      from "@hotwired/turbo-rails";

export default class extends Controller {
  static targets = ["attributeField", "display", "form"]
  static values = {
    active: { type: Boolean, default: false },
    pendingStream: { type: String, default: null }
  }

  connect() {
    this.taskId = this.element.dataset.taskId;
    this.boundSetActiveValue = this.setActiveValue.bind(this);

    document.addEventListener("click", this.boundSetActiveValue);
  }

  disconnect() {
    document.removeEventListener("click", this.boundSetActiveValue);
  }

  setActiveValue(event) {
    if (!this.activeValue && this.element.contains(event.target)) {
      this.activeValue = true;
    } else if (this.activeValue && !this.element.contains(event.target)) {
      this.activeValue = false;
    }
  }

  dispatchClicked(event) {
    const attributeEl = event.target.closest("[data-task-attribute]");
    const attribute = attributeEl?.dataset.taskAttribute;

    this.dispatch("clicked", {
      detail: {
        task: this.taskId,
        attribute: attribute
      }
    })
  }

  activeValueChanged() {
    if (this.activeValue) {
      this.element.classList.add("bg-accent");
      this.element.classList.remove("drag-handle");
      this.displayTarget.classList.add("hidden")
      this.formTarget.classList.remove("hidden")
    } else {
      this.element.classList.remove("bg-accent");
      this.element.classList.add("drag-handle");
      this.displayTarget.classList.remove("hidden")
      this.formTarget.classList.add("hidden")
      this.dispatch("save", {
        detail: {
          task: this.taskId,
          dom_id: this.element.id
        }
      })
      this.renderSafely();
    }
  }

  deleteTask() {
    this.hideSelf();
    this.dispatch("deleted", {
      detail: {
        task: this.taskId,
      }
    })
  }

  hideSelf() {
    this.element.classList.add("hidden");

    if (this.activeValue) {
      this.activeValue = false;
      document.activeElement.blur();
    }
  }

  setPendingStream(event) {
    this.pendingStream = event.detail.turboStream;

    this.renderSafely();
  }

  renderSafely() {
    if (this.activeValue || !this.pendingStream) return;

    Turbo.renderStreamMessage(this.pendingStream);
    this.pendingStream = null;
    this.dispatch("rendered", {
      detail:     { task: this.taskId },
      target:     this.element,
    });
  }

  completeTask(event) {
    this.hideSelf();
    this.dispatch("completed", {
      detail: {
        task: this.taskId,
      }
    })
  }
}
