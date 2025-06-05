import {Controller} from "@hotwired/stimulus";
import {Turbo}      from "@hotwired/turbo-rails";

const CSRF_TOKEN_SELECTOR = "[name='csrf-token']";

export default class extends Controller {
  static targets = ["attributeField", "form"]

  connect() {
    this.activeFocus = false;
    this.pendingChanges = false;
    this.pendingStream = null;
    this.handleInsideClick = this.handleInsideClick.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);

    document.addEventListener("change", function(event) { this.pendingChanges = true; }.bind(this));
    document.addEventListener("click", this.handleInsideClick);
    document.addEventListener("click", this.handleOutsideClick);
  }

  disconnect() {
    document.removeEventListener("click", this.handleInsideClick);
    document.removeEventListener("click", this.handleOutsideClick);
  }

  handleInsideClick(event) {
    if (this.element.contains(event.target)) {
      this.changeFocus(true);
    }
  }

  handleOutsideClick(event) {
    if (!this.element.contains(event.target)) {
      this.changeFocus(false);
    }
  }

  displayAttributes() {
    this.dispatch("display");
  }

  editAttributes() {
    this.dispatch("edit");
  }

  changeFocus(active) {
    this.activeFocus = active;

    if (this.activeFocus) {
      this.element.classList.add("bg-accent");
      this.editAttributes();
    } else {
      this.element.classList.remove("bg-accent");
      this.displayAttributes();
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
}
