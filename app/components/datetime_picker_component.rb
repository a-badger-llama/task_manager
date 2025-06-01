# frozen_string_literal: true

class DatetimePickerComponent < ViewComponent::Base
  attr_reader :form, :record, :include_badge

  def initialize(form:, include_badge: true)
    @form   = form
    @record = form.object
    @include_badge = include_badge
  end

  def badge
    return formatted_due_at if form.object.due_at.present?

    helpers.inline_svg("calendar-circle-plus-svgrepo-com.svg",
                       class: "h-5 w-5",
                       aria:  { label: "Open date and time picker" })
  end

  private

  def formatted_due_at
    datetime = record.due_at

    formatted_date = datetime.strftime("%a, %b %-d")
    formatted_date += ", #{datetime.year}" if datetime.year != Time.current.year
    formatted_date += " at #{datetime.strftime("%l:%M %p").strip}" if record.has_due_time?
    formatted_date
  end
end
