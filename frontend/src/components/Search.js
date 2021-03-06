import React, { Component } from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import throttle from 'lodash.throttle';

import Link from './Link';
import Skeleton from './Skeleton';
import { LINKS_PER_PAGE } from '../constants';
import '../styles/search.css';

const FEED_SEARCH_QUERY = gql`
  query FeedSearchQuery($filter: String!, $first: Int, $orderBy: LinkOrderByInput) {
    feed(filter: $filter, first: $first, orderBy: $orderBy) {
      links {
        id
        url
        description
        createdAt
        voteCount
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

class Search extends Component {
  state = {
    links: [],
    search: '',
    scrolled: window.scrollY > 26,
    touched: false,
    count: 0,
    timeTaken: 0,
    orderBy: 'voteCount_ASC',
    initialLoad: true,
  };

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    this.executeSearch();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  executeSearch = async () => {
    const footerSearch = localStorage.getItem('search');

    this.setState({ loading: true });

    const { search, orderBy } = this.state;
    const startTime = new Date().getTime();

    const result = await this.props.client.query({
      query: FEED_SEARCH_QUERY,
      variables: { filter: footerSearch || search, first: LINKS_PER_PAGE, orderBy },
    });
    const { links, count } = result.data.feed;

    // set the value in the search field to the footerSearch if it exists
    if (footerSearch) this.setState({ search: footerSearch });
    localStorage.removeItem('search');

    this.setState({
      links,
      count,
      loading: false,
      timeTaken: new Date().getTime() - startTime,
      initialLoad: false,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    throttle(this.executeSearch, 1000);
  };

  _sortLinksByRecent = links => links.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  _sortLinksByOldest = links => links.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  _sortLinksByVotes = links => links.sort((a, b) => b.votes.length - a.votes.length);

  handleChange = e => {
    const { name, value } = e.target;
    const { touched } = this.state;
    if (touched) {
      this.setState(
        {
          [name]: value,
        },
        () => setTimeout(this.executeSearch, 500)
      );
    } else {
      this.setState(
        {
          [name]: value,
          touched: true,
        },
        () => setTimeout(this.executeSearch, 500)
      );
    }
  };

  resetSearch = () => {
    this.setState(
      {
        search: '',
        links: [],
        count: 0,
        timeTaken: 0,
      },
      this.executeSearch
    );
  };

  handleScroll = () => {
    const { scrolled, loading } = this.state;
    if (loading) return; // don't apply scrolling animation if loading
    if (window.scrollY > 26) return this.setState({ scrolled: true });
    if (scrolled && window.scrollY <= 26) return this.setState({ scrolled: false });
  };

  changeOrder = e => {
    const { links } = this.state;
    const { value } = e.target;
    switch (value) {
      case 'recent':
        this.setState({
          links: this._sortLinksByRecent(links),
          orderBy: 'createdAt_ASC',
        });
        break;

      case 'oldest':
        this.setState({
          links: this._sortLinksByOldest(links),
          orderBy: 'createdAt_DESC',
        });
        break;

      default:
        this.setState({
          links: this._sortLinksByVotes(links),
          orderBy: 'voteCount_DESC',
        });
        break;
    }
  };

  render() {
    const { search, links, scrolled, loading, touched, count, timeTaken, initialLoad } = this.state;
    return (
      <>
        <div className={`search orange ${scrolled && 'scrolled'}`}>
          <form className="search-form" onSubmit={this.handleSubmit}>
            <i className="fas fa-search" />
            <input
              placeholder="Search by URL or description"
              value={search}
              className="search-input"
              name="search"
              type="text"
              onChange={this.handleChange}
            />
            <button
              type="button"
              onClick={this.resetSearch}
              className={`search-reset ${
                // only show the circle if touched is true and search has a length
                touched && search.length ? 'circle-show' : touched && 'circle-hide'
              }`}
            >
              <i className="fas fa-circle" />
            </button>
          </form>
        </div>
        <div className={`search-info ${scrolled && 'scrolled-info'}`}>
          <div className="search-info-options">
            <span>Order By </span>
            <select onChange={this.changeOrder} name="order" id="order">
              <option defaultValue value="votes">
                Votes
              </option>
              <option value="recent">Recent</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
          <div className="search-info-stats">
            {links.length >= count ? links.length : `${links.length} out of ${count} total`} results
            | {timeTaken} ms
          </div>
        </div>
        {loading && initialLoad ? (
          <Skeleton />
        ) : (
          <div
            className={`search-results ph3 pv1 background-gray ${scrolled && 'scrolled-results'}`}
          >
            {!links.length ? (
              <div>No results found for {search}</div>
            ) : (
              links.map((link, index) => (
                <Link key={link.id} link={link} index={index} upvoteable={false} />
              ))
            )}
          </div>
        )}
      </>
    );
  }
}

export default withApollo(Search);
