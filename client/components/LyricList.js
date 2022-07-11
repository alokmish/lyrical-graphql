import React, { Component } from "react";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

class LyricList extends Component {
  onLike(id, likes) {
    this.props.mutate({
      variables: { id },
      // * When the user clicks on the like button, the likes count takes time to update
      // * as it waits for the graphql mutation to return
      // * This may lead to poor UX due to the slight delay
      // * Hence, we use optimistic updates to update the count
      // * and then update the count again when the mutation returns
      optimisticResponse: {
        __typename: "Mutation",
        // ? The below object structure is copied directly from the graphql mutation response
        likeLyric: {
          id,
          __typename: "LyricType",
          likes: likes + 1,
        },
      },
    });
  }

  renderLyrics() {
    return this.props.lyrics.map(({ id, content, likes }) => {
      return (
        <li key={id} className="collection-item">
          {content}
          <div className="vote-box">
            <i
              className="material-icons"
              onClick={() => this.onLike(id, likes)}
            >
              thumb_up
            </i>
            {likes}
          </div>
        </li>
      );
    });
  }

  render() {
    return <ul className="collection">{this.renderLyrics()}</ul>;
  }
}

const mutation = gql`
  mutation LikeLyric($id: ID) {
    likeLyric(id: $id) {
      id
      likes
    }
  }
`;

export default graphql(mutation)(LyricList);
