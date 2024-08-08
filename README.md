# E-commerce Website

This is a full-stack e-commerce web application built using React.js for the frontend and Node.js with Express and MongoDB for the backend.

## Features

- User authentication (sign up, login)
- Add products to cart
- Remove products from cart
- Confirm order
- Admin page for product management
- Dynamic product listings
- Responsive design

## Tech Stack

### Frontend

- React.js
- Context API for state management
- Axios for HTTP requests
- CSS for styling

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose for MongoDB object modeling
- JWT for authentication
- Multer for file uploads


### Backend Setup

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/your-repo-name.git
    cd your-repo-name
    ```

2. Install backend dependencies:
    ```sh
    cd backend
    npm install
    ```

3. Set up your environment variables. Create a `.env` file in the `backend` directory and add the following:
    ```env
    MONGODB_URI=your-mongodb-connection-string
    JWT_SECRET=your-jwt-secret
    ```

4. Start the backend server:
    ```sh
    npm start
    ```

### Frontend Setup

1. Install frontend dependencies:
    ```sh
    cd ../frontend
    npm install
 

2. Start the frontend development server:
  
    npm start
  

### Admin Setup

1. To create an admin user, you need to manually update the `isAdmin` field in the user document in MongoDB.
2. After registering a new user through the frontend, open your MongoDB database.
3. Find the user document you want to promote to admin.
4. Update the `isAdmin` field to `true`.

### NOTE:

// Note: For security reasons, the MongoDB connection string is not included directly in this file.
// You need to provide your own MongoDB connection string.

// 1. Replace the empty string in the `mongoose.connect` method with your MongoDB connection URI.
//    Example:
//    mongoose.connect("mongodb+srv://<username>:<password>@<cluster-url>/<database>", {
//        useNewUrlParser: true,
//        useUnifiedTopology: true
//    })
//    .then(() => console.log("Connected to MongoDB"))
//    .catch(error => console.log("Error connecting to MongoDB: ", error));

// 2. Ensure that you have set up a MongoDB database and obtained your connection URI.
//    - Replace `<username>`, `<password>`, `<cluster-url>`, and `<database>` with your MongoDB credentials and database details.




