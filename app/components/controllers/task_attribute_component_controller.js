import {Controller} from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["display", "edit"]
  static values = {task: Number}

  connect() {
    this.selectOnFocus = this.selectOnFocus.bind(this)
    this.autoResize = this.autoResize.bind(this)
    this.edit = this.edit.bind(this)
    this.display = this.display.bind(this)

    this.editTarget.addEventListener("focusin", this.selectOnFocus)
    document.addEventListener("input", this.autoResize);
    document.addEventListener("task-component:edit", this.edit)
    document.addEventListener("task-component:display", this.display)
  }

  disconnect() {
    this.editTarget.removeEventListener("focusin", this.selectOnFocus)
    document.removeEventListener("input", this.autoResize)
    document.removeEventListener("task-component:edit", this.edit)
    document.removeEventListener("task-component:display", this.display)
  }

  autoResize(event) {
    if (event.target.tagName !== "TEXTAREA") return;

    const textarea = event.target

    textarea.style.height = "auto"
    textarea.style.height = `${textarea.scrollHeight}px`
  }

  selectOnFocus(event) {
    event.target.select()
  }

  display(event) {
    if (event.detail.task !== this.taskValue) return;

    this.editTarget.classList.add("hidden");
    this.displayTarget.classList.remove("hidden");
  }

  edit(event) {
    if (event.detail.task !== this.taskValue) return;

    this.displayTarget.classList.add("hidden");
    this.editTarget.classList.remove("hidden");

    if (this.element.contains(event.target)) this.editTarget.children[0].focus();
  }
}
