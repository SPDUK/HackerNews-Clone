import React, { Component } from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import Link from './Link';
import '../styles/search.css';

class Search extends Component {
  state = {
    links: [],
    search: '',
  };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  executeSearch = e => {
    e.preventDefault();
    console.log('searching...');
  };

  resetSearch = () => {
    this.setState({
      search: '',
      links: [],
    });
  };

  render() {
    const { search, links } = this.state;
    return (
      <div className="search">
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
          <button type="button" onClick={this.resetSearch} className="search-reset">
            <i className={`${search.length > 0 && 'circle-show'} fas fa-circle`} />
          </button>
        </form>
        {links.map((link, index) => (
          <Link key={link.id} link={link} index={index} />
        ))}
      </div>
    );
  }
}

export default withApollo(Search);
