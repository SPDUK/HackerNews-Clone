import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import '../styles/footer.css';

class Footer extends Component {
  state = {
    search: '',
  };

  onSubmit = e => {
    const { search } = this.state;
    const { history } = this.props;
    console.log(this.state);
    e.preventDefault();
    localStorage.setItem('search', search);
    window.scrollTo(0, 0);
    history.push('/search');
  };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  render() {
    const { search } = this.state;
    const authToken = localStorage.getItem('auth-token');

    return (
      <footer className="pv1 background-gray">
        <div className="footer">
          <div onClick={() => window.scrollTo(0, 0)} className="footer-links">
            <Link to="/" className="ml1 no-underline black">
              new
            </Link>
            <div className="ml1">|</div>
            <Link to="/top" className="ml1 no-underline black">
              top
            </Link>
            <div className="ml1">|</div>
            <Link to="/search" className="ml1 no-underline black">
              search
            </Link>
            {authToken && (
              <div className="flex">
                <div className="ml1">|</div>
                <Link to="/create" className="ml1 no-underline black">
                  submit
                </Link>
              </div>
            )}
          </div>
          <form onSubmit={this.onSubmit} className="footer-search gray">
            <label htmlFor="search">
              Search:{' '}
              <input value={search} onChange={this.handleChange} name="search" type="text" />
            </label>
          </form>
        </div>
      </footer>
    );
  }
}
Footer.propTypes = {
  history: PropTypes.object.isRequired,
};

export default withRouter(Footer);
