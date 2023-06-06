//Check Authentication
// let isLoggedIn = false;
// function initialize() {
//     // Check if the user is logged in
//    //  isLoggedIn = false;/* Your logic to check if the user is logged in */;
//    const email = document.getElementById("email2").value;
//    const password = document.getElementById("password2").value;
//    email = ""
//    password = ""
//    // isLoggedIn = false;
//     // If the user is not logged in, redirect them to the login page
//    //  if (!isLoggedIn) {

//    //    console.log("reload") // Replace "login.html" with the URL of your login page
//    //  }
//   }

// function checkAuthentication() {
//   const email = document.getElementById("email2").value;
//   const password = document.getElementById("password2").value;
//   email = "";
//   password = "";
//   isLoggedIn = false;
//   if (!isLoggedIn) {
//     window.location.href = "index.html";
//   }
// }

// function checkAuthentication2() {
//   if (isLoggedIn) {
//     window.location.href = "index.html";
//   }
// }

// User Signup - Register
function signup() {
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Perform validation
  if (!username || !email || !password) {
    alert("Please provide all the required fields.");
    return;
  }

  // Send signup request to the backend
  fetch("http://localhost:3000/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

//login for existing users
function login() {
  //   const username = document.getElementById("username").value;
  const email = document.getElementById("email2").value;
  const password = document.getElementById("password2").value;

  // Perform validation
  if (!email || !password) {
    alert("Please provide all the required fields.");
    return;
  }

  // Send login request to the backend
  fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      if (data.message === "Success") window.location.href = "dashboard.html";
      email = "";
      password = "";
      // isLoggedIn = true;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Dashboard - Retrieve laundry request status and price
// function getDashboardData() {
//   fetch("/dashboard")
//     .then((response) => response.json())
//     .then((data) => {
//       const statusElement = document.getElementById("status");
//       const priceElement = document.getElementById("price");

//       statusElement.textContent = data.laundryRequestStatus;
//       priceElement.textContent = `$${data.price}`;
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//     });
// }

// Laundry Request - Submit laundry request
function submitLaundryRequest() {
  const name = document.getElementById("name").value;
  const address = document.getElementById("address").value;
  const laundryType = document.getElementById("laundryType").value;
  const laundryNumber = document.getElementById("laundryNumber").value;
  const notificationsElement = document.getElementById("notifications");
  const statusElement = document.getElementById("status");
  const priceElement = document.getElementById("price");

  // Clear existing notifications
  notificationsElement.innerHTML = "";
  const notificationItem = document.createElement("li");
  // Perform validation
  if (!name || !address || !laundryType) {
    alert("Please provide all the required fields.");
    return;
  }

  // Send laundry request to the backend
  fetch("http://localhost:3000/laundry-request", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, address, laundryType, laundryNumber }),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      alert(data.message);
      notificationItem.textContent = `${data.message}`;
      notificationsElement.appendChild(notificationItem);
      statusElement.textContent = "Pending";
      priceElement.textContent = `$${5 * laundryNumber}`;
    })
    .catch((error) => {
      console.error("Error:", error);
      notificationItem.textContent = `Laundry request failed`;
      notificationsElement.appendChild(notificationItem);
    });
  //   getNotifications();
  getDashboardData();
}

// User Profile - Update user profile
function updateProfile() {
  const name = document.getElementById("newname").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;

  // Perform validation
  if (!name || !email || !phone) {
    alert("Please provide all the required fields.");
    return;
  }

  // Send profile update request to the backend
  fetch("http://localhost:3000/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, phone }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Password Management - Change password
function changePassword() {
  const email = document.getElementById("confirmPassword").value;
  const currentPassword = document.getElementById("currentPassword").value;
  const newPassword = document.getElementById("newPassword").value;

  // Perform validation
  if (!currentPassword || !newPassword || !email) {
    alert("Please provide all the required fields.");
    return;
  }

  // Send password change request to the backend
  fetch("http://localhost:3000/password/change", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ currentPassword, newPassword, email }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Password Management - Recover password
function recoverPassword() {
  const email = document.getElementById("email1").value;

  // Perform validation
  if (!email) {
    alert("Please provide the email.");
    return;
  }

  // Send password recovery request to the backend
  fetch("http://localhost:3000/password/recover", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      alert(data.password);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Notifications - Retrieve notifications
// function getNotifications() {
//   fetch("http://localhost:3000/notifications")
//     .then((response) => response.json())
//     .then((data) => {
//       const notificationsElement = document.getElementById("notifications");
//       // Clear existing notifications
//       notificationsElement.innerHTML = "";

//       // Display notifications
//       data.forEach((notification) => {
//         const notificationItem = document.createElement("li");
//         notificationItem.textContent = `${notification.message}`;
//         notificationsElement.appendChild(notificationItem);
//       });
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//     });
// }
// - ${notification.timestamp}
