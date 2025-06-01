# Frozen string literal: true

class FormFieldComponent < ViewComponent::Base
  attr_reader :form, :field

  def initialize(form:, field:)
    @form = form
    @field = field
  end

  # Helper to fetch the error messages for the field
  def errors
    form.object.errors[field]
  end

  # Helper to check if there are errors for the field
  def has_errors?
    errors.present?
  end
end
