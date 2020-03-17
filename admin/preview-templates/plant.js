import htm from "https://unpkg.com/htm?module";

const html = htm.bind(h);

// Preview component for a Page
const Page = createClass({
  render() {
    const entry = this.props.entry;

    return html`
      <main>
        <article>
          <header>
            <div class="text">
              <h1>${entry.getIn(["data", "title"], null)}</h1>
              <small>${entry.getIn(["data", "latinName"], null)}</small>
            </div>
          </header>
          ${this.props.widgetFor("body")}
        </article>
      </main>
    `;
  }
});

export default Page;
