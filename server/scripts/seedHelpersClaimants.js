const path = require("path");
const mongoose = require("mongoose");
const connectToMongo = require("../config/connectToMongo");
const Helper = require("../models/HelperSchema");
const Claimant = require("../models/ClaimantSchema");

// Load environment variables from the server folder
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

const sampleHelpers = [
  {
    itemdetails: "Black Leather Wallet - Found near cafeteria and returned to owner",
    helpername: "Arun Kumar",
    mobilenumber: "9876543210",
    hostelname: "Boys Hostel Block A",
    date: new Date("2025-12-10T10:30:00Z"),
  },
  {
    itemdetails: "Apple AirPods Pro - Helped locate the owner through social media",
    helpername: "Priya Sharma",
    mobilenumber: "9876543211",
    hostelname: "Girls Hostel Block B",
    date: new Date("2025-12-11T14:15:00Z"),
  },
  {
    itemdetails: "Samsung Galaxy Phone - Found and safely returned",
    helpername: "Rahul Verma",
    mobilenumber: "9876543212",
    hostelname: "Boys Hostel Block C",
    date: new Date("2025-12-12T09:00:00Z"),
  },
  {
    itemdetails: "Red Backpack with notebooks - Identified owner from notebook names",
    helpername: "Sneha Patel",
    mobilenumber: "9876543213",
    hostelname: "Girls Hostel Block A",
    date: new Date("2025-12-13T16:45:00Z"),
  },
  {
    itemdetails: "Wrist Watch Titan - Announced in class and found the owner",
    helpername: "Vikram Singh",
    mobilenumber: "9876543214",
    hostelname: "Boys Hostel Block B",
    date: new Date("2025-12-14T11:30:00Z"),
  },
  {
    itemdetails: "College ID Card - Returned to admin office for safekeeping",
    helpername: "Anjali Reddy",
    mobilenumber: "9876543215",
    hostelname: "Day Scholar",
    date: new Date("2025-12-15T08:00:00Z"),
  },
  {
    itemdetails: "USB Flash Drive - Helped identify owner from project files",
    helpername: "Mohammed Iqbal",
    mobilenumber: "9876543216",
    hostelname: "Boys Hostel Block A",
    date: new Date("2025-12-16T13:20:00Z"),
  },
  {
    itemdetails: "Gold Earrings - Helped return to rightful owner",
    helpername: "Kavitha Nair",
    mobilenumber: "9876543217",
    hostelname: "Girls Hostel Block C",
    date: new Date("2025-12-17T15:00:00Z"),
  },
];

const sampleClaimants = [
  {
    itemdetails: "Black Leather Wallet",
    claimantname: "Rajesh Kumar",
    mobilenumber: "9988776655",
    hostelname: "Boys Hostel Block A",
    proofofclaim: "Wallet has my college ID inside with roll number 22CSE101. Also contains my PAN card.",
    date: new Date("2025-12-15T11:00:00Z"),
  },
  {
    itemdetails: "Apple AirPods Pro",
    claimantname: "Sunita Devi",
    mobilenumber: "9988776656",
    hostelname: "Girls Hostel Block B",
    proofofclaim: "My name 'Sunita' is engraved on the case. Serial number ends with XK47.",
    date: new Date("2025-12-16T10:30:00Z"),
  },
  {
    itemdetails: "Samsung Galaxy Phone",
    claimantname: "Amit Sharma",
    mobilenumber: "9988776657",
    hostelname: "Boys Hostel Block C",
    proofofclaim: "I can unlock the phone with my fingerprint. Wallpaper is a photo of my dog 'Bruno'.",
    date: new Date("2025-12-17T09:15:00Z"),
  },
  {
    itemdetails: "Red Backpack",
    claimantname: "Pooja Gupta",
    mobilenumber: "9988776658",
    hostelname: "Girls Hostel Block A",
    proofofclaim: "Backpack has my initials 'PG' written inside. Contains my Data Structures notebook with name.",
    date: new Date("2025-12-17T14:00:00Z"),
  },
  {
    itemdetails: "HP Laptop Charger",
    claimantname: "Karthik Rajan",
    mobilenumber: "9988776659",
    hostelname: "Day Scholar",
    proofofclaim: "Charger has blue electrical tape wrapped around the wire near the adapter as marking.",
    date: new Date("2025-12-15T16:30:00Z"),
  },
  {
    itemdetails: "Prescription Glasses",
    claimantname: "Meera Krishnan",
    mobilenumber: "9988776660",
    hostelname: "Girls Hostel Block C",
    proofofclaim: "Glasses power is -2.5 for both eyes. Purchased from Lenskart store in Erode.",
    date: new Date("2025-12-14T12:00:00Z"),
  },
];

const seed = async () => {
  try {
    if (!process.env.mongoURI && !process.env.MONGO_URI) {
      console.error("Missing mongoURI/MONGO_URI in .env. Cannot seed sample data.");
      process.exit(1);
    }

    await connectToMongo();

    // Seed Helpers
    let helpersInserted = 0;
    for (const helper of sampleHelpers) {
      const exists = await Helper.findOne({ 
        helpername: helper.helpername, 
        itemdetails: helper.itemdetails 
      });
      if (!exists) {
        await Helper.create(helper);
        helpersInserted++;
      }
    }
    console.log(`Helpers seeded: ${helpersInserted} new entries added.`);

    // Seed Claimants
    let claimantsInserted = 0;
    for (const claimant of sampleClaimants) {
      const exists = await Claimant.findOne({ 
        claimantname: claimant.claimantname, 
        itemdetails: claimant.itemdetails 
      });
      if (!exists) {
        await Claimant.create(claimant);
        claimantsInserted++;
      }
    }
    console.log(`Claimants seeded: ${claimantsInserted} new entries added.`);

  } catch (err) {
    console.error("Error seeding data:", err.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seed();
