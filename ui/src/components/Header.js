import React from 'react';
import { useAuth0 } from '../contexts/auth0-context';
import './Header.css';

export default () => {
    const { isLoading, user, loginWithRedirect, logout } = useAuth0();

    return (
        <header>
            <nav className="navabr is-dark">
                <div className="container">
                    <div className="navbar-menu is-active">
                        {/* logo */}
                        <div className="navbar-brand">
                            <button className="navbar-item">Learning App</button>
                        </div>
                        {/* Menu items */}
                        <div className="navbar-end">
                            {!isLoading && !user &&
                                <button onClick={loginWithRedirect} className="navbar-item">
                                    Login
                                </button>
                            }
                            {!isLoading && user &&
                                <button
                                    onClick={() => logout({ returnTo: window.location.origin })}
                                    className="navbar-item"
                                >
                                    Logout
                                </button>
                            }
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}
