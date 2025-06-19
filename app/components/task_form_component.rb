# frozen_string_literal: true

class TaskFormComponent < ViewComponent::Base
  attr_reader :task, :data_options

  def initialize(task:)
    @task = task
    @data_options = data_options
  end
end
