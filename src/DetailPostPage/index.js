import React, { Component } from 'react'
import CodeMirror from 'react-codemirror';
import './style.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/darcula.css';
import PostOnDetailPage from '../PostOnDetailPage';
import CommentOnDetailPage from '../CommentOnDetailPage';

export default class DetailPostPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            comments: [],
            code: '// Code Here',
        }
    }

    componentDidMount = async () => {
        const id = this.props.match.params.id;

        const commentsResponse = await fetch(`/api/comments/${id}`);

        const commentsBody = await commentsResponse.json();

        this.setState({
            comments: commentsBody
        });

    }

    onChangeCode = evt => {
        this.setState({
            code: evt
        })
    }

    submitComment = async () => {
        const id = this.props.match.params.id
        const body = JSON.stringify({
            code: this.state.code,
            postId: id
        });

        const addCommentResponse = await fetch('/api/comments', {
            method: 'POST',
            body: body,
            headers: {
                'Content-Type': 'application/json',
                'jwt-token': localStorage.getItem('user-jwt')
            }
        });

        const commentsResponse = await fetch(`/api/comments/${id}`);
        const commentsBody = await commentsResponse.json();

        this.setState({
            comments: commentsBody,
            code: '// Code Here',
        })
    }

    render() {
        const inputOptions = {
            lineNumbers: true,
            mode: "javascript",
            theme: "darcula"
        };
        return (
            <div className="detail-post-page-container">
                <div className="post-detail-page">
                <PostOnDetailPage postId={this.props.match.params.id} loggedIn={this.props.loggedIn} />
                </div>
                {this.state.comments.map((comment,i) => {
                    return (
                        <CommentOnDetailPage 
                        key={i}
                        postId={this.props.match.params.id} 
                        loggedIn={this.props.loggedIn} 
                        code={comment.code}
                        commentId={comment.id}
                        authorId={comment.userId}
                        />
                    )
                })}
                {this.props.loggedIn && (
                    <div className="submit-comment-container" >
                        <CodeMirror key={"codemirror-" + this.state.comments.length} value={this.state.code} onChange={this.onChangeCode} options={inputOptions} />
                        <div>
                            <button className="comment-submit-button" onClick={this.submitComment}>Submit</button>
                        </div>
                    </div>
                )}
            </div>
        )
    }
}
