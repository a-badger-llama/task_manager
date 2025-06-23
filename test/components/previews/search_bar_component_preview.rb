# frozen_string_literal: true

class SearchBarComponentPreview < ViewComponent::Preview
  def default
    render(SearchBarComponent.new)
  end
end
