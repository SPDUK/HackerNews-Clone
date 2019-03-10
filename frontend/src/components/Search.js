import React, { Component } from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import Link from './Link';
import { LINKS_PER_PAGE } from '../constants';
import '../styles/search.css';

const FEED_SEARCH_QUERY = gql`
  query FeedSearchQuery($filter: String!, $first: Int) {
    feed(filter: $filter, first: $first) {
      links {
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
  };

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    this.executeSearch();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  _sortLinksByRecent = links => links.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  _sortLinksByOldest = links => links.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  _sortLinksByVotes = links => links.sort((a, b) => b.votes.length - a.votes.length);

  handleChange = e => {
    const { name, value } = e.target;
    const { touched } = this.state;
    if (touched) {
      this.setState({
        [name]: value,
      });
    } else {
      this.setState({
        [name]: value,
        touched: true,
      });
    }
  };

  executeSearch = async e => {
    this.setState({ loading: true });
    // only prevent default if using the form submission
    if (e) e.preventDefault();

    const { search } = this.state;
    const result = await this.props.client.query({
      query: FEED_SEARCH_QUERY,
      variables: { filter: search, first: LINKS_PER_PAGE },
    });
    const { links, count } = result.data.feed;

    this.setState({ links: this._sortLinksByVotes(links), count, loading: false });
  };

  resetSearch = () => {
    this.setState({
      search: '',
      links: [],
    });
  };

  handleScroll = () => {
    if (window.scrollY > 26) return this.setState({ scrolled: true });
    if (this.state.scrolled && window.scrollY <= 26) return this.setState({ scrolled: false });
  };

  changeOrder = e => {
    const { links } = this.state;
    const { value } = e.target;
    switch (value) {
      case 'recent':
        this.setState({
          links: this._sortLinksByRecent(links),
        });
        break;

      case 'oldest':
        this.setState({
          links: this._sortLinksByOldest(links),
        });
        break;

      default:
        this.setState({
          links: this._sortLinksByVotes(links),
        });
        break;
    }
  };

  render() {
    const { search, links, scrolled, loading, touched, count } = this.state;
    return (
      <>
        <div className={`search orange ${scrolled && 'scrolled'}`}>
          <form className="search-form" onSubmit={this.executeSearch}>
            <i className="fas fa-search" />
            <input
              placeholder="Search by title, url or author"
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
        {loading && !links ? (
          <div>Loading...</div>
        ) : (
          <>
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
                {links.length >= count ? links.length : `${links.length} out of ${count} total`}{' '}
                results
              </div>
            </div>
            <div
              className={`search-results ph3 pv1 background-gray ${scrolled && 'scrolled-results'}`}
            >
              {links.map((link, index) => (
                <Link key={link.id} link={link} index={index} />
              ))}
            </div>
          </>
        )}
      </>
    );
  }
}

export default withApollo(Search);
