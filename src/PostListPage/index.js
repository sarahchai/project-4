import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
import PostOnListPage from '../PostOnListPage';
import './style.css';


export default class PostListPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      posts: []
    }
  }

  componentDidMount = async () => {
    const allPostsResponse = await fetch('/api/posts', {
      method: 'GET'
    })

    const allPosts = await allPostsResponse.json();

    this.setState({
      posts: allPosts
    })
  }


  render() {
    return (
      <div className="list-page">
        <Link className="website-title" to="/"><h1>Code_the_Rant</h1></Link>
        {this.state.posts.map((post, i) => {
          return (
            <PostOnListPage
              key={i}
              content={post.content}
              postId={post.id}
              loggedIn={this.props.loggedIn}
            />
          )
        })}
      </div>
    )
  }
}
