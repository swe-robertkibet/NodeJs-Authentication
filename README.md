# Overview

The Authentication System provides secure user authentication functionalities for web applications. It allows users to sign up with unique usernames and email addresses, securely stores hashed passwords using bcrypt, and facilitates user login with validation checks. This system is designed to prevent unauthorized access and ensure user data security.

# Prerequisites

Before using the Authentication System, ensure you have the following prerequisites installed and set up:

1. Node.js: JavaScript runtime environment. Download Node.js
2. MongoDB: NoSQL database for storing user information. Download MongoDB

NB: Ensure MongoDB is running locally or accessible via a remote server.

## Installation

To install the Authentication System, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone <repository_url>
   cd <project_directory>
   ```

2. **Install dependencies:**

   Install necessary dependencies using npm or yarn.

   ```bash
   npm install
   # or
   yarn install
   ```

## Configuration

To configure the Authentication System for your environment, follow these steps:

### Setting Environment Variables

1. **Create a `.env` file:**

   Create a `.env` file in the root directory of your project.

2. **Define environment variables:**

   Populate the `.env` file with the following variables:

   ```dotenv
   # Server Port
   PORT=3000

   # MongoDB Connection URI
   MONGODB_URI=mongodb://localhost:27017/auth_system

   # JWT Secret Key (for session management)
   JWT_SECRET=your_secret_key_here
   ```

   - `PORT`: Specify the port on which the server will run.
   - `MONGODB_URI`: Set the MongoDB connection URI. Update `localhost:27017/auth_system` with your MongoDB server details and database name.

### Database Configuration

1. **MongoDB Setup:**

   Ensure MongoDB is installed and running. If using a cloud-hosted MongoDB service, update `MONGODB_URI` in the `.env` file accordingly.

### Adjusting Default Settings

1. **Rate Limit Configuration:**

   The rate limiting configuration is already set in the code:

   ```javascript
   const loginRateLimit = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 MINUTES
     max: 5, // LIMIT EACH IP TO 5 REQUESTS PER windowMs
     message: {
       status: "FAILED",
       message: "Too many requests, please try again later.",
     },
   });
   ```

   Adjust `windowMs` and `max` values as per your application's requirements.
