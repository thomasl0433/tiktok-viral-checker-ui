import "./App.css";
import React from "react";

class App extends React.Component {
  state = {
    term: "",
    hasSearched: false,
    isViral: false,
    hasSubmitted: false
  };

  onFormSubmit = async (event) => {
    event.preventDefault();
    console.log(this.state.term);
    this.setState({
      hasSearched: true,
      hasSubmitted: true
    })

    // shoot off request to backend
    console.log(`Hitting http://localhost:3001/${this.state.term}}`);
    const response = await fetch(`http://localhost:3001/${this.state.term}`);

    const output = await response.json();
    this.setState({
      isViral: output.viral
    })
    console.log(output);
  };

  render() {
    return (
      <div className="App">
        <nav className="">
          <div className="navbar">
            {/* <h1 className="">Tiktok Viral Checker ✅</h1> */}
            <h1 className="">Tiktok Viral Checker ✅</h1>
          </div>
        </nav>
        <div className="" style={{ width: "800px" }}>
          <h3>See if your song is viral on Tiktok</h3>
          <form className="" onSubmit={this.onFormSubmit}>
            <input
              type="text"
              value={this.state.term}
              onChange={(e) => this.setState({ term: e.target.value })}
            />
            {this.state.hasSearched && this.state.hasSubmitted ? <p>Show results for <em>{this.state.term}</em></p> : <div></div>}
          </form>
        </div>
        <div className="content">
          {this.state.hasSearched
            ? <h1>Is the song viral? {this.state.isViral ? 'yes' : 'no'}</h1>
            : <div></div>
          }
          <h4>Not on Tiktok?</h4>
          <p>Use this tool to search a song to see if it's famous from Tiktok.</p>
        </div>
      </div>
    );
  }
}

export default App;
