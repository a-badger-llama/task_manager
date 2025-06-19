# frozen_string_literal: true

class TaskFormComponentPreview < ViewComponent::Preview
  def default
    @task = Task.first

    render_with_template(template: nil, locals: { task: @task })
  end
end
