import {Controller} from "@hotwired/stimulus";
import {Turbo}      from "@hotwired/turbo-rails";

const CSRF_TOKEN_SELECTOR = "[name='csrf-token']";

export default class extends Controller {
  static targets = ["attributeField", "display", "form"]
  static values = {
    task: { type: Number, default: 0 },
    active: { type: Boolean, default: false }
  }

  connect() {
    this.taskValue = this.element.dataset.taskId;
    this.pendingChanges = false;
    this.pendingStream = null;
    this.boundSetPendingChanges = this.setPendingChanges.bind(this);
    this.boundSetActiveValue = this.setActiveValue.bind(this);

    document.addEventListener("change", this.boundSetPendingChanges);
    document.addEventListener("click", this.boundSetActiveValue);
  }

  disconnect() {
    document.removeEventListener("change", this.boundSetPendingChanges);
    document.removeEventListener("click", this.boundSetActiveValue);
  }

  setPendingChanges(event) {
    if (!this.element.contains(event.target)) return;

    this.pendingChanges = true;
  }

  setActiveValue(event, value) {
    if (value !== undefined && value !== null) {
      this.activeValue = value;
    } else {
      this.activeValue = this.element.contains(event.target);
    }
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
      // this.safeSubmit();
    }
  }

  safeSubmit() {
    if (!this.pendingChanges || this.isEmpty() || this.activeValue) return;

    this.submitForm();
    this.pendingChanges = false;
  }

  submitForm() {
    const formElement = this.formTarget;
    const formData = new FormData(formElement);

    formData.append("dom_id", this.element.id);
    fetch(formElement.action, {
      method:  formElement.method,
      headers: this.generateHeaders(),
      body:    formData,
    })
    .then(this.handleResponse.bind(this))
    .catch(error => console.error("Form submission failed:", error));
  }

  deleteTask() {
    this.hideSelf();

    fetch(this.formTarget.action, {
      method:  "DELETE",
      headers: this.generateHeaders(),
    })
    .then(this.handleResponse.bind(this))
    .catch(error => console.error("Task deletion failed:", error));
  }

  generateHeaders(contentType = "text/vnd.turbo-stream.html") {
    const csrfToken = document.querySelector(CSRF_TOKEN_SELECTOR)?.content || "";

    return {"X-CSRF-Token": csrfToken, Accept: contentType};
  }

  async handleResponse(response) {
    const contentType = response.headers.get("Content-Type") || "";

    if (response.ok && contentType.includes("turbo-stream")) {
      this.pendingStream = await response.text();
      this.renderSafely();
    } else {
      console.warn("Received a non-turbo-stream response");
    }
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  }

  renderSafely() {
    if (this.pendingStream && !this.activeValue) {
      Turbo.renderStreamMessage(this.pendingStream);
      this.pendingStream = null;
      this.dispatch("rendered", {
        detail:     { task: this.taskValue },
        target:     this.element,
      });
    }
  }

  isEmpty() {
    return this.attributeFieldTargets.every(input => input.value === "" || input.value === null);
  }

  hideSelf() {
    this.element.classList.add("hidden");
  }

  // toggleCompletion(event) {
  //   this.setPendingChanges(event);
  //   this.hideSelf();
  //   this.setActiveValue(event, false);
  // }
}
