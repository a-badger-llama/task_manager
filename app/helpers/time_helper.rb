module TimeHelper
  def time_select_options(interval: 30)
    (0..(24 * 60 - interval)).step(interval).map do |minute_offset|
      time = Time.zone.parse("00:00") + minute_offset.minutes
      [
        time.strftime("%-I:%M %p"), # Display value (e.g., "12:30 PM")
        time.strftime("%H:%M")      # Stored value (e.g., "12:30")
      ]
    end
  end
end
