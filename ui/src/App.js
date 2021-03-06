import React from 'react';
import 'bulma/css/bulma.css';
import { useAuth0 } from './contexts/auth0-context';
import Header from './components/Header';

function App() {
  const { isLoading, user, loginWithRedirect, logout } = useAuth0();

  return (
    <>
      <Header />
      <div className="hero is-info is-fullheight">
        <div className="hero-body">
          <div className="container has-text-centered">
            {!isLoading && !user &&
              <>
                <h1>SignIn/SignUp</h1>
                <button onClick={loginWithRedirect} className="button is-danger">
                  Login
              </button>
              </>
            }
            {!isLoading && user &&
              <>
                <h1>yOu are logged in</h1>
                <p>{user.name}</p>
                {user.picture && <img src={user.picture} alt="My Avatar" />}
                <hr />
                <button
                  onClick={() => logout({ returnTo: window.location.origin })}
                  className="button is-small is-dark">
                  Logout
              </button>
              </>
            }
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
