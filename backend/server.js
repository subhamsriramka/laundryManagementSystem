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
  email: { type: String, required: true },
  address: { type: String, required: true },
  laundryType: { type: String, required: true },
  laundryNumber: { type: Number, required: true },
  status: { type: String, default: "Pending" },
});

// Create a User schema
const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Number, required: true, default: 0 },
  phone: { type: Number },
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
  // Retrieve user details from the request body
  const { firstName, lastName, email, password } = req.body;

  // Create a new user document
  const newUser = new User({ firstName, lastName, email, password });

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
  // Retrieve user details from the request body
  const { email, password } = req.body;

  // Find the user in the database based on the email
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Validate the current password
      if (!user.password === password) {
        return res.status(401).json({ message: "Invalid current password" });
      } else {
        return res
          .status(200)
          .json({ message: "Success", isAdmin: user.isAdmin });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).json({ message: "An error occurred" });
    });
});

// Laundry Request - Submit laundry request
app.post("/laundry-request", (req, res) => {
  // Extract data from the request body
  const { email, address, laundryType, laundryNumber } = req.body;

  // Find a user with the provided email in the database
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        // Create a new laundry request object
        const newLaundryRequest = new LaundryRequest({
          email,
          address,
          laundryType,
          laundryNumber,
        });

        // User found, save the laundry request to the database
        newLaundryRequest
          .save()
          .then(() => {
            res.json({ message: "Laundry request submitted successfully" });
          })
          .catch((error) => {
            console.error("Error:", error);
            res.status(500).json({ message: "An error occurred" });
          });
      } else {
        // User not found
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).json({ message: "An error occurred" });
    });
});

// User Profile - Update user profile
app.put("/profile", (req, res) => {
  const { firstName, lastName, email, phone } = req.body;

  // Find the user in the database and update the profile
  User.findOneAndUpdate(
    { email: email }, // Assuming 'username' is the unique identifier for a user
    { firstName: firstName, lastName: lastName, phone: phone },
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

      // Validate the current password
      if (!(user.password === currentPassword)) {
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
      const recoveredPassword = user.password;

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

//Get all laundry data
app.get("/data", async (req, res) => {
  try {
    const requests = await LaundryRequest.find().sort({ _id: -1 });
    res.json(requests);
  } catch (error) {
    // Handle any errors that occur during the operation
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Request status - Update status
app.put("/status", (req, res) => {
  const { _id } = req.body;

  // Find the laundry request in the database and update the status
  LaundryRequest.findOneAndUpdate(
    { _id: _id },
    { status: "Approved" },
    { new: true }
  )
    .then((updatedUser) => {
      if (updatedUser) {
        res.json({
          message: "status updated successfully",
        });
      } else {
        res.status(404).json({ message: "Request not found" });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).json({ message: "An error occurred" });
    });
});

// Start the server
app.listen(3000, () => console.log("Server is running on port 3000"));
