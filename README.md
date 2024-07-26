Here’s a README template for your GitHub project based on the details provided:

---

# Mapping Application with Real-Time User Tracking

## Overview

This project is a web application that combines geolocation tracking with real-time updates on a map. Users can see their own location and the locations of other users, represented by custom markers with avatar images. The application is built with Node.js, Express, Socket.io, MongoDB, and Leaflet.js.

## Features

- **Real-Time User Tracking**: Users can see live updates of their location and other users' locations on a map.
- **Custom Markers**: Each user’s location is represented by a custom marker with their avatar.
- **Geolocation**: Users' locations are tracked using the browser's geolocation API.
- **Routing Control**: The application features routing control to calculate and display distances and travel times.
- **JWT Authentication**: Secure access using JSON Web Tokens (JWT) for user authentication.

## Technologies Used

- **Node.js**: JavaScript runtime for server-side logic.
- **Express**: Web framework for Node.js.
- **Socket.io**: Real-time communication between client and server.
- **MongoDB**: NoSQL database for storing user data.
- **Mongoose**: MongoDB object modeling tool for Node.js.
- **Leaflet.js**: Open-source JavaScript library for interactive maps.
- **EJS**: Templating engine for rendering views.

## Getting Started

### Prerequisites

- Node.js and npm installed
- MongoDB instance running
- A `.env` file with the following variables:
  ```plaintext
  JWT_SSH=your_jwt_secret_key
  ```

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/your-repository.git
   cd your-repository
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   Create a `.env` file in the root directory and add your JWT secret key:

   ```plaintext
   JWT_SSH=your_jwt_secret_key
   ```

4. **Start the Server**

   ```bash
   npm start
   ```

5. **Access the Application**

   Open your browser and navigate to `http://localhost:3000` to view the application.

## Usage

1. **Authentication**: Users need to log in to access the application. JWTs are used to authenticate requests.
2. **Geolocation Tracking**: Upon logging in, users’ locations are tracked and displayed on the map.
3. **Custom Markers**: User avatars are displayed on the map as custom markers. The avatars are encoded in base64 format and are used to represent each user.
4. **Routing Control**: Users can see routing information including distance and time between waypoints.

## Code Overview

### Server-Side Code

- **`server.js`**: Main server file setting up Express, Socket.io, and routes.
- **`models/student.js`**: Mongoose model for user data.
- **`middleware/isLoggedIn.js`**: Middleware to check if the user is authenticated.

### Client-Side Code

- **`public/js/map.js`**: JavaScript file handling the map initialization, marker updates, and real-time user location updates.

## Contributing

Feel free to open issues or submit pull requests. Ensure that your code follows the project's style guidelines and includes relevant tests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Replace placeholders like `yourusername` and `your-repository` with your actual GitHub username and repository name. You might need to adjust the content to fit any additional specifics or changes in your project.
