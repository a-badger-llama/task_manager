# frozen_string_literal: true

class CheckBoxComponent < ViewComponent::Base
  renders_one :checkbox_peer # requires the checkbox to have the 'peer' class
end
