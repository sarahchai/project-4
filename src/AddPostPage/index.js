import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
import './style.css';

export default class AddPostPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            text: '',
            postSubmitted: false
        }
    }

    onChange = evt => {
        this.setState({
            [evt.target.name]: evt.target.value
        })
    }

    onSubmit = (e) => {
        e.preventDefault();
    }

    addPost = async () => {
        const body = JSON.stringify({
            content: this.state.text
        });

        const addPostResponse = await fetch('/api/posts', {
            method: 'POST',
            body: body,
            headers: {
                'Content-Type': 'application/json',
                'jwt-token': localStorage.getItem('user-jwt')
            }
        });

        const addPostBody = await addPostResponse.json();

        this.setState({
            postSubmitted: true
        })
    }


    render() {
        if (this.state.postSubmitted) {
            return (
                <Redirect to='/' />
            )
        }
        return (
            <div className="write-rant-container">
                <form className="write-rant-form" onSubmit={this.onSubmit}>
                    <h3>Rant</h3>
                    <h4>as much as you want on whatever topic you want.</h4>
                    <textarea className="content-input" name="text" value={this.state.text} onChange={this.onChange} rows="15" cols="70" />
                    <button className="write-rant button" onClick={this.addPost}>Submit</button>
                </form>
            </div>
        )
    }
}
