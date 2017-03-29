console.log('clientside js loaded');

const app = (function(){

    const apiBaseURL = 'http://localhost:8080';
    const loginForm = document.querySelector('.login-form');
    const signupForm = document.querySelector('.signup-form');
    const logoutButton = document.querySelector('.logout-button');
    const loadingContainer = document.querySelector('.loading-container');
    const errorContainer = document.querySelector('.error-container');
    const profileName = document.querySelector('.profile-name');
    const profileEmail = document.querySelector('.profile-email');
    const loginLink = document.querySelector('.login-link');
    const signupLink = document.querySelector('.signup-link');

    const render = (state) => {
        Array.prototype.slice
            .call(document.querySelectorAll('.view'))
            .forEach((element) => element.classList.add('hidden'));
        document.querySelector(`.view.${state.view}`).classList.remove('hidden');

        const user = state.user;
        if (user.username) {
            profileName.innerText = user.username;
            profileEmail.innerText = user.email;
        }

        if (state.loggedIn) {
            logoutButton.classList.remove('hidden');
        } else {
            logoutButton.classList.add('hidden');
        }

        errorContainer.innerText = state.error;
        if (state.error) {
            errorContainer.classList.add('active');
        } else {
            errorContainer.classList.remove('active');
        }

        if (state.isLoading) {
            loadingContainer.classList.add('active');
        } else {
            loadingContainer.classList.remove('active');
        }
    }

    let state = {
        isLoading: true,
        loggedIn: false,
        user: {
            username: '',
            email: '',
        },
        view: 'signup',
        error: '',
    }

    const source = {
        login: (formData) => request('POST', apiBaseURL + '/login', formData, (err, res) => {
            if(err) {
                Object.assign(state, {
                    isLoading: false,
                    error: err,
                })
            } else {
                Object.assign(state, {
                    isLoading: false,
                    loggedIn: true,
                    view: 'profile',
                    error: '',
                })
                source.getUser();
            }
            render(state);
        }),
        signup: (formData) => request('POST', apiBaseURL + '/signup', formData, (err, res) => {
            if(err) {
                Object.assign(state, {
                    isLoading: false,
                    error: err,
                })
            } else {
                Object.assign(state, {
                    isLoading: false,
                    view: 'login',
                    error: '',
                });
            }
            render(state)
        }),
        getUser: (callback) => request('GET', apiBaseURL + '/user', null, (err, user) => {
            if(callback) {
                return callback(err, user);
            }
            if(err) {
                Object.assign(state, {
                    isLoading: false,
                    view: 'login',
                    error: err,
                })
            } else {
                Object.assign(state, {
                    isLoading: false,
                    loggedIn: true,
                    view: 'profile',
                    user: user,
                    error: '',
                });
            }
            render(state);
        }),
        logout: () => request('POST', apiBaseURL + '/logout', null, (err, res) => {
            if (err) {
                Object.assign(state, {
                    isLoading: false,
                    view: 'login',
                    error: 'Whoops, couldn\'t log you out. That\'s strange.',
                })
            } else {
                Object.assign(state, {
                    isLoading: false,
                    loggedIn: false,
                    view: 'login',
                    error: '',
                })
            }
            render(state);
        })
    };

    const init = () => {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            source.login(formData);
        });
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            source.signup(formData);
        });
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            source.logout();
        })
        signupLink.addEventListener('click', (e) => {
            e.preventDefault();
            Object.assign(state, { view: 'signup' });
            render(state);
        })
        loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            Object.assign(state, { view: 'login' });
            render(state);
        })
        source.getUser((err, user) => {
            if(err) {
                Object.assign(state, {
                    isLoading: false,
                    view: 'login',
                    error: '',
                })
            } else {
                Object.assign(state, {
                    isLoading: false,
                    loggedIn: true,
                    view: 'profile',
                    user: user,
                    error: '',
                });
            }
            render(state);
        });
    };
    return {
        init: init,
        source: source,
        state: state,
    };
})()

const gsgClient = app.init();
