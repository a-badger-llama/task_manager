import {Controller} from "@hotwired/stimulus";
import {Turbo}      from "@hotwired/turbo-rails";

const CSRF_TOKEN_SELECTOR = "[name='csrf-token']";

export default class extends Controller {
  static targets = ["attributeField", "form"]
  static values = {task: Number}

  connect() {
    this.activeFocus = false;
    this.pendingChanges = false;
    this.pendingStream = null;
    this.setPendingChanges = this.setPendingChanges.bind(this);
    this.setFocus = this.setFocus.bind(this);

    document.addEventListener("change", this.setPendingChanges);
    document.addEventListener("click", this.setFocus);
  }

  disconnect() {
    document.removeEventListener("change", this.setPendingChanges);
    document.removeEventListener("click", this.setFocus);
  }

  setPendingChanges(event) {
    if (!this.element.contains(event.target)) return;

    this.pendingChanges = true;
  }

  showDisplay(event) {
    this.dispatch("display", {
      detail: { task: this.taskValue },
      bubbles: event.bubbles,
      cancelable: event.cancelable,
      target: event.target,
    });
  }

  showEdit(event) {
    this.dispatch("edit", {
      detail: { task: this.taskValue },
      bubbles: event.bubbles,
      cancelable: event.cancelable,
      target: event.target,
    });
  }

  setFocus(event) {
    this.activeFocus = this.element.contains(event.target);

    if (this.activeFocus) {
      this.element.classList.add("bg-accent");
      this.showEdit(event);
    } else {
      this.element.classList.remove("bg-accent");
      this.showDisplay(event);
      this.safeSubmit();
    }
  }

  safeSubmit() {
    if (!this.pendingChanges || this.isEmpty() || this.activeFocus) return;

    this.submitForm();
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
    if (this.pendingStream && !this.activeFocus) {
      Turbo.renderStreamMessage(this.pendingStream);
      this.pendingStream = null;
    }
  }

  isEmpty() {
    return this.attributeFieldTargets.every(input => input.value === "" || input.value === null);
  }

  hideSelf() {
    this.element.classList.add("hidden");
  }
}
