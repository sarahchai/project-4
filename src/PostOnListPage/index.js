import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
import './style.css';

export default class PostOnListPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            postLiked: false,
            numberOfLikes: '',
            numberOfComments: ''
        }
    }

    componentDidMount = async () => {
        const likesResponse = await fetch(`/api/liked-users/${this.props.postId}`)
        const likesInfo = await likesResponse.json();

        const commentsResponse = await fetch(`/api/comments/${this.props.postId}`);
        const commentsBody = await commentsResponse.json();

        if (this.props.loggedIn) {
            const userInfoResponse = await fetch('/api/current-user', {
                method: 'GET',
                headers: {
                    'jwt-token': localStorage.getItem('user-jwt')
                }
            });

            const userInfoBody = await userInfoResponse.json();

            const likedUserIds = likesInfo.map(info => info.userId);

            if (likedUserIds.includes(userInfoBody.id)) {
                this.setState({
                    postLiked: true
                })
            }
        }

        this.setState({
            numberOfLikes: likesInfo.length,
            numberOfComments: commentsBody.length
        })
    }

    render() {
        return (
            <div className="list-page-post">
                <Link className="list-page post-link" to={'/detail-post/' + this.props.postId}><p className="list-page post-content">{this.props.content}</p></Link>
                <div className="list-post-numbers">
                    {!this.state.postLiked && (
                        <p className="post-numbers post-likes" ><span>🖤</span>{this.state.numberOfLikes}</p>
                    )}
                    {this.state.postLiked && (
                        <p className="post-numbers post-likes clicked" style={{ color: 'red' }}><span>❤️</span>{this.state.numberOfLikes}</p>
                    )}
                    <p className="post-numbers comments-number"><span>💻</span>{this.state.numberOfComments}</p>
                </div>
            </div>
        )
    }
}
