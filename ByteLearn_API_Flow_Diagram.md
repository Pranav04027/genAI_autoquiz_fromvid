# ByteLearn API Flow Diagram

pranavj pranaawaf
pranavi

## System Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (React)       │◄──►│   (Express)     │◄──►│   (MongoDB)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Cloudinary    │
                       │   (File Storage)│
                       └─────────────────┘
```

## Authentication Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   User      │───►│   Register  │───►│   Validate  │───►│   Create    │
│   Input     │    │   / Login   │    │   Data      │    │   User      │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                                              │
                                                              ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Return    │◄───│   Generate  │◄───│   Hash      │◄───│   Save to   │
│   Tokens    │    │   JWT       │    │   Password  │    │   Database  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

## Video Upload Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   User      │───►│   Upload    │───►│   Validate  │───►│   Upload to │
│   Video     │    │   Files     │    │   Files     │    │   Cloudinary│
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                                              │
                                                              ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Return    │◄───│   Create    │◄───│   Save      │◄───│   Get       │
│   Video     │    │   Video     │    │   to DB     │    │   URLs      │
│   Data      │    │   Record    │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

## User Interaction Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   User      │───►│   Watch     │───►│   Update    │───►│   Save       │
│   Action    │    │   Video     │    │   Progress  │    │   Progress   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Like/     │    │   Comment   │    │   Bookmark  │    │   Subscribe │
│   Unlike    │    │   System    │    │   Video     │    │   to Channel│
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

## Quiz System Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Instructor│───►│   Create    │───►│   Validate  │───►│   Save      │
│   Creates   │    │   Quiz      │    │   Questions │    │   Quiz      │
│   Quiz      │    │             │    │             │    │   to DB     │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                                              │
                                                              ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Return    │◄───│   Calculate │◄───│   Validate  │◄───│   Student   │
│   Quiz      │    │   Score     │    │   Answers   │    │   Submits   │
│   Data      │    │             │    │             │    │   Quiz      │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

## API Endpoint Categories

### 1. Authentication & User Management
```
POST /users/register     - User registration
POST /users/login        - User login
POST /users/logout       - User logout
POST /users/refresh-token - Refresh access token
PATCH /users/change-password - Change password
GET /users/current-user  - Get current user
PATCH /users/update-account-details - Update profile
PATCH /users/update-avatar - Update avatar
PATCH /users/update-coverimage - Update cover image
GET /users/c/:username   - Get user channel
GET /users/watch-history - Get watch history
```

### 2. Video Management
```
POST /videos/uploadvideo - Upload video
GET /videos/v/:videoId   - Get video by ID
GET /videos/getallvideos - Get all videos
DELETE /videos/delete-video/:videoId - Delete video
PATCH /videos/update-video/:videoId - Update video
PATCH /videos/toggleispublished/:videoId - Toggle publish status
```

### 3. Social Features
```
POST /comments/comment/:videoId - Add comment
GET /comments/getvideocomments/:videoId - Get video comments
POST /comments/updatecomment/:commentId - Update comment
POST /comments/deletecomment/:commentId - Delete comment

POST /likes/likevideo/:videoId - Toggle video like
POST /likes/likecomment/:commentId - Toggle comment like
POST /likes/likepost/:postId - Toggle post like
GET /likes/likedvideos - Get liked videos

POST /subscriptions/togglesubscription/:channelId - Toggle subscription
GET /subscriptions/subscribers/:channelId - Get subscribers
GET /subscriptions/subscribed-channels/:subscriberId - Get subscribed channels
```

### 4. Content Organization
```
POST /playlists/create-playlist - Create playlist
GET /playlists/my-playlists - Get my playlists
GET /playlists/p/:userId - Get user playlists
PATCH /playlists/p/:playlistId/v/:videoId - Add video to playlist

POST /bookmarks/addBookmark/:videoId - Add bookmark
DELETE /bookmarks/removeBookmark/:videoId - Remove bookmark
GET /bookmarks/mybookmarks - Get my bookmarks
```

### 5. Learning Features
```
POST /progress/update/:videoId - Update progress
GET /progress/get - Get progress
GET /progress/continue - Get continue watching

POST /quizzes/create/:videoId - Create quiz (instructor)
GET /quizzes/:videoId - Get quiz by video
POST /quizzes/:videoId/submit - Submit quiz

GET /recommendations/recommended - Get recommended videos
```

### 6. Dashboard Features
```
GET /instructor/dashboard/stats - Get channel stats (instructor)
GET /instructor/dashboard/videos/:userId - Get channel videos (instructor)
GET /learner/dashboard - Get learner dashboard
```

## Database Relationships Map

```
User
├── Videos (One-to-Many)
├── Comments (One-to-Many)
├── Posts (One-to-Many)
├── Playlists (One-to-Many)
├── Subscriptions (Many-to-Many)
├── Bookmarks (Many-to-Many)
├── Watch History (Many-to-Many)
├── Progress (Many-to-Many)
└── Quiz Attempts (Many-to-Many)

Video
├── Comments (One-to-Many)
├── Likes (Many-to-Many)
├── Playlists (Many-to-Many)
├── Bookmarks (Many-to-Many)
├── Quiz (One-to-One)
└── Progress (Many-to-Many)

Comment
├── Likes (Many-to-Many)
└── Owner (Many-to-One)

Post
├── Likes (Many-to-Many)
└── Owner (Many-to-One)
```

## Security Middleware Stack

```
Request
    │
    ▼
┌─────────────────┐
│ Security        │ ← CORS, Helmet, Rate Limiting
│ Middleware      │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│ Authentication  │ ← JWT Verification
│ Middleware      │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│ Role            │ ← Role-based Access Control
│ Middleware      │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│ Validation      │ ← Request Validation
│ Middleware      │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│ Route Handler   │ ← Business Logic
└─────────────────┘
    │
    ▼
┌─────────────────┐
│ Error Handler   │ ← Global Error Handling
└─────────────────┘
    │
    ▼
Response
```

## File Upload Process

```
Local File Upload
    │
    ▼
┌─────────────────┐
│ Multer          │ ← File Processing
│ Middleware      │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│ Temporary       │ ← Local Storage
│ Storage         │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│ Cloudinary      │ ← Cloud Upload
│ Upload          │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│ Delete Local    │ ← Cleanup
│ File            │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│ Save URL to     │ ← Database Storage
│ Database        │
└─────────────────┘
```

This flow diagram provides a comprehensive overview of how the ByteLearn API operates, from user interactions to data persistence and security measures.

---

## Pagination in Listings (Home/Search/Channel Uploads)

```
Frontend (React)
    │
    │ GET /videos/getallvideos?page={n}&limit={k}&query={q?}
    ▼
Backend (Express)
    │  Validate query params (page, limit, query, userId, sortBy, sortType)
    ▼
Database (MongoDB)
    │  Find + skip((page-1)*limit) + limit(limit)
    ▼
Backend Responds
    { data: { results: [...], total, page, limit } }
    │
    ▼
Frontend Renders
    - Grid for current page
    - Prev/Next controls
    - URL sync: ?q=...&page=...
```

## Playlist Bookmarking (Frontend-only)

```
Frontend (React)
    │  localStorage key: playlistBookmarks
    │  - add/remove/check/get playlist bookmarks
    ▼
UI Surfaces
    - User Playlists page: Bookmark/Unbookmark button for others' playlists
    - Bookmarks page: Separate section for playlist bookmarks

Note: There are no backend endpoints for playlist bookmarks currently; only video bookmarks use API routes.
```
