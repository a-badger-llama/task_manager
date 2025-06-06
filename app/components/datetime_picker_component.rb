# frozen_string_literal: true

class DatetimePickerComponent < ViewComponent::Base
  renders_one :datetime_badge
  renders_one :date_field
  renders_one :time_field
end
