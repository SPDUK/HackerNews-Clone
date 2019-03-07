import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

class Header extends Component {
  logout = () => {
    localStorage.removeItem('auth-token');
    this.props.history.push(`/`);
  };

  render() {
    const authToken = localStorage.getItem('auth-token');
    return (
      <div className="flex pa1 justify-between nowrap orange">
        <div className="flex flex-fixed black">
          <div className="fw7 mr1">Hacker News</div>
          <Link to="/" className="ml1 no-underline black">
            new
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
        <div className="flex flex-fixed">
          {authToken ? (
            <div
              role="button"
              tabIndex="-1"
              className="ml1 pointer black"
              onClick={this.logout}
              onKeyDown={this.logout}
            >
              logout
            </div>
          ) : (
            <Link to="/login" className="ml1 no-underline black">
              login
            </Link>
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(Header);
