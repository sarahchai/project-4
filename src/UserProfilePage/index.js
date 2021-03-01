import React, { Component } from 'react'
import PostOnListPage from '../PostOnListPage';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
import CodeMirror from 'react-codemirror';
import './style.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/base16-light.css';
import 'codemirror/theme/darcula.css';
import CommentOnProfilePage from '../CommentOnProfilePage';

export default class UserProfilePage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            username: '',
            email: '',
            createdAt: '',
            authoredPosts: null,
            authoredComments: null,
            likedPosts: null,
            likedComments: null,
        }
    }

    componentWillMount = async () => {
        const userInfoResponse = await fetch('/api/current-user', {
            method: 'GET',
            headers: {
                'jwt-token': localStorage.getItem('user-jwt')
            }
        });

        const userInfoBody = await userInfoResponse.json();

        const createdDate = new Date(userInfoBody.createdAt).toDateString();

        this.setState({
            username: userInfoBody.username,
            email: userInfoBody.email,
            createdAt: createdDate
        })
    }

    viewWrittenPosts = async () => {
        const writtenPostsResponse = await fetch('/api/authored-posts', {
            method: 'GET',
            headers: {
                'jwt-token': localStorage.getItem('user-jwt')
            }
        });
        const writtenPosts = await writtenPostsResponse.json();

        this.setState({
            authoredPosts: writtenPosts,
            authoredComments: null,
            likedPosts: null,
            likedComments: null,
        })
    }

    viewWrittenComments = async () => {
        const writtenCommentsResponse = await fetch('/api/authored-comments', {
            method: 'GET',
            headers: {
                'jwt-token': localStorage.getItem('user-jwt')
            }
        });
        const writtenComments = await writtenCommentsResponse.json();

        this.setState({
            authoredPosts: null,
            authoredComments: writtenComments,
            likedPosts: null,
            likedComments: null,
        })
    }

    viewLikedPosts = async () => {
        const likedPostsResponse = await fetch('/api/liked-post', {
            method: 'GET',
            headers: {
                'jwt-token': localStorage.getItem('user-jwt')
            }
        });

        const likedPostsBody = await likedPostsResponse.json();

        if (likedPostsBody) {
            this.setState({
                authoredPosts: null,
                authoredComments: null,
                likedPosts: likedPostsBody,
                likedComments: null,
            })
        }
    }

    viewLikedComments = async () => {
        const likedCommentsResponse = await fetch('/api/liked-comments', {
            method: 'GET',
            headers: {
                'jwt-token': localStorage.getItem('user-jwt')
            }
        });

        const likedCommentsBody = await likedCommentsResponse.json();

        if (likedCommentsBody) {
            this.setState({
                authoredPosts: null,
                authoredComments: null,
                likedPosts: null,
                likedComments: likedCommentsBody
            })
        }
    }


    render() {
        return (
            <div className="user-profile-page-container">
                <div className="user-information-container">
                    <h2 className="username" >Hi, {this.state.username}</h2>
                    <div className="user-information">
                        <p>Email: {this.state.email}</p>
                        <p>Sign-up On {this.state.createdAt}</p>
                    </div>
                </div>
                <div className="profile-page-buttons">
                    {!this.state.authoredPosts && <button className="profile-button" onClick={this.viewWrittenPosts}>View Written Posts</button>}
                    {this.state.authoredPosts && <button className="profile-button clicked" onClick={this.viewWrittenPosts}>View Written Posts</button>}
                    {!this.state.authoredComments && <button className="profile-button" onClick={this.viewWrittenComments}>View Written Comments</button>}
                    {this.state.authoredComments && <button className="profile-button clicked" onClick={this.viewWrittenComments}>View Written Comments</button>}
                    {!this.state.likedPosts && <button className="profile-button" onClick={this.viewLikedPosts}>View Liked Posts</button>}
                    {this.state.likedPosts && <button className="profile-button clicked" onClick={this.viewLikedPosts}>View Liked Posts</button>}
                    {!this.state.likedComments && <button className="profile-button" onClick={this.viewLikedComments}>View Liked Comments</button>}
                    {this.state.likedComments && <button className="profile-button clicked" onClick={this.viewLikedComments}>View Liked Comments</button>}
                </div>

                {this.state.authoredPosts && this.state.authoredPosts.map(post => {
                    return (
                        <PostOnListPage
                            key={post.id}
                            postId={post.id}
                            content={post.content}
                            loggedIn={this.props.loggedIn}
                        />
                    )
                })}

                {this.state.authoredComments && this.state.authoredComments.map(comment => {
                    return (
                        <CommentOnProfilePage
                            key={comment.id}
                            code={comment.code}
                            postId={comment.postId}
                        />
                    )
                })}

                {this.state.likedPosts && this.state.likedPosts.map(post => {
                    return (
                        <PostOnListPage
                            key={post.id}
                            postId={post.id}
                            content={post.content}
                            loggedIn={this.props.loggedIn}
                        />
                    )
                })}

                {this.state.likedComments && this.state.likedComments.map(comment => {
                    return (
                        <CommentOnProfilePage
                            key={comment.id}
                            code={comment.code}
                            postId={comment.postId}
                        />
                    )
                })}
            </div>
        )
    }
}
