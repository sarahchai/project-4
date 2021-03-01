import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
import './style.css';

export default class PostOnDetailPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            post: {},
            numberOfLikes: '',
            authoredPost: false,
            postLiked: false,
            isCurrentUserWriter: false,
            postDeleted: false,
        }
    }

    componentDidMount = async () => {

        const findPostResponse = await fetch(`/api/posts/${this.props.postId}`)
        const findPostInfo = await findPostResponse.json();

        const likesResponse = await fetch(`/api/liked-users/${this.props.postId}`)
        const likesInfo = await likesResponse.json();

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

            if (findPostInfo.userId === userInfoBody.id) {
                this.setState({
                    isCurrentUserWriter: true
                })
            }
        }

        this.setState({
            post: findPostInfo,
            numberOfLikes: likesInfo.length
        })
    }

    addPostLikes = async () => {
        const body = JSON.stringify({
            postId: this.props.postId
        })

        const likePostResponse = await fetch('/api/like-posts', {
            method: 'POST',
            body: body,
            headers: {
                'Content-Type': 'application/json',
                'jwt-token': localStorage.getItem('user-jwt')
            }
        });

        const likesResponse = await fetch(`/api/liked-users/${this.props.postId}`)
        const likesInfo = await likesResponse.json();

        this.setState({
            numberOfLikes: likesInfo.length,
            postLiked: true
        })
    }

    deletePost = async () => {
        const deletePost = await fetch(`/api/posts/${this.props.postId}`, {
            method: 'DELETE',
        });

        this.setState({
            postDeleted: true
        })
    }

    render() {
        if (this.state.postDeleted) {
            return (
                <Redirect to="/" />
            )
        }

        return (
            <div className="post-detail-page-container" >

                <p className="detail-page post-content">{this.state.post.content}</p>

                {!this.state.postLiked && (
                    <div>
                        <button className="post-like-button" onClick={this.addPostLikes} ><p><span>🖤</span>{this.state.numberOfLikes}</p></button>
                    </div>
                )}

                {this.state.postLiked && (
                    <div>
                        <button className="post-like-button after" ><p style={{ color: 'red' }}><span>❤️</span>{this.state.numberOfLikes}</p></button>
                    </div>
                )}


                {this.state.isCurrentUserWriter && (
                    <div className="author-buttons post" >
                        <Link to={`/edit-post/${this.props.postId}`} ><button className="post-authored-button">Edit</button></Link>
                        <button className="post-authored-button" onClick={this.deletePost} >Delete</button>
                    </div>
                )}

            </div>
        )
    }
}
