const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const { User, Post, Comment, UserPostLike, UserCommentLike } = require('./models');

const PORT = process.env.PORT || 5678;
const jwtSecret = '1029code**the**rant3847'

const app = express();

app.use(bodyParser.json());

app.use("/", express.static("./build/"));

app.post('/api/register', async (request, response) => {
  const { username, password, email } = request.body;
  if (!username || !password || !email) {
    response.status(400).json({
      message: 'Everything should be answered.'
    })
    return;
  }

  const checkForUsername = await User.findOne({
    where: {
      username: username
    }
  })

  const checkForEmail = await User.findOne({
    where: {
      username: email
    }
  })

  if (checkForUsername) {
    response.status(409).json({
      message: 'The username has been used.'
    })
    return;
  }

  if (checkForEmail) {
    response.status(409).json({
      message: 'The email has been used.'
    })
    return;
  }

  const hashPassword = await bcrypt.hash(
    password,
    12
  );

  const newUser = await User.create({
    username: username,
    email: email,
    passwordDigest: hashPassword,
  })

  const jwtToken = jwt.sign({ userId: newUser.id }, jwtSecret);
  response.status(200).json(jwtToken);
})


app.post('/api/login', async (request, response) => {
  const { username, password } = request.body;
  if (!username || !password) {
    response.status(400).json({
      message: 'Invalid username and password'
    })
  }

  const registeredUser = await User.findOne({
    where: {
      username: username
    }
  })

  if (registeredUser === null) {
    response.status(401).json({
      message: 'Username not found'
    })
  }
  const checkPassword = await bcrypt.compare(password, registeredUser.passwordDigest);

  if (checkPassword) {
    const jwtToken = jwt.sign({ userId: registeredUser.id }, jwtSecret);
    response.json(jwtToken);
  } else {
    response.status(409).json({
      message: 'The user email and password does not match'
    })
  }
})

app.get('/api/current-user', async (request, response) => {
  const token = request.headers['jwt-token'];
  const verify = await jwt.verify(token, jwtSecret);
  const currentUser = await User.findOne({
    where: {
      id: verify.userId
    }
  })
  response.json(currentUser)
});

app.post('/api/posts', async (request, response) => {
  const token = request.headers['jwt-token'];

  const verify = await jwt.verify(token, jwtSecret);

  const content = request.body.content;

  const post = await Post.create({
    content: content,
    userId: verify.userId
  });

  response.status(200).json(post);
});

app.get('/api/posts', async (request, response) => {
  const allPosts = await Post.findAll({
    order: [['id', 'DESC']]
  });
  response.json(allPosts);
})

app.get('/api/posts/:id', async (request, response) => {
  const postId = request.params.id
  const postInfo = await Post.findOne({
    where: {
      id: postId
    }
  })
  response.json(postInfo);
})

app.post('/api/like-posts', async (request, response) => {
  const token = request.headers['jwt-token'];
  const verify = await jwt.verify(token, jwtSecret);
  const id = request.body.postId
  const postLiked = await UserPostLike.create({
    userId: verify.userId,
    postId: id
  });
  response.status(200).json(postLiked);
});


// /api/users-who-liked-post/:id
app.get('/api/liked-users/:id', async (request, response) => {
  const postId = request.params.id
  const likedPostInfo = await UserPostLike.findAll({
    where: {
      postId: postId
    }
  });

  response.json(likedPostInfo);
})


app.get('/api/liked-post', async (request, response) => {
  const token = request.headers['jwt-token'];
  const verify = await jwt.verify(token, jwtSecret);

  const userInfo = await User.findOne({
    where: {
      id: verify.userId
    }
  });

  const postsInfo = await userInfo.getLikedPosts();

  response.json(postsInfo);
})

app.post('/api/comments', async (request, response) => {
  const token = request.headers['jwt-token'];
  const verify = await jwt.verify(token, jwtSecret);
  const code = request.body.code;
  const comment = await Comment.create({
    code: code,
    userId: verify.userId,
    postId: request.body.postId
  });

  response.status(200).json(comment);
});


app.get('/api/comments/:id', async (request, response) => {
  // '/api/comments?postid=3'
  const postId = request.params.id
  const commentsOnPost = await Comment.findAll({
    where: {
      postId: postId
    }
  });

  response.json(commentsOnPost);
})

app.post('/api/like-comment', async (request, response) => {
  const token = request.headers['jwt-token'];
  const verify = await jwt.verify(token, jwtSecret);
  const id = request.body.commentId
  const commentLiked = await UserCommentLike.create({
    userId: verify.userId,
    commentId: id
  });

  response.status(200).json(commentLiked);
});

app.get('/api/liked-users-comment/:id', async (request, response) => {
  const commentId = request.params.id
  const whoLikedComment = await UserCommentLike.findAll({
    where: {
      commentId: commentId
    }
  });

  response.json(whoLikedComment);
})


app.get('/api/author/:id', async (request, response) => {
  const userId = request.params.id;
  const userInfo = await User.findOne({
    where: {
      id: userId
    }
  })

  response.status(200).json(userInfo)
})


app.put('/api/posts/:id', async (request, response) => {
  const postId = request.params.id;
  const postInfo = await Post.findOne({
    where: {
      id: postId
    }
  });

  const content = request.body.content
  postInfo.content = content

  await postInfo.save();

  response.status(200).json(postInfo);
});

app.delete('/api/posts/:id', async (request, response) => {
  const id = request.params.id
  const deletePost = await Post.destroy({
    where: {
      id: id
    }
  });
  response.status(200).json(deletePost);
});

app.put('/api/comments/:id', async (request, response) => {
  const commentId = request.params.id;
  const commentInfo = await Comment.findOne({
    where: {
      id: commentId
    }
  });

  const code = request.body.code
  commentInfo.code = code

  await commentInfo.save();

  response.status(200).json(commentInfo);
});

app.delete('/api/comments/:id', async (request, response) => {
  const id = request.params.id
  const deleteComment = await Comment.destroy({
    where: {
      id: id
    }
  });
  response.status(200).json(deleteComment);
});

app.get('/api/authored-posts', async (request, response) => {
  const token = request.headers['jwt-token'];
  const verify = await jwt.verify(token, jwtSecret);
  const postsThatUserAuthoredInfo = await Post.findAll({
    where: {
      userId: verify.userId
    }
  });

  response.json(postsThatUserAuthoredInfo);
})

app.get('/api/authored-comments', async (request, response) => {
  const token = request.headers['jwt-token'];
  const verify = await jwt.verify(token, jwtSecret);
  const commentsThatUserAuthoredInfo = await Comment.findAll({
    where: {
      userId: verify.userId
    }
  });

  response.json(commentsThatUserAuthoredInfo);
})


app.get('/api/liked-comments', async (request, response) => {
  const token = request.headers['jwt-token'];
  const verify = await jwt.verify(token, jwtSecret);

  const userInfo = await User.findOne({
    where: {
      id: verify.userId
    }
  });

  const commentsInfo = await userInfo.getLikedComments();

  response.json(commentsInfo);
})


app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});

if (process.env.NODE_ENV == "production") {
  app.get("/*", function (request, response) {
    response.sendFile(path.join(__dirname, "build", "index.html"));
  });
}