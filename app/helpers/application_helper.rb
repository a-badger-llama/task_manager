module ApplicationHelper
  def inline_svg(filename, options = {})
    file_path = Rails.root.join("app/assets/images", filename)
    svg = File.read(file_path)
    svg = svg.html_safe # Ensure it's properly marked as safe
    content_tag(:span, svg, options)
  end
end
