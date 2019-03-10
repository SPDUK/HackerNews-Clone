import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import Footer from './Footer';
import Link from './Link';

import { LINKS_PER_PAGE } from '../constants';

const FEED_QUERY = gql`
  query FeedQuery($first: Int, $skip: Int, $orderBy: LinkOrderByInput) {
    feed(first: $first, skip: $skip, orderBy: $orderBy) {
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
      count
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

const NEW_VOTES_SUBSCRIPTION = gql`
  subscription {
    newVote {
      id
      link {
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
      user {
        id
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
      // subscription query will fire every time a new link is created
      document: NEW_LINKS_SUBSCRIPTION,
      // determines how the store should be updated based on previous state
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const { newLink } = subscriptionData.data;
        const exists = prev.feed.links.find(({ id }) => id === newLink.id);
        if (exists) return prev;

        // merge the old feed with updates
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

  subscribeToNewVotes = subscribeToMore => {
    subscribeToMore({
      document: NEW_VOTES_SUBSCRIPTION,
    });
  };

  getLinksToRender = data => {
    if (this.props.location.pathname.includes('new')) return data.feed.links;

    const rankedLinks = [...data.feed.links];
    return rankedLinks.sort((a, b) => b.votes.length - a.votes.length);
  };

  nextPage = data => {
    const { match, history } = this.props;
    const page = parseInt(match.params.page, 10);
    if (page <= data.feed.count / LINKS_PER_PAGE) {
      const nextPage = page + 1;
      history.push(`/new/${nextPage}`);
    }
  };

  previousPage = () => {
    const { match, history } = this.props;
    const page = parseInt(match.params.page, 10);
    if (page > 1) {
      history.push(`/new/${page - 1}`);
    }
  };

  getQueryVariables = () => {
    // match is from the router with the path, url and page params
    const { location, match } = this.props;
    const isNewPage = location.pathname.includes('new');
    const page = parseInt(match.params.page, 10);

    const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0;
    const first = isNewPage ? LINKS_PER_PAGE : 100;
    const orderBy = isNewPage ? 'createdAt_DESC' : null;
    return { first, skip, orderBy };
  };

  render() {
    const { match, location } = this.props;
    return (
      <>
        <Query query={FEED_QUERY} variables={this.getQueryVariables()}>
          {({ loading, error, data, subscribeToMore }) => {
            if (loading) return <div>Loading...</div>;
            if (error) return <div>Error</div>;

            this.subscribeToNewLinks(subscribeToMore);
            this.subscribeToNewVotes(subscribeToMore);

            const linksToRender = this.getLinksToRender(data);
            const isNewPage = location.pathname.includes('new');
            const pageIndex = match.params.page ? (match.params.page - 1) * LINKS_PER_PAGE : 0;
            const displayNext = match.params.page <= parseInt(data.feed.count / LINKS_PER_PAGE);
            return (
              <div className="ph3 pv1 background-gray">
                {linksToRender.map((link, index) => (
                  <Link
                    key={link.id}
                    index={index + pageIndex}
                    link={link}
                    updateStoreAfterVote={this.updateStoreAfterVote}
                  />
                ))}
                {isNewPage && (
                  <div className="flex ml4 mv3 gray">
                    {match.params.page > 1 && (
                      <div className="pointer mr2" onClick={this.previousPage}>
                        Previous
                      </div>
                    )}
                    {displayNext && (
                      <div className="pointer" onClick={() => this.nextPage(data)}>
                        Next
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          }}
        </Query>
        <Footer />
      </>
    );
  }
}
LinkList.propTypes = {
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default LinkList;
export { FEED_QUERY, NEW_LINKS_SUBSCRIPTION, NEW_VOTES_SUBSCRIPTION };
