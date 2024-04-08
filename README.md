# CommunityHub API - THE INTERNET FOLKS SDE INTERN TASK {002}

## Overview

Welcome to CommunityHub API platform that empowers users to create and manage their own communities with ease. With CommunityHub, users can foster collaboration, communication, and engagement within their communities by adding members and sharing resources.

## Features

- **Community Creation**: Users can create their own communities with a few simple steps.
  
- **Role Management**: Each user who creates a community is automatically assigned the Community Admin role, allowing them to manage the community and its members. Other users can be added to the community as Community Members.

- **Secure Authentication**: Utilizes JSON Web Tokens (JWT) for secure authentication and authorization.

## Environment Variables

To run this project, you'll need to set up the following environment variables in a `.env` file:

- `PORT`: Give Tour Local Host.
- `MONGOURL`: MongoDB connection URL.
- `JWT_SECRET`: Secret key for JWT encryption.
- `JWT_EXPIRATION`: JWT Token Expiry 10d or 1h .

## Deployment

To run this project locally, follow these steps:

```Clone the repo ```


1. **Install Dependencies**: Make sure you have Node.js and MongoDB installed on your machine. Then, navigate to the project directory and run:

    ```bash
    npm install
    ```

2. **Set Environment Variables**: Create a `.env` file in the root directory of the project and add the required environment variables.

3. **Start the Server**: Run the following command to start the server:

    ```bash
    node server.js
    ```

4. **Access the Platform**: Once the server is running, you can access the platform at `http://localhost:your_port_number`.




