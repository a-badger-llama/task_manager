import {Controller} from "@hotwired/stimulus"
import debounce     from "debounce"

export default class extends Controller {
  static targets = ["form", "results"]

  connect() {
    this.search = debounce(this.search.bind(this), 300)
  }

  search(event) {
    const query = event.target.value
    const url = `${this.formTarget.action}?query=${encodeURIComponent(query)}`

    fetch(url, {
      headers: { Accept: "text/vnd.turbo-stream.html" }
    })
    .then(res => res.text())
    .then(turboStream => Turbo.renderStreamMessage(turboStream))
  }
}
