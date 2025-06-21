class TasksController < ApplicationController
  before_action :set_task, only: [:update, :destroy]

  def index
    @tasks           = Task.incomplete.position.order(created_at: :desc)
    @completed_tasks = Task.complete.position.order(created_at: :desc)
  end

  # def show
  # end
  #
  # def new
  #   @task = Task.new
  # end
  #
  # def edit
  # end

  def create
    @task = Task.new(task_params.merge(user: current_user))

    respond_to do |format|
      @dom_id = params[:dom_id]

      if @task.save
        format.turbo_stream
      else
        format.turbo_stream do
          render status: :bad_request, json: { errors: @task.errors.full_messages }
        end
      end
    end
  end

  def update
    respond_to do |format|
      if @task.update(task_params)
        @dom_id               = params[:dom_id]
        @completed_tasks_size = Task.complete.size

        format.turbo_stream
      else
        format.turbo_stream do
          render status: :bad_request, json: { errors: @task.errors.full_messages }
        end
      end
    end
  end

  def destroy
    @task.destroy!

    respond_to do |format|
      format.turbo_stream
    end
  end

  def reorder
    params[:ids].each_with_index do |id, index|
      Task.where(id: id).update_all(position: index)
    end

    head :ok
  end

  private

  def set_task
    @task = Task.find(params.expect(:id))
  rescue ActiveRecord::RecordNotFound
    redirect_to tasks_path
  end

  def task_params
    params.expect(task: [:title, :description, :due_date, :due_time, :completed])
  end
end
