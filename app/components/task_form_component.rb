# frozen_string_literal: true

class TaskFormComponent < ViewComponent::Base
  attr_reader :task, :data_options

  def initialize(task:, data_options: {})
    @task         = task
    @data_options = {
      # rubocop:disable Style/WordArray
      action:     [
                    "change->task-form-component#setPendingChanges",
                    "task-component:completed@window->task-form-component#complete",
                    "task-component:clicked@window->task-form-component#setFocus",
                    "task-component:save@window->task-form-component#safeSubmit"
                  ].join(" "),
      # rubocop:enable Style/WordArray
      controller: "task-form-component",
      task_id:    task.id
    }.merge(data_options)
  end
end
