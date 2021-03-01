import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
import CodeMirror from 'react-codemirror';
import './style.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/base16-light.css';
import 'codemirror/theme/darcula.css';

export default class CommentOnProfilePage extends Component {
    render() {
        const displayOptions = {
            lineNumbers: true,
            mode: "javascript",
            theme: "base16-light",
            readOnly: true
        };
        return (
            <div className="profile-comment-view-container">
                <CodeMirror value={this.props.code} options={displayOptions} />
                <Link to={'/detail-post/' + this.props.postId}><button className="profile-comment-button">View Post</button></Link>
            </div>
        )
    }
}
