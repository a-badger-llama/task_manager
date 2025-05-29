# frozen_string_literal: true

class TimePickerComponent < FormFieldComponent
  attr_reader :placeholder

  def initialize(form:, field:, placeholder: "set time")
    super(form: form, field: field)
    @placeholder = placeholder
  end
end
