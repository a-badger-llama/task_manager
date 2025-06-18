import {Controller} from "@hotwired/stimulus";

export default class extends Controller {
  connect() {
    this.boundAutoResize = this.autoResize.bind(this)
    this.boundDispatchClicked = this.dispatchClicked.bind(this)

    document.addEventListener("input", this.boundAutoResize);
    document.addEventListener("click", this.boundDispatchClicked);
  }

  disconnect() {
    document.removeEventListener("input", this.boundAutoResize)
    document.removeEventListener("click", this.boundDispatchClicked);
  }

  autoResize(event) {
    if (event.target.tagName !== "TEXTAREA") return;

    const textarea = event.target

    textarea.style.height = "auto"
    textarea.style.height = `${textarea.scrollHeight}px`
  }

  dispatchClicked(event) {
    if (!this.element.contains(event.target)) return;

    this.dispatch("clicked", {
      detail: {
        task: this.element.dataset.taskId,
        attribute: this.element.dataset.taskAttribute,
      }
    })
  }
}
