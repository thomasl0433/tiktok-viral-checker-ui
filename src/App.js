import "./App.css";
import React from "react";

class App extends React.Component {
  state = {
    term: "",
    hasSearched: false,
    isViral: null,
    hasSubmitted: false,
    data: {},
    song: {}
  };

  onFormSubmit = async (event) => {
    event.preventDefault();
    //console.log(this.state.term);
    this.setState({
      hasSearched: true,
      hasSubmitted: true,
      data: {},
    });

    // shoot off request to backend
    //console.log(`Hitting http://localhost:3001/${this.state.term}}`);
    const response = await fetch(`http://localhost:3001/widesearch/${this.state.term}`);

    const output = await response.json();
    try {
      this.setState({
        isViral: output.viral,
        data: output,
      });
    } catch (error) {
      console.log(error);
    }

    console.log(output);
  };

  renderSearch = () => {
    let id = 0;
    console.log("inside renderSearch");
    const items = this.state.data.map((item) => (
      <button onClick={() => this.onSongSelect(item)} className="btn btn-light rounded w-50 mx-auto d-block mb-2" key={id++}>
        {item.name} by {item.artist}
      </button>
    ));

    return items;
  };

  onSongSelect = async (item) => {
    // this will determine if the song is viral or not (return TRUE or FALSE)
    console.log("inside onSongSelect");
    console.log(item);

    const response = await fetch(`http://localhost:3001/narrowsearch/${item.id}`);

    const output = await response.json();
    
    this.setState({
      isViral: output,
      song: item
    })
  }

  render() {
    return (
      <div className="App">
        <nav className="mx-auto">
          <div className="navbar justify-content-center">
            {/* <h1 className="">Tiktok Viral Checker ✅</h1> */}
            <h1 className="">Tiktok Viral Checker ✅</h1>
          </div>
        </nav>
        <div className="">
          <div className="">
            <h3>See if your song is viral on Tiktok</h3>
            <form className="" onSubmit={this.onFormSubmit}>
              <input
                type="text"
                value={this.state.term}
                onChange={(e) => this.setState({ term: e.target.value })}
              />
              {this.state.hasSearched && this.state.hasSubmitted ? (
                <p>
                  Show results for <em>{this.state.term}</em>
                </p>
              ) : (
                <div></div>
              )}
            </form>
          </div>
        </div>
        <div className="content">
          {this.state.isViral != null ? (
            <div>
              <h1>Is "{this.state.song.name}" viral?</h1>
              <h1>{this.state.isViral ? "Yes" : "No"}</h1>
            </div>
          ) : (
            <div></div>
          )}
          <div>
            {Object.keys(this.state.data).length === 0
              ? ""
              : this.renderSearch()}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
