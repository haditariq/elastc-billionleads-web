import React, { Component } from "react";
import { Button } from "reactstrap";

class JobTitleSearch extends Component {
  state = {};

  render() {
    return (
      <React.Fragment>
        <p> Search Job Title</p>
        <div style={Styles.mainDiv}>
          <input
            style={Styles.input}
            value={this.props.job_title}
            onChange={(e) => this.props.setTitle(e.target.value)}
            type="text"
            className="form-group form-control"
          />

          {/* <Button>Search</Button> */}
        </div>
      </React.Fragment>
    );
  }
}

export default JobTitleSearch;

const Styles = {
  main: {
    marginTop: "10px",
  },
  input: {
    width: "100%",
  },
  mainDiv: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
};
