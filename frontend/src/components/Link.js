import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import timeDifferenceForDate from '../utils/timeDifferenceForDate';

const VOTE_MUTATION = gql`
  mutation VoteMutation($linkId: ID!) {
    vote(linkId: $linkId) {
      id
      link {
        votes {
          id
          user {
            id
          }
        }
      }
      user {
        id
      }
    }
  }
`;
class Link extends Component {
  render() {
    const {
      index,
      link: { description, url, postedBy, votes, createdAt, id },
      updateStoreAfterVote,
    } = this.props;
    const authToken = localStorage.getItem('auth-token');
    return (
      <div className="flex mt2 items-start">
        <div className="flex items-center">
          <span className="gray">{index + 1}.</span>
          {authToken && (
            <Mutation
              mutation={VOTE_MUTATION}
              variables={{ linkId: id }}
              // update the cache after the current mutation finishes
              update={(store, { data: vote }) => updateStoreAfterVote(store, vote, id)}
            >
              {voteMutation => (
                <button className="ml1 f11 upvote" onClick={voteMutation}>
                  ▲
                </button>
              )}
            </Mutation>
          )}
        </div>
        <div className="ml1">
          <div>
            {description} ({url})
          </div>
          <div className="f6 lh-copy gray">
            {votes.length} votes | by {postedBy ? postedBy.name : 'Unknown'}{' '}
            {timeDifferenceForDate(createdAt)}
          </div>
        </div>
      </div>
    );
  }
}
Link.propTypes = {
  link: PropTypes.shape({
    description: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }),
  index: PropTypes.number.isRequired,
  updateStoreAfterVote: PropTypes.func.isRequired,
};

export default Link;
