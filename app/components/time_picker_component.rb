# frozen_string_literal: true

class TimePickerComponent < ViewComponent::Base
  attr_reader :name, :value, :options

  def initialize
    # @name    = name
    # @value   = value
    # @options = merge_options(options)
  end

  private

  def merge_options(options)
    base_options = {
      autocomplete: "off",
      class:        "w-full p-2 text-sm placeholder-neutral bg-transparent border-0 ring-0",
      placeholder:  "Set time",
      data: {
        "time-picker-component-target": "input",
        action:                         "click->time-picker-component#show"
      }
    }

    options[:data] = options[:data].presence&.map do |k, v|
      [k, "#{v} " + base_options[:data].delete(k).to_s]
    end.to_h.merge!(base_options.delete(:data))

    base_options.merge(options)
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
