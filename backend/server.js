const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://subhamsriramka01u:subhamsriramka01u@cluster0.d8cfgxt.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Create a laundry request schema
const laundryRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  laundryType: { type: String, required: true },
  laundryNumber: { type: Number, required: true },
  status: { type: String, default: "Pending" },
});

// Create a User schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String },
  phone: { type: Number },
  // status: { type: String, default: "Pending" },
});

// Create a laundry request model
const LaundryRequest = mongoose.model("LaundryRequest", laundryRequestSchema);

// Create a User model
const User = mongoose.model("User", UserSchema);

// Initialize the Express application
const app = express();
app.use(
  cors({
    origin: "http://127.0.0.1:5500",
  })
);

// Middleware
app.use(bodyParser.json());

// User Signup - Register
app.post("/signup", (req, res) => {
  console.log("i am called");
  // Retrieve user details from the request body
  const { username, email, password } = req.body;

  // Create a new user document
  const newUser = new User({ username, email, password });

  // Save the new user to the database
  newUser
    .save()
    .then(() => {
      res.json({ message: "Signup successful" });
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).json({ message: "An error occurred during signup" });
    });
});

// User login - Register
app.post("/login", (req, res) => {
  console.log("i am called");
  // Retrieve user details from the request body
  const { email, password } = req.body;

  // Find the user in the database based on the email
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      console.log("i'm called" + user.password);
      // Validate the current password
      if (!user.password === password) {
        return res.status(401).json({ message: "Invalid current password" });
      }
      else {
        return res.status(200).json({message: "Success"})
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).json({ message: "An error occurred" });
    });
});

// Dashboard - View the status of Laundry Request and Price
app.get("/dashboard", (req, res) => {
  // Retrieve dashboard data from the database
  DashboardData.findOne({}, (err, data) => {
    if (err) {
      console.error("Error:", err);
      return res.status(500).json({ message: "An error occurred" });
    }
    if (!data) {
      // If no data exists, return default values
      return res.json({ laundryRequestStatus: "No data", price: 0 });
    }

    // Return response with the retrieved data
    res.json({ laundryRequestStatus: data.status, price: data.price });
  });
});

// Laundry Request - Submit laundry request
app.post("/laundry-request", (req, res) => {
  // Create a new laundry request
  const { name, address, laundryType,laundryNumber } = req.body;
  const newLaundryRequest = new LaundryRequest({ name, address, laundryType, laundryNumber });

  // Save the laundry request to the database
  newLaundryRequest
    .save()
    .then(() => {
      res.json({ message: "Laundry request submitted successfully" });
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).json({ message: "An error occurred" });
    });
});

// User Profile - Update user profile
app.put("/profile", (req, res) => {
  const { name, email, phone } = req.body;

  // Find the user in the database and update the profile
  User.findOneAndUpdate(
    { email: email }, // Assuming 'username' is the unique identifier for a user
    { name: name, phone: phone },
    { new: true }
  )
    .then((updatedUser) => {
      if (updatedUser) {
        res.json({
          message: "Profile updated successfully",
          user: updatedUser,
        });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).json({ message: "An error occurred" });
    });
});

// Password Management - Change password
app.put("/password/change", (req, res) => {
  const { currentPassword, newPassword, email } = req.body;

  // Find the user in the database based on the email
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      console.log("i'm called" + user.password);
      // Validate the current password
      if (!user.password === currentPassword) {
        return res.status(401).json({ message: "Invalid current password" });
      }

      // Update the password
      user.password = newPassword;

      // Save the updated user in the database
      user
        .save()
        .then(() => {
          res.json({ message: "Password changed successfully" });
        })
        .catch((error) => {
          console.error("Error:", error);
          res.status(500).json({ message: "An error occurred" });
        });
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).json({ message: "An error occurred" });
    });
});

// Password Management - Recover password
app.post("/password/recover", (req, res) => {
  const { email } = req.body;

  // Perform validation
  if (!email) {
    return res.status(400).json({ message: "Please provide the email." });
  }

  // Find the user in the database based on the provided email
  User.findOne({ email })
    .then((user) => {
      // Check if the user exists
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      // Retrieve the recovered password
      const recoveredPassword = user.password; // Assuming password is stored in the "password" field

      // Return the recovered password as the response
      res.json({
        message: "Password recovered successfully.",
        password: recoveredPassword,
      });
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).json({ message: "An error occurred." });
    });
});

// Notifications - Retrieve notifications
// app.get("/notifications", (req, res) => {
//   // Retrieve notifications from the database
//   // ...

//   // Return response
//   res.json([
//     { message: "Laundry request submitted successfully" },
//     // { message: "Failed", timestamp: Date.now() },
//   ]);
// });

// Start the server
app.listen(3000, () => console.log("Server is running on port 3000"));
