import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Link extends Component {
  render() {
    const {
      link: { description, url },
    } = this.props;
    return (
      <div>
        <div>
          {description} ({url})
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
};

export default Link;
