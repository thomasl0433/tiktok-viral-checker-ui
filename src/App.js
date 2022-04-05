import "./App.css";
import React from "react";
//equire("dotenv").config({ path: "../config.env" });

class App extends React.Component {
  state = {
    term: "",
    hasSearched: false,
    isViral: null,
    hasSubmitted: false,
    data: {},
    song: {},
    displayTerm: "",
    duplicateData: {}
  };

  onFormSubmit = async (event) => {
    event.preventDefault();
    //console.log(this.state.term);
    this.setState({
      hasSearched: true,
      hasSubmitted: true,
      data: {},
    });
    let output = {};

    // shoot off request to backend
    //console.log(`Hitting http://localhost:3001/${this.state.term}}`);
    await fetch(`${process.env.REACT_APP_API_SERVER_DOMAIN}/widesearch/${this.state.term}`)
      .then(async (res) => {
        output = await res.json();
      })
      .catch(err => console.log(err));

    //console.log(output);
    try {
      this.setState({
        isViral: output.viral,
        data: output,
        displayTerm: this.state.term
      });
      this.removeDuplicates();
    } catch (error) {
      console.log(error);
    }

  };

  removeDuplicates = () => {
    this.setState({
      duplicateData: this.state.data
    });
    const names = this.state.data.map(song => song.name);

    let uniqueSongs = this.state.data.filter((song, index) => {
      return names.indexOf(song.name) === index;
    });
    
    this.setState({
      data: uniqueSongs
    });
    //console.log("unique songs ", uniqueSongs);
    //console.log("includes duplicates ", this.state.duplicateData)
  };

  renderSearch = () => {
    let id = 0;
    //console.log("inside renderSearch");

    const items = this.state.data.map((item) => (
      <button onClick={() => this.onSongSelect(item)} className="btn btn-light rounded w-50 mx-auto d-block mb-2" key={id++}>
        {item.name} by {item.artist}
      </button>
    ));

    return items;
  };

  onSongSelect = async (item) => {
    // this will determine if the song is viral or not (return TRUE or FALSE)
    console.log(item);
    const searchTerm = this.obtainDuplicates(item);
    if (searchTerm.length > 1) {
      // duplicates exist - send all IDs to backend
      const term = encodeURIComponent(JSON.stringify(searchTerm));
      //console.log(term);
      const response = await fetch(`${process.env.REACT_APP_API_SERVER_DOMAIN}/narrowsearch/${term}`);
      const output = await response.json();
      this.setState({
        isViral: output,
        song: item
      })
    } else {
      // unique song (no duplicates) - send ONE ID backend
      const response = await fetch(`${process.env.REACT_APP_API_SERVER_DOMAIN}/narrowsearch/${item.id}`);
      const output = await response.json();
      this.setState({
        isViral: output,
        song: item
      })
    }
    
    
  };

  obtainDuplicates = (searchSong) => {
    let out = [];
    // grab all IDs that match the song name + artist of the selected song
    this.state.duplicateData.forEach(item => {
      //console.log(item);
      if ((searchSong.name === item.name) && (searchSong.artist === item.artist)) {
        //console.log("match");
        out.push(item.id);
      }
    });
    //console.log(out);
    return out;
  };

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
              {this.state.hasSearched ? (
                <p>
                  Showing results for <em>{this.state.displayTerm}</em>
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
              <h2>Is "{this.state.song.name}" by {this.state.song.artist} viral?</h2>
              <h2>{this.state.isViral ? "Yes ✅" : "No ❌"}</h2>
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
