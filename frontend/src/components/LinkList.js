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

const NEW_LINKS_SUBSCRIPTION = gql`
  subscription {
    newLink {
      id
      url
      description
      createdAt
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
`;

class LinkList extends Component {
  updateStoreAfterVote = (store, createVote, linkId) => {
    const data = store.readQuery({ query: FEED_QUERY });

    const votedLink = data.feed.links.find(link => link.id === linkId);
    votedLink.votes = createVote.vote.link.votes;

    store.writeQuery({ query: FEED_QUERY, data });
  };

  subscribeToNewLinks = subscribeToMore => {
    subscribeToMore({
      // fire every time a new link is created
      document: NEW_LINKS_SUBSCRIPTION,
      // determines how the store should be updated based on previous state
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newLink = subscriptionData.data.newLink;
        const exists = prev.feed.links.find(({ id }) => id === newLink.id);
        if (exists) return prev;

        return Object.assign({}, prev, {
          feed: {
            links: [newLink, ...prev.feed.links],
            count: prev.feed.links.length + 1,
            __typename: prev.feed.__typename,
          },
        });
      },
    });
  };

  render() {
    return (
      <>
        <Query query={FEED_QUERY}>
          {({ loading, error, data, subscribeToMore }) => {
            if (loading) return <div>Loading...</div>;
            if (error) return <div>Error</div>;

            this.subscribeToNewLinks(subscribeToMore);

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
export { FEED_QUERY, NEW_LINKS_SUBSCRIPTION };
