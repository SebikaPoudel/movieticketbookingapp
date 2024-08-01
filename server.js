const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection URI
//4#RDL!pp6-@JNzY
const uri = 'mongodb+srv://sebika:<password>@atlascluster.7rltvmi.mongodb.net/'; // Replace with your MongoDB URI

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
let db;

MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to MongoDB');
    db = client.db(); // Get the database instance
  })
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Route to handle seat selection and booking
app.post('/book-seat', (req, res) => {
  const { selectedSeats, userEmail } = req.body;

  // Insert booked seats into MongoDB
  const bookingsCollection = db.collection('bookings');

  bookingsCollection.insertOne({ seats: selectedSeats, user: userEmail })
    .then(result => {
      // Send confirmation email
      sendConfirmationEmail(selectedSeats, userEmail);

      res.status(200).send('Seats booked successfully');
    })
    .catch(err => {
      console.error('Error booking seats:', err);
      res.status(500).send('Error booking seats. Please try again.');
    });
});

// Function to send confirmation email
function sendConfirmationEmail(selectedSeats, userEmail) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sebikaupadhyaya@gmail.com', // Replace with your Gmail email
      pass: 'UTTAM@560512' // Replace with your Gmail password
    }
  });

  const mailOptions = {
    from: 'sebikaupadhyaya@gmail.com',
    to: userEmail,
    subject: 'Seat Booking Confirmation',
    text: `You have successfully booked seats: ${selectedSeats.join(', ')}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
