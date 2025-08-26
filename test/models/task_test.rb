require "test_helper"

class TaskTest < ActiveSupport::TestCase
  attr_reader :user, :new_task

  def setup
    freeze_time

    @user     = users(:jonathan)
    @new_task = Task.new(
      title:       "Test Task",
      description: "Test Description",
      user:        @user
    )
  end

  def teardown
    unfreeze_time
  end

  def test_combine_due_date_and_time
    new_task.due_date = "2021-01-01"
    new_task.due_time = "12:00"

    assert new_task.valid?
    assert_equal Time.zone.parse("2021-01-01 12:00:00"), new_task.due_at
  end

  def test_combine_due_date_and_time_when_due_date_is_blank
    new_task.due_time = "12:00"

    assert new_task.valid?
    refute new_task.has_due_time
    refute new_task.due_at.present?
  end

  def test_incomplete_scope
    incomplete_tasks = Task.incomplete

    assert_equal 10, Task.incomplete.count
    incomplete_tasks.each do |task|
      assert_equal false, task.completed?
    end
  end

  def test_complete_scope
    complete_tasks = Task.complete

    assert_equal 1, Task.complete.count
    complete_tasks.each do |task|
      assert_equal true, task.completed?
    end
  end

  def test_position_scope
    tasks = Task.incomplete.position

    tasks.each_cons(2) do |previous_task, current_task|
      assert current_task.position > previous_task.position, "Task positions should be in ascending order"
    end
  end

  def test_search_scope
    tasks = Task.search("search test")

    expected = [
      { title: "Search Test", description: "This is a description for a task search test", rank: 1.3 },
      { title: "Search Test Task", description: "Regular task description", rank: 0.7777778 },
      { title: "SeArCh TeSt Example", description: "Regular description", rank: 0.6 },
      { title: "Regular Task", description: "This is a search test example", rank: 0.4702381 }
    ]
    actual   = tasks.map { |task| {
      title:       task.title,
      description: task.description,
      rank:        task.rank
    } }

    assert_equal 4, tasks.count(:all)
    assert_equal expected, actual
  end

  def test_set_completed
    refute new_task.completed

    new_task.completed = true

    assert new_task.completed
    assert_equal Time.current, new_task.completed_at
  end

  def test_due_date
    refute new_task.due_at.present?
    refute new_task.due_date.present?

    new_task.update!(due_date: 2.days.from_now)

    assert_equal 2.days.from_now.beginning_of_day, new_task.due_at
    assert_instance_of Date, new_task.due_date
  end

  def test_due_time
    task = tasks(:task_future)

    assert task.due_at.present?
    refute task.has_due_time
    refute new_task.due_time.present?

    task.has_due_time = true

    assert_equal task.due_at.strftime("%l:%M %p"), task.due_time
  end

  def test_due_time_setter_with_datetime
    task = tasks(:task_future)

    refute task.due_time.present?

    task.due_time = 2.days.from_now

    assert_equal 2.days.from_now.strftime("%l:%M %p"), task.due_time
  end

  def test_due_time_setter_with_string
    task = tasks(:task_future)

    refute task.due_time.present?

    task.due_time = 2.days.from_now.strftime("%H:%M")

    assert_equal 2.days.from_now.strftime("%l:%M %p"), task.due_time
  end

  def test_due_time_with_invalid_time
    task = tasks(:task_future)

    task.due_time = "not valid"

    assert_nil task.due_time
  end
end
