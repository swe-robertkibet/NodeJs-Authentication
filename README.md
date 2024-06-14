# Overview

The Authentication System provides secure user authentication functionalities for web applications. It allows users to sign up with unique usernames and email addresses, securely stores hashed passwords using bcrypt, and facilitates user login with validation checks. This system is designed to prevent unauthorized access and ensure user data security.

# Prerequisites

Before using the Authentication System, ensure you have the following prerequisites installed and set up:

1. Node.js: JavaScript runtime environment.<a href =""> Download Node.js </a>
2. MongoDB: NoSQL database for storing user information.<a href =""> Download MongoDB </a>

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

## Usage

### Signup Endpoint

- **Endpoint:** `/user/signup`
- **Description:** Handles user registration and validation.
- **Request Method:** `POST`
- **Request Body:**

  ```json
  {
    "firstName": "John",
    "secondName": "Doe",
    "dateOfBirth": "1990-01-01",
    "username": "johndoe",
    "email": "johndoe@example.com",
    "password": "Password@123"
  }
  ```

- **Validation Criteria:**

  - Ensure all fields are filled out (`firstName`, `secondName`, `dateOfBirth`, `username`, `email`, `password`).
  - Validate format for `firstName` and `secondName` (only letters).
  - Validate email format.
  - Validate date of birth format.
  - Validate password strength (minimum 8 characters, at least one uppercase letter, one lowercase letter, and one special character).

- **Responses:**

  - **Success:**

    ```json
    {
      "status": "SUCCESS",
      "message": "Signup Successful",
      "data": {
        "_id": "5f8c071c9863ab0017d6b12c",
        "firstName": "John",
        "secondName": "Doe",
        "dateOfBirth": "1990-01-01T00:00:00.000Z",
        "username": "johndoe",
        "email": "johndoe@example.com",
        "password": "$2b$10$9qDdzUcv6ZCB1r9hFj7o4.DXfx6ZW/SYhWj4Tc0Lq2pCLCQ3Hl4Eu",
        "__v": 0
      }
    }
    ```

  - **Failures:**
    - Returns status: "FAILED" and specific error message if any validation fails or user already exists.

### Login Endpoint

- **Endpoint:** `/user/login`
- **Description:** Handles user authentication and login.
- **Request Method:** `POST`
- **Request Body:**

  ```json
  {
    "email": "johndoe@example.com",
    "password": "Password@123"
  }
  ```

- **Validation Criteria:**

  - Validate email format.
  - Validate password length (minimum 8 characters).

- **Responses:**

  - **Success:**

    ```json
    {
      "status": "SUCCESS",
      "message": "Sign In Successful",
      "data": {
        "_id": "5f8c071c9863ab0017d6b12c",
        "firstName": "John",
        "secondName": "Doe",
        "dateOfBirth": "1990-01-01T00:00:00.000Z",
        "username": "johndoe",
        "email": "johndoe@example.com",
        "password": "$2b$10$9qDdzUcv6ZCB1r9hFj7o4.DXfx6ZW/SYhWj4Tc0Lq2pCLCQ3Hl4Eu",
        "__v": 0
      }
    }
    ```

  - **Failure:**
    - Returns status: "FAILED" and specific error message if email is not found or password is incorrect.

### Rate Limiting

- Applies rate limiting to prevent brute-force attacks.
- Limits requests to 5 per IP address per 15 minutes.

### Example Usage with Postman

1. **Signup Endpoint:**

   - **Method:** POST
   - **URL:** `http://localhost:3000/user/signup`
   - **Headers:** None
   - **Body:** JSON (as shown above)

2. **Login Endpoint:**

   - **Method:** POST
   - **URL:** `http://localhost:3000/user/login`
   - **Headers:** None
   - **Body:** JSON (as shown above)

Adjust paths, URLs, and details according to your specific implementation and requirements.

## Error Handling

### Error Types and Handling

The Authentication System employs robust error handling to manage various scenarios:

- **Validation Errors:**

  - Validation errors for signup and login requests are checked before processing.
  - If any required fields are missing or format validations fail (e.g., invalid email format, weak password), appropriate error responses are returned.

- **Database Errors:**

  - Errors during database operations (e.g., user lookup, saving new users) are caught and handled.
  - Detailed error messages are logged for debugging purposes while returning user-friendly error responses to clients.

- **Server Errors:**
  - Internal server errors (e.g., unexpected exceptions, network issues) are caught.
  - A generic "Internal Server Error" response is sent to clients with an appropriate HTTP status code (e.g., 500).

### Example Error Responses

- **Validation Error:**

  ```json
  {
    "status": "FAILED",
    "message": "Invalid email format"
  }
  ```

- **Database Error:**

  ```json
  {
    "status": "FAILED",
    "message": "An error occurred while saving user account",
    "data": "<detailed error message>"
  }
  ```

- **Server Error:**
  ```json
  {
    "status": "FAILED",
    "message": "Internal Server Error"
  }
  ```

## Security Considerations

### Password Handling

- **Password Hashing:**
  - User passwords are securely hashed using bcrypt before storing in the database.
  - This ensures passwords are not stored in plain text and are protected against unauthorized access.

### Rate Limiting

- **Brute-force Protection:**
  - Rate limiting is implemented to mitigate brute-force attacks.
  - Each IP address is limited to 5 requests per 15 minutes for login attempts, preventing rapid successive attempts.

### Input Validation

- **Data Sanitization:**
  - Input fields are sanitized to prevent injection attacks (e.g., XSS, SQL injection).
  - Regular expressions and validation functions are used to ensure data integrity before processing.

### HTTPS Usage

- **Secure Communication:**
  - The Authentication System is recommended to be deployed behind HTTPS to encrypt data transmitted between clients and the server.
  - This prevents data interception and ensures secure communication.

### Additional Security Measures

- **JWT Token Expiry:**

  - JSON Web Tokens (JWT) issued for session management have a short expiry to limit their lifespan.
  - This reduces the risk of token misuse if intercepted.

- **Environment Variable Protection:**
  - Critical information such as database credentials and JWT secret keys are stored in environment variables.
  - These are not exposed in source code repositories, enhancing security.
