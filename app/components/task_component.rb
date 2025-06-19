# frozen_string_literal: true

class TaskComponent < ViewComponent::Base
  attr_reader :task, :data_options

  def initialize(task:, data_options: { task_list_component_target: "task" })
    @task = task
    @data_options = {
      action: "task-form-component:renderStream->task-component#setPendingStream",
      controller: "task-component",
      task_id: task.id
    }.merge(data_options)
  end
end
