import {Controller} from "@hotwired/stimulus";
import Sortable     from "sortablejs";

export default class extends Controller {
  static targets = ["taskList", "task", "taskTemplate"]

  connect() {
    this.boundDragStart = this.dragStart.bind(this);
    this.boundDragEnd = this.dragEnd.bind(this);
    this.boundUpdatePositions = this.updatePositions.bind(this);

    this.sortable = Sortable.create(this.taskListTarget, {
      handle:     ".drag-handle",
      animation:  150,
      onEnd:      this.boundUpdatePositions.bind(this),
      onMove:     this.handleMove.bind(this),
      ghostClass: "opacity-0",
    })
    document.addEventListener("task-component:rendered", this.boundUpdatePositions.bind(this))
    document.addEventListener("dragstart", this.boundDragStart.bind(this))
    document.addEventListener("dragend", this.boundDragEnd.bind(this))
  }

  disconnect() {
    if (this.sortable) {
      this.sortable.destroy();
      this.sortable = null;
    }

    document.removeEventListener("task-component:rendered", this.boundUpdatePositions.bind(this));
    document.removeEventListener("dragstart", this.boundDragStart.bind(this));
    document.removeEventListener("dragend", this.boundDragEnd.bind(this));
  }

  updatePositions(_event) {
    requestAnimationFrame(() => {
      const ids = this.taskTargets.map((task) => task.dataset.taskId)

      fetch("/tasks/reorder", {
        method:  "POST",
        headers: {
          "X-CSRF-Token": document.querySelector("[name='csrf-token']").content,
          "Content-Type": "application/json",
        },
        body:    JSON.stringify({ids}),
      })
    })
  }

  handleMove(event) {
    // Remove existing underline
    document.querySelectorAll('.drop-indicator').forEach(el => el.remove());

    // Create a new underline indicator
    const dropIndicator = document.createElement("div");
    dropIndicator.className = "drop-indicator border-b-2 border-secondary";

    // Insert the indicator before or after the target element based on direction
    if (event.willInsertAfter) {
      event.to.insertBefore(dropIndicator, event.related.nextSibling.nextElementSibling);
    } else {
      event.to.insertBefore(dropIndicator, event.related);
    }
  }

  dragStart(event) {
  }

  dragEnd(event) {
    requestAnimationFrame(() => {
      document.querySelectorAll('.drop-indicator').forEach(el => el.remove());
    })
  }

  prependTask() {
    const newTask= this.createNewTask();
    const titleInput= newTask.querySelector("[data-task-attribute='title']");

    this.taskListTarget.prepend(newTask);
    requestAnimationFrame(() => {
      titleInput.click()
    });
  }

  createNewTask() {
    const taskTemplate = this.taskTemplateTarget;
    const clone = taskTemplate.content.cloneNode(true);
    const newTask = clone.firstElementChild;
    newTask.id = `${newTask.id}_${Date.now()}`;
    return newTask;
  }
}
