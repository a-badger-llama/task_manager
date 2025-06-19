import { Controller } from "@hotwired/stimulus";

const CSRF_TOKEN_SELECTOR = "[name='csrf-token']";

export default class extends Controller {
  static targets = ["title", "description", "due_at"]
  static values = {
    pendingChanges: { type: Boolean, default: false }
  }

  connect() {
    this.taskId = this.element.dataset.taskId;
  }

  disconnect() {
  }

  autoResize(event) {
    if (event.target.tagName !== "TEXTAREA") return;

    const textarea = event.target

    textarea.style.height = "auto"
    textarea.style.height = `${textarea.scrollHeight}px`
  }

  setPendingChanges(event) {
    this.pendingChanges = true;
  }

  setFocus(event) {
    if (event.detail.task !== this.taskId) return;

    this.focusAttributeField(event.detail.attribute);
  }

  focusAttributeField(attribute) {
    const attributeActions = {
      title:       () => this.handleFocusAndSelect(this.titleTarget),
      description: () => this.handleFocusAndSelect(this.descriptionTarget),
      due_at:      () => this.due_atTarget.click()
    };


    requestAnimationFrame(() => {
      (attributeActions[attribute] || attributeActions['title'])();
    })
  }

  handleFocusAndSelect = (target) => {
    target.focus();
    target.select();
  };

  safeSubmit(event) {
    if (this.taskId !== event.detail.task || !this.pendingChanges || this.isEmpty()) return;

    this.submitForm();
    this.pendingChanges = false;
  }

  isEmpty() {
    const formData = new FormData(this.element);

    for (const [key, value] of formData.entries()) {
      if (key.startsWith("task[") && value.trim() !== "") {
        return false; // Found a non-empty task field
      }
    }

    return true;
  }

  submitForm() {
    const formData = new FormData(this.element);

    fetch(this.element.action, {
      method:  this.element.method,
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
      const turboStream = await response.text();

      this.dispatch("renderStream", {
        detail: {
          task: this.taskId,
          turboStream: turboStream
        }
      })
    } else {
      console.warn("Received a non-turbo-stream response");
    }
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  }
}
