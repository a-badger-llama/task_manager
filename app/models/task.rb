class Task < ApplicationRecord
  belongs_to :user
  belongs_to :taskable, polymorphic: true, optional: true

  before_validation :combine_due_date_and_time

  scope :incomplete, -> { where(completed_at: nil) }
  scope :complete, -> { where.not(completed_at: nil) }
  scope :position, -> { order(position: :asc) }
  scope :search, ->(query) {
    sanitized_select_clause = sanitize_sql_array([
      "tasks.*, (COALESCE(similarity(title, :query), 0) + COALESCE(similarity(description, :query), 0)) AS rank",
      query: query
    ])

    select(sanitized_select_clause)
      .where("title ILIKE :query OR description ILIKE :query", query: "%#{query}%")
      .order("rank DESC")
  }

  def completed
    completed_at.present?
  end

  def completed=(value)
    if ActiveRecord::Type::Boolean.new.cast(value)
      self.completed_at ||= Time.current
    else
      self.completed_at = nil
    end
  end

  def completed?
    completed_at.present?
  end

  def complete!
    update(completed_at: Time.current)
  end

  def due_date
    @due_date || due_at&.to_date
  end

  def due_date=(value)
    @due_date = value&.to_date
  end

  def due_time
    return unless has_due_time || @due_time.present?

    @due_time || due_at&.strftime("%l:%M %p")
  end

  def due_time=(value)
    @due_time = value.is_a?(String) ? Time.zone.parse(value)&.strftime("%l:%M %p") : value&.strftime("%l:%M %p")
  end

  def due_at=(value)
    self.due_date = value
    self.due_time = value

    super
  end

  private

  def combine_due_date_and_time
    return if due_date.blank?

    self.has_due_time = due_time.present?
    self.due_at       = Time.zone.parse("#{due_date} #{due_time.presence}")
  end
end
