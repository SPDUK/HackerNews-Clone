import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import PropTypes from 'prop-types';
import { FEED_QUERY } from './LinkList';
import { LINKS_PER_PAGE } from '../constants';

const POST_LINK = gql`
  mutation postLink($description: String!, $url: String!) {
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
    errors: '',
  };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  showErrors = (...args) => <div className="red">{args}</div>;

  onSubmit = fn => {
    const { description, url } = this.state;
    if (description.length < 5) {
      return this.setState({
        errors: 'Description too short!, must be 5 characters minimum',
      });
    }
    if (url.length < 5) {
      return this.setState({
        errors: 'URL too short!, must be 5 characters minimum',
      });
    }
    this.setState({ errors: '' });

    let tempURL = url.slice();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      tempURL = `https://${tempURL}`;
    }

    this.setState(
      {
        url: tempURL,
        description,
      },
      () => fn()
    );
  };

  render() {
    const { description, url, errors } = this.state;
    const { history } = this.props;
    return (
      <div className="ph3 pv1 background-gray">
        <Mutation
          mutation={POST_LINK}
          variables={{ description, url }}
          onCompleted={() => history.push('/new/1')}
          update={(store, { data: { post } }) => {
            const first = LINKS_PER_PAGE;
            const skip = 0;
            const orderBy = 'createdAt_DESC';
            const data = store.readQuery({
              query: FEED_QUERY,
              variables: { first, skip, orderBy },
            });
            data.feed.links.unshift(post);
            store.writeQuery({
              query: FEED_QUERY,
              data,
              variables: { first, skip, orderBy },
            });
          }}
        >
          {(postLink, { error, loading }) => (
            <form onSubmit={() => this.onSubmit(postLink)} className="form flex flex-column mt3">
              {this.showErrors(error, errors)}
              <input
                name="url"
                className="mb2"
                value={url}
                onChange={this.handleChange}
                type="text"
                placeholder="The URL for the link"
                minLength="5"
                required
              />
              <input
                name="description"
                className="mb2"
                value={description}
                onChange={this.handleChange}
                type="text"
                placeholder="Description"
                required
                minLength="5"
              />
              <button
                disabled={loading}
                className="pointer div button"
                onClick={() => this.onSubmit(postLink)}
              >
                Submit
              </button>
            </form>
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
export { FEED_QUERY };
