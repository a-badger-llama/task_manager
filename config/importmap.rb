# Pin npm packages by running ./bin/importmap

pin "application"
pin_all_from "app/javascript/controllers", under: "controllers"
pin_all_from "app/components/controllers", under: "controllers"

# from gems
pin "@hotwired/turbo-rails", to: "turbo.min.js"
pin "@hotwired/stimulus", to: "stimulus.min.js"
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"

# vendor libraries
pin "tailwindcss-stimulus-components" # @6.1.3
pin "debounce" # @2.2.0
pin "sortablejs" # @1.15.6
pin "flatpickr" # @4.6.13
