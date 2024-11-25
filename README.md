# Top 5 Dating App 💝

Find your top 5 matches based on what matters most to you! This modern dating app helps you make meaningful connections by focusing on specific qualities that attract you to someone and is designed to encourage frequent communication with matches. Project details are confidential and is only public for recruiting purposes. Read disclaimer below.


### Screen recording of the project

<video width="320" height="240" controls>
  <source src="https://s3.us-east-2.amazonaws.com/rashaunwarner.com/top5-screen-recording.mp4" type="video/mp4">
</video>


## 🛠 Tech Stack
- React Native
- Expo
- TypeScript
- React Navigation
- Tanstack React Query
- React Native Paper - Material Design for React Native
- AWS S3


## 🚀 Key Features

### Authentication
- [x] Login with email/password
- [x] Secure token management for JWT
- [x] Auto-logout on token expiration

### Profile Screen
- [x] Photo upload to AWS S3
- [x] Profile picture display on draggable grid to rearrange order
- [x] View and Edit Profile data

### Swipe Cards Screen
- [x] Swipe cards for potential matches
- [x] Select what contributed most to your yes/no decision before swipe (reason is confidential)

### Matches Screen
- [x] View all matches and top 5 matches
- [ ] Chat with matches


### UI/UX
- [x] Custom theme implementation
- [x] Responsive layouts
- [x] Loading states & error handling



## ⚖️ Legal Notice & Copyright

© 2024 Top 5 Dating App. All Rights Reserved.

**PROPRIETARY AND CONFIDENTIAL**

This repository contains proprietary and confidential information. The source code and all associated documentation are protected works. While this code is publicly visible for portfolio purposes, the following restrictions apply:

- No license is granted for commercial or personal use
- No permission for modification, distribution, or derivative works
- No right to patent, trademark, or otherwise claim intellectual property rights
- Code sharing, copying, or reproduction is strictly prohibited
- The Top 5 matching algorithm and business logic are trade secrets

The application concept, implementation details, and all associated intellectual property are protected by copyright law. Any unauthorized use, reproduction, or distribution will result in legal action.

*Note: This code is made public solely for portfolio review purposes.*

---
\*graph below may need adjustments

```mermaid
graph TD
    subgraph "Frontend - React Native App"
        MobileApp[Mobile App]
        AuthContext[Auth Context]
        ApiClient[API Client]
        SecureStore[Secure Store]
        
        subgraph "Core Screens"
            Login[Login Screen]
            ProfileScreen[Profile Screen]
            Swipe[Swipe Cards Screen]
            Matches[Matches Screen]
        end
        
        subgraph "State Management"
            ReactQuery[React Query]
            JWT[JWT Tokens]
        end
    end
    
    subgraph "Backend - Django REST API"
        DjangoAPI[Django API]
        JWT_Auth[JWT Authentication]
        
        subgraph "Core Services"
            UserService[User Service]
            ProfileService[Profile Service]
            MatchService[Match Service]
            AuthService[Auth Service]
        end
        
        subgraph "Data Models"
            User[User Model]
            Profile[Profile Model]
            Match[Match Model]
            Interest[Interest Model]
        end
    end
    
    subgraph "External Services"
        S3[AWS S3]
        PostgreSQL[PostgreSQL Database]
    end
    
    %% Frontend Connections
    MobileApp --> AuthContext
    MobileApp --> ApiClient
    AuthContext --> SecureStore
    ApiClient --> JWT
    
    %% Frontend to Backend
    ApiClient --> DjangoAPI
    
    %% Backend Connections
    DjangoAPI --> JWT_Auth
    DjangoAPI --> UserService
    DjangoAPI --> ProfileService
    DjangoAPI --> MatchService
    DjangoAPI --> AuthService
    
    %% Data Connections
    UserService --> User
    ProfileService --> Profile
    MatchService --> Match
    User --> PostgreSQL
    Profile --> PostgreSQL
    Match --> PostgreSQL
    Interest --> PostgreSQL
    
    %% External Service Connections
    ProfileService --> S3

    style MobileApp fill:#f9f,stroke:#333,stroke-width:2px
    style DjangoAPI fill:#bbf,stroke:#333,stroke-width:2px
    style PostgreSQL fill:#dfd,stroke:#333,stroke-width:2px
    style S3 fill:#fdd,stroke:#333,stroke-width:2px
