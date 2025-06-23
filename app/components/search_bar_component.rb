# frozen_string_literal: true

class SearchBarComponent < ViewComponent::Base
  attr_reader :search_url, :placeholder

  def initialize(search_url:, placeholder: "Search")
    @search_url  = search_url
    @placeholder = placeholder
  end
end
