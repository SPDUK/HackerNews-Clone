import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Footer from './Footer';
import Link from './Link';

const FEED_QUERY = gql`
  query feedQuery {
    feed {
      links {
        id
        createdAt
        url
        description
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`;

class LinkList extends Component {
  updateStoreAfterVote = (store, createVote, linkId) => {
    const data = store.readQuery({ query: FEED_QUERY });

    const votedLink = data.feed.links.find(link => link.id === linkId);
    votedLink.votes = createVote.vote.link.votes;

    store.writeQuery({ query: FEED_QUERY, data });
  };

  render() {
    return (
      <>
        <Query query={FEED_QUERY}>
          {({ loading, error, data }) => {
            if (loading) return <div>Loading...</div>;
            if (error) return <div>Error</div>;

            return (
              <div className="ph3 pv1 background-gray">
                {data.feed.links.map((link, index) => (
                  <Link
                    key={link.id}
                    index={index}
                    link={link}
                    updateStoreAfterVote={this.updateStoreAfterVote}
                  />
                ))}
              </div>
            );
          }}
        </Query>
        <Footer />
      </>
    );
  }
}

export default LinkList;
export { FEED_QUERY };
