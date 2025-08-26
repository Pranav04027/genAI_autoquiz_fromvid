# ByteLearn API Documentation

## Overview
ByteLearn is a comprehensive learning platform API built with Node.js, Express, and MongoDB. The platform supports video-based learning with features like user management, video uploads, comments, likes, playlists, subscriptions, quizzes, and progress tracking.

## Base URL
```
http://localhost:8000/api/v1
```

## Database Schema

### Core Models

#### User Model
```javascript
{
  username: String (unique, required),
  email: String (unique, required),
  fullname: String (required),
  avatar: String (Cloudinary URL, required),
  coverImage: String (Cloudinary URL, optional),
  role: String (enum: ["learner", "instructor"], default: "learner"),
  progress: [{ video: ObjectId, progress: Number }],
  bookmarks: [ObjectId (Video references)],
  watchHistory: [ObjectId (Video references)],
  password: String (hashed, required),
  refreshToken: String
}
```

#### Video Model
```javascript
{
  videofile: String (Cloudinary URL, required, unique),
  thumbnail: String (Cloudinary URL, required, unique),
  title: String (required, unique),
  description: String (required),
  category: String (required),
  difficulty: String (enum: ["beginner", "intermediate", "advanced"]),
  tags: [String],
  views: Number (default: 0),
  duration: String (required),
  isPublished: Boolean (default: true),
  owner: ObjectId (User reference)
}
```

#### Comment Model
```javascript
{
  content: String (required),
  video: ObjectId (Video reference),
  owner: ObjectId (User reference)
}
```

#### Like Model
```javascript
{
  likedBy: ObjectId (User reference),
  video: ObjectId (Video reference, optional),
  comment: ObjectId (Comment reference, optional),
  post: ObjectId (Post reference, optional)
}
```

#### Playlist Model
```javascript
{
  name: String (required),
  description: String (required),
  owner: ObjectId (User reference),
  videos: [ObjectId (Video references)]
}
```

#### Subscription Model
```javascript
{
  subscriber: ObjectId (User reference),
  channel: ObjectId (User reference)
}
```

#### Post Model
```javascript
{
  content: String (required),
  owner: ObjectId (User reference)
}
```

#### Bookmark Model
```javascript
{
  user: ObjectId (User reference, required),
  video: ObjectId (Video reference, required)
}
```

#### Quiz Model
```javascript
{
  video: ObjectId (Video reference, required, unique),
  questions: [{
    questionText: String (required),
    options: [{
      text: String,
      isCorrect: Boolean
    }]
  }]
}
```

#### QuizAttempt Model
```javascript
{
  user: ObjectId (User reference, required),
  video: ObjectId (Video reference, required),
  score: Number (required),
  total: Number (required),
  submittedAnswers: [{
    question: String,
    selectedOption: String,
    isCorrect: Boolean
  }]
}
```

## Authentication

### JWT Token Structure
- **Access Token**: Short-lived token for API access
- **Refresh Token**: Long-lived token for generating new access tokens
- **Token Storage**: Cookies or Authorization header

### Authentication Flow
1. User registers/logs in
2. Server generates access and refresh tokens
3. Access token used for API requests
4. Refresh token used to get new access token when expired

## API Endpoints

### 1. Health Check
```
GET /healthcheck
```
**Response**: Health status of the API

### 2. User Management

#### Register User
```
POST /users/register
```
**Body**: 
- `fullname` (required)
- `email` (required)
- `username` (required)
- `password` (required)
- `role` (optional: "learner" or "instructor")
- `avatar` (file upload, required)
- `coverImage` (file upload, optional)

#### Login User
```
POST /users/login
```
**Body**:
- `username` or `email`
- `password`

#### Refresh Access Token
```
POST /users/refresh-token
```
**Headers**: Requires refresh token

#### Logout User
```
POST /users/logout
```
**Headers**: Requires access token

#### Change Password
```
PATCH /users/change-password
```
**Headers**: Requires access token
**Body**:
- `oldPassword`
- `newPassword`

#### Get Current User
```
GET /users/current-user
```
**Headers**: Requires access token

#### Update Account Details
```
PATCH /users/update-account-details
```
**Headers**: Requires access token
**Body**:
- `username` (optional)
- `email` (optional)

#### Update Avatar
```
PATCH /users/update-avatar
```
**Headers**: Requires access token
**Body**: `avatar` (file upload)

#### Update Cover Image
```
PATCH /users/update-coverimage
```
**Headers**: Requires access token
**Body**: `coverImage` (file upload)

#### Get User Channel Profile
```
GET /users/c/:username
```
**Headers**: Requires access token

#### Get Watch History
```
GET /users/watch-history
```
**Headers**: Requires access token

### 3. Video Management

#### Upload Video
```
POST /videos/uploadvideo
```
**Headers**: Requires access token
**Body**:
- `title` (required)
- `description` (required)
- `difficulty` (required: "beginner", "intermediate", "advanced")
- `category` (required)
- `video` (file upload, required)
- `thumbnail` (file upload, required)

#### Get Video by ID
```
GET /videos/v/:videoId
```
**Public endpoint**

#### Get All Videos
```
GET /videos/getallvideos
```
**Public endpoint**

**Query Parameters (optional):**
- `page` (number, default: 1)
- `limit` (number, default: 12–100 depending on client)
- `query` (string, optional search term for title/metadata)
- `userId` (string, filter by uploader)
- `sortBy` (string, e.g., `createdAt`)
- `sortType` (string, `asc` | `desc`)

**Notes:**
- This endpoint is used for paginated listings on the frontend (home, search, channel uploads).
- When `query` is provided, results act as a search.

**Sample Response (paginated):**
```javascript
{
  "statusCode": 200,
  "data": {
    "results": [
      {
        "_id": "...",
        "title": "...",
        "thumbnail": "...",
        "description": "...",
        "owner": "...",
        "createdAt": "..."
      }
      // ... up to `limit` items
    ],
    "total": 128,
    "page": 1,
    "limit": 12
  },
  "message": "Videos fetched",
  "success": true
}
```

#### Delete Video
```
DELETE /videos/delete-video/:videoId
```
**Headers**: Requires access token

#### Update Video
```
PATCH /videos/update-video/:videoId
```
**Headers**: Requires access token
**Body**: `thumbnail` (file upload, optional)

#### Toggle Publish Status
```
PATCH /videos/toggleispublished/:videoId
```
**Headers**: Requires access token

### 4. Comment Management

#### Get Video Comments
```
GET /comments/getvideocomments/:videoId
```
**Query Parameters**:
- `page` (optional, default: 1)
- `limit` (optional, default: 10)

#### Add Comment
```
POST /comments/comment/:videoId
```
**Headers**: Requires access token
**Body**:
- `content` (required)

#### Update Comment
```
POST /comments/updatecomment/:commentId
```
**Headers**: Requires access token
**Body**:
- `content` (required)

#### Delete Comment
```
POST /comments/deletecomment/:commentId
```
**Headers**: Requires access token

### 5. Like Management

#### Toggle Video Like
```
POST /likes/likevideo/:videoId
```
**Headers**: Requires access token

#### Toggle Comment Like
```
POST /likes/likecomment/:commentId
```
**Headers**: Requires access token

#### Toggle Post Like
```
POST /likes/likepost/:postId
```
**Headers**: Requires access token

#### Get Liked Videos
```
GET /likes/likedvideos
```
**Headers**: Requires access token

### 6. Playlist Management

#### Create Playlist
```
POST /playlists/create-playlist
```
**Headers**: Requires access token
**Body**:
- `name` (required)
- `description` (required)
- `videos` --> array of videoIds

eg:
{
    "name": "Cutu billu videos",
    "description": "Cutuest cats you can find on internet",
    "videos":[
        "68964c4fd2f23d09efce7bde",
        "68964a3a161ee953e5bdba24"
    ]
}

#### Get My Playlists
```
GET /playlists/my-playlists
```
**Headers**: Requires access token

#### Get User Playlists
```
GET /playlists/p/:userId
```
**Public endpoint**

#### Add Video to Playlist
```
PATCH /playlists/p/:playlistId/v/:videoId
```
**Headers**: Requires access token

### 7. Subscription Management

#### Toggle Subscription
```
POST /subscriptions/togglesubscription/:channelId
```
**Headers**: Requires access token

#### Get Channel Subscribers
```
GET /subscriptions/subscribers/:channelId
```
**Public endpoint**

#### Get Subscribed Channels
```
GET /subscriptions/subscribed-channels/:subscriberId
```
**Public endpoint**

### 8. Post Management

#### Create Post
```
POST /posts/createpost
```
**Headers**: Requires access token
**Body**:
- `content` (required)

#### Get User Posts
```
GET /posts/userposts/:userId
```
**Public endpoint**

#### Update Post
```
PATCH /posts/updatepost/:postId
```
**Headers**: Requires access token
**Body**:
- `content` (required)

#### Delete Post
```
DELETE /posts/deletepost/:postId
```
**Headers**: Requires access token

### 9. Bookmark Management

#### Add Bookmark
```
POST /bookmarks/addBookmark/:videoId
```
**Headers**: Requires access token

#### Remove Bookmark
```
DELETE /bookmarks/removeBookmark/:videoId
```
**Headers**: Requires access token

#### Get My Bookmarks
```
GET /bookmarks/mybookmarks
```
**Headers**: Requires access token

> Note: Only video bookmarks are supported via backend APIs. Playlist bookmarks in the application UI are currently implemented on the frontend using browser localStorage and do not have server endpoints.

### 10. Progress Tracking

#### Update Progress
```
POST /progress/update/:videoId
```
**Headers**: Requires access token
**Body**:
- `progress` (required, number)

#### Get Progress
```
GET /progress/get
```
**Headers**: Requires access token

#### Get Continue Watching
```
GET /progress/continue
```
**Headers**: Requires access token

### 11. Quiz Management

#### Create Quiz
```
POST /quizzes/create/:videoId
```
**Headers**: Requires access token (instructor only)
**Body**: Quiz schema with questions and options
eg:
{
  "questions": [
    {
      "questionText": "How many steps were in the dance tutorial",
      "options": [
        { "text": "3", "isCorrect": false },
        { "text": "4", "isCorrect": true },
        { "text": "5", "isCorrect": false },
        { "text": "6", "isCorrect": false }
      ]
    },
    {
      "questionText": "How many steps were in the dance tutorial 2",
      "options": [
        { "text": "3s", "isCorrect": false },
        { "text": "4ss", "isCorrect": true },
        { "text": "5s", "isCorrect": false },
        { "text": "6s", "isCorrect": false }
      ]
    }
  ]
}


#### Get Quiz by Video Id
```
GET /quizzes/:videoId
```
**Headers**: Requires access token

#### Submit Quiz
```
POST /quizzes/:videoId/submit
```
**Headers**: Requires access token
**Body**: Submitted answers
eg:
{
    "answers": [
        {
            "question": "686ea259bcd4d00a475ae5f7",
            "selectedOption": "686ea259bcd4d00a475ae5f9"
        }
    ]
}

### 12. Recommendations

#### Get Recommended Videos
```
GET /recommendations/recommended
```
**Headers**: Requires access token

### 13. Instructor Dashboard

#### Get Channel Stats
```
GET /instructor/dashboard/stats
```
**Headers**: Requires access token (instructor role)

#### Get Channel Videos
```
GET /instructor/dashboard/videos/:userId
```
**Headers**: Requires access token (instructor role)

### 14. Learner Dashboard

#### Get Learner Dashboard
```
GET /learner/dashboard
```
**Headers**: Requires access token

## Response Format

### Success Response
```javascript
{
  "statusCode": 200,
  "data": {...},
  "message": "Success message",
  "success": true
}
```

### Error Response
```javascript
{
  "statusCode": 400,
  "data": null,
  "message": "Error message",
  "success": false,
  "errors": [...]
}
```

## File Upload

### Supported File Types
- **Images**: Avatar, cover images, thumbnails
- **Videos**: Video content files
- **Storage**: Cloudinary cloud storage

### Upload Process
1. File uploaded to temporary local storage
2. File uploaded to Cloudinary
3. Local file deleted
4. Cloudinary URL stored in database

## Security Features

### Middleware Stack
1. **Security Middleware**: CORS, helmet, rate limiting
2. **Authentication Middleware**: JWT verification
3. **Role Middleware**: Role-based access control
4. **Validation Middleware**: Request validation
5. **Error Middleware**: Global error handling

### Authentication Flow
1. User provides credentials
2. Server validates and generates tokens
3. Access token used for protected routes
4. Refresh token used to renew access tokens

## Database Relationships

### One-to-Many Relationships
- User → Videos (owner)
- User → Comments (owner)
- User → Posts (owner)
- User → Playlists (owner)
- Video → Comments
- Video → Likes

### Many-to-Many Relationships
- Users ↔ Users (subscriptions)
- Users ↔ Videos (bookmarks, watch history)
- Users ↔ Videos (likes)
- Users ↔ Comments (likes)
- Users ↔ Posts (likes)
- Playlists ↔ Videos

## Environment Variables Required

```env
MONGODB_URI=mongodb://localhost:27017
DB_NAME=byteLearn
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=10d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## API Flow Summary

### User Journey
1. **Registration/Login**: User creates account or logs in
2. **Video Consumption**: Users watch videos, track progress
3. **Interaction**: Users like, comment, bookmark videos
4. **Organization**: Users create playlists, subscribe to channels
5. **Learning**: Users take quizzes, track progress
6. **Content Creation**: Instructors upload videos, create quizzes

### Data Flow
1. **Authentication**: JWT-based authentication
2. **File Upload**: Cloudinary integration for media storage
3. **Data Persistence**: MongoDB with Mongoose ODM
4. **Real-time Features**: Comments, likes, subscriptions
5. **Progress Tracking**: Video progress and quiz attempts
6. **Recommendations**: Personalized video recommendations

This API provides a complete learning management system with social features, progress tracking, and content creation capabilities.
