class ApplicationController < ActionController::Base
  def dashboard
    render html: "Hello, world!"
  end
end
