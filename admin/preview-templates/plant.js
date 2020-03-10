import htm from "https://unpkg.com/htm?module";

const html = htm.bind(h);

// Preview component for a Page
const Page = createClass({
  render() {
    const entry = this.props.entry;

    return html`
      <main>
        <article>
          <h1>${entry.getIn(["data", "title"], null)}</h1>
          <small>${entry.getIn(["data", "latinName"], null)}</small>
          ${this.props.widgetFor("body")}
        </article>
      </main>
    `;
  }
});

export default Page;
