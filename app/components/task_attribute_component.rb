# frozen_string_literal: true

class TaskAttributeComponent < ViewComponent::Base
  attr_reader :task, :attribute

  def initialize(task:, attribute:)
    @task = task
    @attribute = attribute
  end

  def render_display?
    task.public_send(attribute).present?
  end
end
