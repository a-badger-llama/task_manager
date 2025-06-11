# frozen_string_literal: true

class TaskListComponent < ViewComponent::Base
  attr_reader :tasks, :dom_id

  def initialize(tasks:, dom_id:)
    @tasks = tasks
    @dom_id = dom_id
  end
end
