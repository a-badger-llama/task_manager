# frozen_string_literal: true

class TimePickerComponent < FormFieldComponent
  attr_reader :placeholder

  def initialize(form:, field:, placeholder: "Set time")
    super(form: form, field: field)
    @placeholder = placeholder
  end

  def time_intervals(interval: 30, &block)
    (0..(24 * 60 - interval)).step(interval).map do |minute_offset|
      time = Time.zone.parse("00:00") + minute_offset.minutes
      time = time.strftime("%-I:%M %p")

      if block
        block.call(time)
      else
        time
      end
    end
  end
end
