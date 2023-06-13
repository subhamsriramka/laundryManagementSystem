//Email validation
function validateEmail(email) {
  // Email format validation using a regular expression
  return /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(email);
}

//Password validation
function validatePassword(password) {
  // Password should have a minimum length of 8 characters,
  // and contain at least one uppercase letter, one lowercase letter, and one digit
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
    password
  );
}

//First name validation
function validateFirstName(firstName) {
  // First name should start with a capital letter
  return /^[A-Z][a-zA-Z]*$/.test(firstName);
}

//Phone number validation
function validatePhoneNumber(phoneNumber) {
  const regexPattern = /^[6-9]\d{9}$/;
  return regexPattern.test(phoneNumber);
}

// User Signup - Register
function signup() {
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Perform validation
  if (!validateFirstName(firstName)) {
    alert(
      "First name should start with a capital letter and should only contain alphabets"
    );
    return;
  }

  if (!validateEmail(email)) {
    alert("Enter a valid email address");
    return;
  }

  if (!validatePassword(password)) {
    alert(
      "Password should have a minimum length of 8 characters,and contain at least one uppercase letter, one lowercase letter, one digit and one special case letter"
    );
    return;
  }

  // Send signup request to the backend
  fetch("http://localhost:3000/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ firstName, lastName, email, password }),
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
      if (data.message === "Success" && data.isAdmin == 0) {
        localStorage.setItem("email", email);
        window.location.href = "dashboard.html";
      } else if (data.message == "Success" && data.isAdmin == 1) {
        localStorage.setItem("email", email);
        window.location.href = "admin.html";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Laundry Request - Submit laundry request
function submitLaundryRequest() {
  const email = localStorage.getItem("email");
  const address = document.getElementById("address").value;
  const laundryType = document.getElementById("laundryType").value;
  const laundryNumber = document.getElementById("laundryNumber").value;
  const notificationsElement = document.getElementById("notifications-list");

  // Clear existing notifications
  notificationsElement.innerHTML = "";
  const notificationItem = document.createElement("li");

  // Perform validation
  if (laundryNumber == 0) {
    alert("Please enter a valid laundry number");
    return;
  }

  // Send laundry request to the backend
  fetch("http://localhost:3000/laundry-request", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, address, laundryType, laundryNumber }),
  })
    .then((response) => {
      console.log(email + "2");
      return response.json();
    })
    .then((info) => {
      fetchDashboard();

      //Update notification
      notificationItem.textContent = `${info.message}`;
      notificationsElement.appendChild(notificationItem);
    })
    .catch((error) => {
      notificationItem.textContent = `Laundry request failed`;
      notificationsElement.appendChild(notificationItem);
    });
}

//Fetch dashboard data
function fetchDashboard() {
  //update dashboard
  fetch("http://localhost:3000/data")
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.querySelector("#data-table-dashboard");
      DeleteRows(tableBody);

      // Iterate over the received data and create table rows
      data.forEach((item) => {
        const row = document.createElement("tr");
        const field1 = document.createElement("td");
        const field2 = document.createElement("td");
        if (item.email == localStorage.getItem("email")) {
          // Set the cell values
          field1.textContent = item.status;
          field2.textContent = item.laundryNumber * 10;

          // Append cells to the row
          row.appendChild(field1);
          row.appendChild(field2);

          // Append the row to the table body
          tableBody.appendChild(row);
        }
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// User Profile - Update user profile
function updateProfile() {
  const firstName = document.getElementById("newFirstName").value;
  const lastName = document.getElementById("newLastName").value;
  const email = localStorage.getItem("email");
  const phone = document.getElementById("phone").value;

  // Perform validation
  if (!firstName || !lastName || !phone) {
    alert("Please provide all the required fields.");
    return;
  }

  if (!validateFirstName(firstName)) {
    alert(
      "First name should start with a capital letter and should only contain alphabets"
    );
    return;
  }

  if (!validatePhoneNumber(phone)) {
    alert("Enter a valid phone number");
    return;
  }

  // Send profile update request to the backend
  fetch("http://localhost:3000/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ firstName, lastName, email, phone }),
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
  const email = localStorage.getItem("email");
  const currentPassword = document.getElementById("currentPassword").value;
  const newPassword = document.getElementById("newPassword").value;

  // Perform validation
  if (!currentPassword || !newPassword) {
    alert("Please provide all the required fields.");
    return;
  }

  if (!validatePassword(newPassword)) {
    alert(
      "Password should have a minimum length of 8 characters,and contain at least one uppercase letter, one lowercase letter, one digit and one special case letter"
    );
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
  if (!(email === localStorage.getItem("email"))) {
    alert("Please provide the correct email.");
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

//fetch all laundry data
function fetchData() {
  fetch("http://localhost:3000/data")
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.querySelector("#data-table");
      DeleteRows(tableBody);

      // Iterate over the received data and create table rows
      data.forEach((item) => {
        const row = document.createElement("tr");
        const field1 = document.createElement("td");
        const field2 = document.createElement("td");
        const field3 = document.createElement("td");
        const field4 = document.createElement("td");
        const actionCell = document.createElement("td");
        const button = document.createElement("button");
        button.textContent = item.status;
        button.addEventListener("click", () => handleButtonClick(item._id));

        // Set the cell values
        field1.textContent = item.email;
        field2.textContent = item.address;
        field3.textContent = item.laundryType;
        field4.textContent = item.laundryNumber;
        actionCell.appendChild(button);

        // Append cells to the row
        row.appendChild(field1);
        row.appendChild(field2);
        row.appendChild(field3);
        row.appendChild(field4);
        row.appendChild(actionCell);

        // Append the row to the table body
        tableBody.appendChild(row);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

//changing status
function handleButtonClick(_id) {
  // Send status update request to the backend
  fetch("http://localhost:3000/status", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ _id }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      setTimeout(fetchData(), 0);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

//Delete rows function
function DeleteRows(tableBody) {
  var rowCount = tableBody.rows.length;
  for (var i = rowCount - 1; i > 0; i--) {
    tableBody.deleteRow(i);
  }
}
