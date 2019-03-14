import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

const SIGNUP_MUTATION = gql`
  mutation signupMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation loginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

class Login extends Component {
  state = {
    login: true, // switch between Login and SignUp
    email: '',
    password: '',
    name: '',
  };

  confirm = async ({ login, signup }) => {
    const { token } = this.state.login ? login : signup;
    localStorage.setItem('auth-token', token);
    this.props.history.push(`/`);
  };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  toggleLogin = () => {
    this.setState(prevState => ({
      login: !prevState.login,
    }));
  };

  render() {
    const { login, email, password, name } = this.state;
    return (
      <div className="ph3 pv1 background-gray">
        <h4 className="mv3">{login ? 'Login' : 'Sign Up'}</h4>
        <Mutation
          mutation={login ? LOGIN_MUTATION : SIGNUP_MUTATION}
          variables={{ email, password, name }}
          onCompleted={data => this.confirm(data)}
        >
          {(mutation, { error, loading }) => (
            <form
              onSubmit={e => {
                e.preventDefault();
                mutation();
              }}
              className="form flex flex-column"
            >
              {error && <div className="red">{error.message.split(':')[1]}</div>}
              {!login && (
                <input
                  name="name"
                  value={name}
                  onChange={this.handleChange}
                  type="text"
                  placeholder="Your name"
                />
              )}
              <input
                name="email"
                value={email}
                onChange={this.handleChange}
                type="text"
                placeholder="Your email address"
              />
              <input
                name="password"
                value={password}
                onChange={this.handleChange}
                type="password"
                placeholder="Choose a safe password"
              />
              <div className="flex mt3">
                <button disabled={loading} className="pointer mr2 button" onClick={mutation}>
                  {login ? 'login' : 'create account'}
                </button>
                <div className="pointer button" onClick={this.toggleLogin}>
                  {login ? 'need to create an account?' : 'already have an account?'}
                </div>
              </div>
            </form>
          )}
        </Mutation>
      </div>
    );
  }
}

Login.propTypes = {
  history: PropTypes.object.isRequired,
};
export default Login;
