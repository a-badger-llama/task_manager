module TasksHelper
  def formatted_due_at(task)
    return unless task.due_at.present?

    formatted_date = task.due_at.strftime("%a, %b %-d")
    formatted_date += ", #{task.due_at.year}" if task.due_at.year != Time.current.year
    formatted_date += " at #{task.due_at.strftime("%l:%M %p").strip}" if task.has_due_time.present?
    formatted_date
  end
end
