import React, { Component } from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import Link from './Link';
import '../styles/search.css';

const FEED_SEARCH_QUERY = gql`
  query FeedSearchQuery($filter: String!) {
    feed(filter: $filter) {
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
    }
  }
`;

class Search extends Component {
  state = {
    links: [],
    search: '',
    scrolled: window.scrollY > 26,
    touched: false,
  };

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    this.executeSearch();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
      touched: true,
    });
  };

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
      variables: { filter: search },
    });
    const links = result.data.feed.links;
    this.setState({ links, loading: false });
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
    if (e.target.value === 'recent') {
      this.setState({
        links: links.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
      });
    } else {
      this.setState({
        links: links.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)),
      });
    }
  };

  render() {
    const { search, links, scrolled, loading, touched } = this.state;
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
                  <option value="recent">Recent</option>
                  <option selected value="oldest">
                    Oldest
                  </option>
                </select>
              </div>
              <div className="search-info-stats">{links.length} results</div>
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
