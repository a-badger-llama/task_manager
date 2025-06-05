# frozen_string_literal: true

class CheckBoxComponentPreview < ViewComponent::Preview
  def default
    render(CheckBoxComponent.new) do |component|
      component.with_checkbox_peer do
        tag.input(type: :checkbox, class: "hidden peer")
      end
    end
  end
end
