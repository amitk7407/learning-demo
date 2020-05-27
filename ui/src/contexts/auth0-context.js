import React, { createContext, useState, useEffect, useContext } from 'react';
import createAuth0Client from '@auth0/auth0-spa-js';

export const Auth0Context = createContext();
export const useAuth0 = () => useContext(Auth0Context);

export const Auth0Provider = (props) => {
    const [auth0Client, setAuth0Client] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    const config = {
        domain: process.env.REACT_APP_AUTH0_DOMAIN,
        client_id: process.env.REACT_APP_AUTH0_CLIENT_ID,
        redirect_uri: window.location.origin
    }

    useEffect(() => {
        const initializeAuth0 = async () => {
            const auth0Client = await createAuth0Client(config);
            setAuth0Client(auth0Client);

            if (window.location.search.includes("code=")) {
                return handleRedirectCallback(auth0Client);
            }
            const isAuthenticated = await auth0Client.isAuthenticated();
            const user = isAuthenticated ? await auth0Client.getUser() : null;

            setIsLoading(false);
            setIsAuthenticated(isAuthenticated);
            setUser(user);
        };

        initializeAuth0();
    }, []);

    const handleRedirectCallback = async (auth0Client) => {
        setIsLoading(true);
        await auth0Client.handleRedirectCallback();
        const user = await auth0Client.getUser();
        setIsLoading(false);
        setIsAuthenticated(true);
        setUser(user);

        window.history.replaceState({}, document.title, window.location.pathname);
    }

    const configObject = {
        isLoading,
        isAuthenticated,
        user,
        loginWithRedirect: (...p) => auth0Client.loginWithRedirect(...p),
        getTokenSilently: (...p) => auth0Client.getTokenSilently(...p),
        getIdTokenClaims: (...p) => auth0Client.getIdTokenClaims(...p),
        logout: (...p) => auth0Client.logout(...p)
    };

    return (
        <Auth0Context.Provider value={configObject}>
            {props.children}
        </Auth0Context.Provider>
    )
}