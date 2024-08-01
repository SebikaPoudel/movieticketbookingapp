// Step 1: Get reference to DOM elements

// Get a reference to main container
const container = document.querySelector(".container");

// Get a reference of all available seats
const seats = document.querySelectorAll(".row .seat:not(.sold)");

// Get a reference of count and total elements
const count = document.getElementById("count");
const total = document.getElementById("total");

// Reference of the movie dropdown
const movieSelect = document.getElementById("movie");

// Step 2: Add event listeners

// Event listener for movie selection change
movieSelect.addEventListener("change", (e) => {
  // Update ticket price and store selected movie data
  ticketPrice = +e.target.value;
  setMovieData(e.target.selectedIndex, e.target.value);

  // Update display count and total
  updateSelectedCount();
});

// Event listener for seat clicks
container.addEventListener("click", (e) => {
  // Check if a seat is clicked and not sold
  if (e.target.classList.contains("seat") && !e.target.classList.contains("sold")) {
    // Toggle seat selection
    e.target.classList.toggle("selected");
    // Update display count and total
    updateSelectedCount();
  }
});

// Step 3: Define function to update selected count and total

function updateSelectedCount() {
  // Get all selected seats
  const selectedSeats = document.querySelectorAll(".row .seat.selected");

  // Get an array of selected seat indexes
  const seatsIndex = [...selectedSeats].map((seat) => [...seats].indexOf(seat));

  // Store selected seats index into local storage
  localStorage.setItem("selectedSeats", JSON.stringify(seatsIndex));

  // Calculate selected seat count
  const selectedSeatsCount = selectedSeats.length;

  // Update UI with selected seats count and total price
  count.innerText = selectedSeatsCount;
  total.innerText = selectedSeatsCount * ticketPrice;

  // Set selected movie data
  setMovieData(movieSelect.selectedIndex, movieSelect.value);
}

// Step 4: Define function to set selected movie data in local storage
function setMovieData(movieIndex, moviePrice) {
  localStorage.setItem("selectedMovieIndex", movieIndex);
  localStorage.setItem("selectedMoviePrice", moviePrice);
}

// Step 5: Define function to populate UI with local storage data
function populateUI() {
  // Get selected seats from local storage
  const selectedSeats = JSON.parse(localStorage.getItem("selectedSeats"));

  // If there are selected seats, mark them as selected in the UI
  if (selectedSeats != null && selectedSeats.length > 0) {
    seats.forEach((seat, index) => {
      if (selectedSeats.indexOf(index) > -1) {
        seat.classList.add("selected");
      }
    });
  }

  // Get selected movie data from local storage
  const selectedMovieIndex = localStorage.getItem("selectedMovieIndex");

  // If there is selected movie index, then set it in the dropdown
  if (selectedMovieIndex !== null) {
    movieSelect.selectedIndex = selectedMovieIndex;
  }
}

// Step 6: Initial setup of count, total, and UI based on saved data
populateUI();

// Initialize ticket price
let ticketPrice = +movieSelect.value;

// Update the 'updateSelectedCount' function to send selected seats to server
function updateSelectedCount() {
  const selectedSeats = document.querySelectorAll('.row .seat.selected');
  const selectedSeatsIndexes = [...selectedSeats].map(seat => [...seats].indexOf(seat));

  const userEmail = prompt('Please enter your email address:'); // Prompt user for email

  if (userEmail) {
    fetch('/book-seat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ selectedSeats: selectedSeatsIndexes, userEmail })
    })
    .then(response => {
      if (response.ok) {
        alert('Seats booked successfully!');
        // Update UI as needed (e.g., disable selected seats)
      } else {
        alert('Error booking seats. Please try again.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error booking seats. Please try again.');
    });
  }
}
