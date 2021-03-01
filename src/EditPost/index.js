import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
import './style.css';

export default class EditPost extends Component {
    constructor(props) {
        super(props)

        this.state = {
            text: '',
            editSubmitted: false
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

    componentDidMount = async () => {
        const findPostResponse = await fetch(`/api/posts/${this.props.match.params.id}`)
        const findPostInfo = await findPostResponse.json();

        this.setState({
            text: findPostInfo.content
        })
    }

    editPost = async () => {
        const id = this.props.match.params.id
        const body = JSON.stringify({
            content: this.state.text
        });

        const editPost = await fetch(`/api/posts/${id}`, {
            method: 'PUT',
            body: body,
            headers: {
                'Content-Type': 'application/json',
            }
        });

        this.setState({
            editSubmitted: true
        })
    }

    render() {
        if (this.state.editSubmitted) {
            return (
                <Redirect to={`/detail-post/${this.props.match.params.id}`} />
            )
        }
        return (
            <div className="write-rant-container">
                <form className="write-rant-form" onSubmit={this.onSubmit}>
                    <h3>Edit Rant</h3>
                    <textarea className="content-input" name="text" value={this.state.text} onChange={this.onChange} rows="10" cols="60" />
                    <button className="write-rant button" onClick={this.editPost}>Submit</button>
                </form>
            </div>
        )
    }
}
