import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import PropTypes from 'prop-types';

const POST_LINK = gql`
  mutation POST_LINK($description: String!, $url: String!) {
    post(description: $description, url: $url) {
      id
      createdAt
      url
      description
    }
  }
`;

class CreateLink extends Component {
  state = {
    description: '',
    url: '',
  };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  render() {
    const { description, url } = this.state;
    const { history } = this.props;
    return (
      <div>
        <div className="flex flex-column mt3">
          <input
            name="description"
            className="mb2"
            value={description}
            onChange={this.handleChange}
            type="text"
            placeholder="A description for the link"
          />
          <input
            name="url"
            className="mb2"
            value={url}
            onChange={this.handleChange}
            type="text"
            placeholder="The URL for the link"
          />
        </div>
        <Mutation
          mutation={POST_LINK}
          variables={{ description, url }}
          onCompleted={() => history.push('/')}
        >
          {postLink => (
            <button type="button" onClick={postLink}>
              Submit
            </button>
          )}
        </Mutation>
      </div>
    );
  }
}

// TODO: add loading and error to POST_LINK
CreateLink.propTypes = {
  history: PropTypes.object.isRequired,
};

export default CreateLink;
