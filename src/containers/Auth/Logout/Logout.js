import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom';
import {authLogout} from '../../../store/actions/'
class Logout extends Component {
    componentDidMount() {
        this.props.onLogout();
        //this.props.history.push('/');
    }
    render() {
        return <Redirect to="/" />
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onLogout: () => dispatch(authLogout())
    }
}
export default connect(null, mapDispatchToProps)(Logout)