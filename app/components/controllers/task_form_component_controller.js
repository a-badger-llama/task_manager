import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["title", "description", "due_at"]
  connect() {
    this.taskId = this.element.dataset.taskId;

    this.boundHandleAttributeClicked = this.handleAttributeClicked.bind(this);

    document.addEventListener("task-attribute-component:clicked", this.boundHandleAttributeClicked)
  }

  handleAttributeClicked(event) {
    if (event.detail.task !== this.taskId) return;

    requestAnimationFrame(() => {
      this.focusAttributeField(event.detail.attribute);
    })
  }

  focusAttributeField(attribute) {
    if (attribute === "title") {
      this.titleTarget.focus();
      this.titleTarget.select();
    } else if (attribute === "description") {
      this.descriptionTarget.focus();
      this.descriptionTarget.select();
    } else if (attribute === "due_at") {
      this.due_atTarget.click();
    }
  }
}
