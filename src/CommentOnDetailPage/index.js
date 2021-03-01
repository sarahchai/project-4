import React, { Component } from 'react'
import CodeMirror from 'react-codemirror';
import './style.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/base16-light.css';
import 'codemirror/theme/darcula.css';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';

export default class CommentOnDetailPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      commentLiked: false,
      numberOfLikes: '',
      username: '',
      isCurrentUserWriter: false,
      editClicked: false,
      editSubmited: false,
      editedCode: '' || this.props.code,
      deleteComment: false,
    }
  }

  componentDidMount = async () => {
    const likesResponse = await fetch(`/api/liked-users-comment/${this.props.commentId}`)
    const likesInfo = await likesResponse.json();

    const authorResponse = await fetch(`/api/author/${this.props.authorId}`)
    const authorInfo = await authorResponse.json();

    if (this.props.loggedIn) {
      const currentUserInfoResponse = await fetch('/api/current-user', {
        method: 'GET',
        headers: {
          'jwt-token': localStorage.getItem('user-jwt')
        }
      });

      const currentUseruserInfoBody = await currentUserInfoResponse.json();
      const likedUserIds = likesInfo.map(info => info.userId);

      if (likedUserIds.includes(currentUseruserInfoBody.id)) {
        this.setState({
          commentLiked: true
        })
      }

      if (this.props.authorId === currentUseruserInfoBody.id) {
        this.setState({
          isCurrentUserWriter: true
        })
      }
    }

    this.setState({
      numberOfLikes: likesInfo.length,
      username: authorInfo.username
    })
  }

  addCommentLikes = async () => {
    const body = JSON.stringify({
      commentId: this.props.commentId
    })

    const likeCommentResponse = await fetch('/api/like-comment', {
      method: 'POST',
      body: body,
      headers: {
        'Content-Type': 'application/json',
        'jwt-token': localStorage.getItem('user-jwt')
      }
    });

    const likesResponse = await fetch(`/api/liked-users-comment/${this.props.commentId}`)
    const likesInfo = await likesResponse.json();

    this.setState({
      numberOfLikes: likesInfo.length,
      commentLiked: true
    })
  }

  editComment = () => {
    this.setState({
      editClicked: true
    })
  }

  onChangeCode = evt => {
    this.setState({
      editedCode: evt
    })
  }

  submitEditedComment = async () => {
    const body = JSON.stringify({
      code: this.state.editedCode
    });

    const editComment = await fetch(`/api/comments/${this.props.commentId}`, {
      method: 'PUT',
      body: body,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    this.setState({
      editClicked: false,
    })
  }

  deleteComment = async () => {
    const deleteComment = await fetch(`/api/comments/${this.props.commentId}`, {
      method: 'DELETE',
    });

    this.setState({
      deleteComment: true
    })
  }

  render() {
    const displayOptions = {
      lineNumbers: true,
      mode: "javascript",
      theme: "base16-light",
      readOnly: true
    };
    const editOptions = {
      lineNumbers: true,
      mode: "javascript",
      theme: "darcula"
    };
    return (
      <div className="comment-detail-page">
        {!this.state.deleteComment && (
          <div className="comment-container">
            <div className="comment-flex-element" >
              <p className="comment-username">{this.state.username}</p>

              {!this.state.commentLiked && (
                <button className="comment-like-button" onClick={this.addCommentLikes} ><p><span>🖤</span>{this.state.numberOfLikes}</p></button>
              )}

              {this.state.commentLiked && (
                <button className="comment-like-button after" ><p style={{ color: 'blue' }}><span>💙</span>{this.state.numberOfLikes}</p></button>
              )}

            </div>

            {!this.state.editClicked && (
              <div className="comment-flex-element">
                <CodeMirror value={this.state.editedCode} options={displayOptions} />
              </div>
            )}

            {this.state.editClicked && (
              <div className="comment-flex-element edit-comment">
                <CodeMirror value={this.state.editedCode} onChange={this.onChangeCode} options={editOptions} />
                <div>
                  <button className="comment-buttons" onClick={this.submitEditedComment} >Submit</button>
                </div>
              </div>
            )}

            {this.state.isCurrentUserWriter && !this.state.editClicked && (
              <div className="comment-flex-element author-buttons comments-buttons-container">
                <div>
                  <button className="comment-author-buttons" onClick={this.editComment} >Edit</button>
                </div>
                <div>
                  <button className="comment-author-buttons" onClick={this.deleteComment} >Delete</button>
                </div>
              </div>
            )}
          </div>
        )}
        {this.state.deleteComment && (<div></div>)}
      </div>
    )
  }
}
