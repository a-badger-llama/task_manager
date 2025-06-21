require "test_helper"

class TasksControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  attr_reader :task, :user

  setup do
    @task = tasks(:task_minimal)
    @user = users(:jonathan)

    sign_in user
  end

  test "should get index" do
    get tasks_url

    assert_response :success
  end

  test "new is not a route" do
    get tasks_url + "/new"

    assert_response :not_found
  end

  test "show is not a route" do
    get task_url(@task)

    assert_response :not_found
  end

  test "edit is not a route" do
    get task_url(@task) + "/edit"

    assert_response :not_found
  end

  test "should create task" do
    new_task = Task.new(title: "New Task", description: "Task Description")

    assert_difference("Task.count") do
      post tasks_url,
           as:     :turbo_stream,
           params: {
             task: {
               title:       new_task.title,
               description: new_task.description,
               due_date:    Date.tomorrow,
               due_time:    "2:00 PM"
             }
           }
    end

    task = Task.last

    assert_response :success
    assert_equal new_task.title, task.title
    assert_equal new_task.description, task.description
    assert_includes response.body, task.title
    assert_includes response.body, task.description
  end

  test "create task fails" do
    Task.any_instance.expects(:save).returns(false)

    assert_no_difference("Task.count") do
      post tasks_url,
           as:     :turbo_stream,
           params: {
             task: {
               title:       "New Task",
               description: "Task Description",
               due_date:    Date.tomorrow,
               due_time:    "2:00 PM"
             }
           }
    end

    assert_response :bad_request
    assert_includes response.body, "errors"
  end

  test "should update task" do
    patch task_url(@task),
          as:     :turbo_stream,
          params: {
            task: {
              title:       "Updated Title",
              description: "Updated Description"
            }
          }

    task.reload

    assert_response :success
    assert_equal "Updated Title", task.title
    assert_equal "Updated Description", task.description
    assert_includes response.body, task.title
    assert_includes response.body, task.description
    refute_includes response.body, "completed-count"
  end

  test "update task when completed_at changed" do
    patch task_url(@task),
          as:     :turbo_stream,
          params: {
            task: {
              completed: "1"
            }
          }

    task.reload

    assert_response :success
    assert_includes response.body, "completed-count"
  end

  test "update task fails" do
    Task.any_instance.expects(:update).returns(false)

    patch task_url(@task),
          as:     :turbo_stream,
          params: {
            task: {
              title:       "Updated Title",
              description: "Updated Description"
            }
          }

    task.reload

    assert_response :bad_request
    assert_includes response.body, "errors"
  end

  test "should destroy task" do
    assert_difference("Task.count", -1) do
      delete task_url(task), as: :turbo_stream
    end

    assert_response :success
    assert_includes response.body, %(turbo-stream action="remove")
  end

  test "destroy task fails" do
    Task.any_instance.expects(:destroy!).raises(ActiveRecord::RecordNotDestroyed)

    assert_no_difference("Task.count") do
      assert_raises ActiveRecord::RecordNotDestroyed do
        delete task_path(task), as: :turbo_stream
      end
    end
  end
end
