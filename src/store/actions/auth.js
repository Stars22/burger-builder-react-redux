import * as actionTypes from './actionTypes'
import axios from 'axios'

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}

export const authFail = (err) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: err
    }
}

export const authSuccess = (idToken, localId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: idToken,
        userId: localId
    }
}

export const authLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId')
    return {
        type: actionTypes.AUTH_LOGOUT
    }
}
export const logoutTimeout = (timeout) => {
    return (dispatch) => {
        setTimeout(() => dispatch(authLogout()), timeout * 1000)
    }    
}

export const auth = (email, password, isSignUp) => {
    return dispatch => {
        dispatch(authStart());
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        };
        let url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyCc3yUuKqG8k3l8WJ8WiDA5QkQdqPe7LF0';
        if(!isSignUp) {
            url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyCc3yUuKqG8k3l8WJ8WiDA5QkQdqPe7LF0';
        }
        axios.post(url, authData)
            .then(response => {
                console.log(response);
                const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
                localStorage.setItem('token', response.data.idToken);
                localStorage.setItem('expirationDate', expirationDate);
                localStorage.setItem('userId', response.data.localId)
                dispatch(authSuccess(response.data.idToken, response.data.localId));
                dispatch(logoutTimeout(response.data.expiresIn));
            })
            .catch(err => {
                console.log(err.response)
                dispatch(authFail(err.response.data.error));
            });
    };
};

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    }
}

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        const url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo?key=AIzaSyCc3yUuKqG8k3l8WJ8WiDA5QkQdqPe7LF0'
        if(!token){
            dispatch(authLogout());
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            const userId = localStorage.getItem('userId');

            if(expirationDate > new Date()) {
                axios.post(url, {"idToken": token}).then(response => {
                    
                    const localId = response.data.users[0].localId;
                    console.log(localId)
                    dispatch(authSuccess(token, localId));
                    const timeSeconds = (expirationDate.getTime() - new Date().getTime()) / 1000;
                    dispatch(logoutTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
                })
                // dispatch(authSuccess(token, userId));
                // const timeSeconds = (expirationDate.getTime() - new Date().getTime()) / 1000;
                // dispatch(logoutTimeout(timeSeconds));
                
            } else {
                dispatch(authLogout())
            }
        }
    }
}