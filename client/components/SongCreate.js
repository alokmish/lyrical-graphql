import React, { Component } from "react";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { Link, hashHistory } from "react-router";
import query from "../queries/fetchSongs";

class SongCreate extends Component {
  constructor(props) {
    super(props);

    this.state = { title: "" };
  }

  onSubmit(event) {
    event.preventDefault();

    this.props
      .mutate({
        // * Variables which will be available to the mutation
        variables: { title: this.state.title },
        // * Apollo will not automatically re-run the fetch songs query after a new song is created
        // * Apollo checks and realizes that it has already executed this query and just reuses the results
        // * To make Apollo refetch the songs, we explicitly ask it to refetch the query
        // ? We used this method of refetching query instead of the one in SongList component
        // ? because we are trying to fetch a query which is not associated with this component (passed as props)
        refetchQueries: [{ query }],
        // * Full syntax
        // * refetchQueries: [{ query: <query goes here>, variables: <variables go here> }],
      })
      .then(() => hashHistory.push("/"));
  }

  render() {
    return (
      <div>
        <Link to="/">Back</Link>
        <h3>Create a New Song</h3>
        <form onSubmit={this.onSubmit.bind(this)}>
          <label>Song Title:</label>
          <input
            onChange={(event) => this.setState({ title: event.target.value })}
            value={this.state.title}
          />
        </form>
      </div>
    );
  }
}

// * This is how we declare the mutation when we want to pass parameters to it
const mutation = gql`
  mutation AddSong($title: String) {
    addSong(title: $title) {
      title
    }
  }
`;

export default graphql(mutation)(SongCreate);
