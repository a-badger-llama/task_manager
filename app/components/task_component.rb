# frozen_string_literal: true

class TaskComponent < ViewComponent::Base
  attr_reader :task, :data_options

  delegate :due_at, :has_due_time, to: :task

  def initialize(task:, data_options: { task_list_component_target: "task" })
    @task = task
    @data_options = {
      controller: "task-component",
      task_id: task.id
    }.merge(data_options)
  end

  private

  def formatted_due_at
    return unless task.due_at.present?

    formatted_date = due_at.strftime("%a, %b %-d")
    formatted_date += ", #{due_at.year}" if due_at.year != Time.current.year
    formatted_date += " at #{due_at.strftime("%l:%M %p").strip}" if has_due_time.present?
    formatted_date
  end
end
