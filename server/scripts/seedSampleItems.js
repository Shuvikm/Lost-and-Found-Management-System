const path = require("path");
const mongoose = require("mongoose");
const connectToMongo = require("../config/connectToMongo");
const Item = require("../models/ItemSchema");

// Load environment variables from the server folder
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

const sampleItems = [
  // LOST ITEMS
  {
    itemname: "Black Leather Wallet",
    itemdescription: "Premium black leather wallet containing college ID, ATM cards, and about ₹500 cash. Has initials 'RS' embossed. Last seen near the cafeteria.",
    concerntype: "lost",
    location: "College Cafeteria",
    category: "Personal Belongings",
    status: "reported",
    date: new Date("2025-12-15T10:30:00Z"),
    user: "demo-user-01",
    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=300&fit=crop",
    ],
  },
  {
    itemname: "Apple AirPods Pro",
    itemdescription: "White AirPods Pro 2nd generation in charging case. Has a small scratch on the case. Name engraved: 'Rahul'. Lost during morning lecture.",
    concerntype: "lost",
    location: "CSE Block - Room 301",
    category: "Electronics",
    status: "reported",
    date: new Date("2025-12-16T09:15:00Z"),
    user: "demo-user-02",
    images: [
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&h=300&fit=crop",
    ],
  },
  {
    itemname: "College ID Card",
    itemdescription: "Kongu Engineering College student ID card. Name: Priya Sharma, Roll No: 22CSE045. Urgently needed for exam hall entry.",
    concerntype: "lost",
    location: "Main Library",
    category: "Documents",
    status: "reported",
    date: new Date("2025-12-17T14:00:00Z"),
    user: "demo-user-03",
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    ],
  },
  {
    itemname: "HP Laptop Charger",
    itemdescription: "HP 65W laptop charger with blue tip. Left in computer lab after practical session. Has a small tape marking on the wire.",
    concerntype: "lost",
    location: "Computer Lab 2",
    category: "Electronics",
    status: "reported",
    date: new Date("2025-12-14T16:45:00Z"),
    user: "demo-user-04",
    images: [
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&h=300&fit=crop",
    ],
  },
  {
    itemname: "Blue Sports Water Bottle",
    itemdescription: "Nike blue stainless steel water bottle, 750ml capacity. Has stickers on it - one says 'Keep Grinding'. Lost near the sports ground.",
    concerntype: "lost",
    location: "Sports Ground",
    category: "Accessories",
    status: "reported",
    date: new Date("2025-12-13T18:00:00Z"),
    user: "demo-user-05",
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop",
    ],
  },
  {
    itemname: "Prescription Glasses",
    itemdescription: "Black rectangular frame glasses with anti-glare coating. Power: -2.5 both eyes. In a brown leather case. Very important for daily use!",
    concerntype: "lost",
    location: "Seminar Hall",
    category: "Personal Belongings",
    status: "reported",
    date: new Date("2025-12-12T11:30:00Z"),
    user: "demo-user-06",
    images: [
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=300&fit=crop",
    ],
  },
  // FOUND ITEMS
  {
    itemname: "Samsung Galaxy Phone",
    itemdescription: "Samsung Galaxy S21 in black color. Found on a bench near the parking area. Screen is locked. Owner please provide proof of ownership.",
    concerntype: "found",
    location: "Parking Area - Block A",
    category: "Electronics",
    status: "reported",
    date: new Date("2025-12-16T12:00:00Z"),
    user: "demo-user-07",
    images: [
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=300&fit=crop",
    ],
  },
  {
    itemname: "Red Backpack",
    itemdescription: "Red Wildcraft backpack containing notebooks, a calculator, and some pens. Found in the library reading area. Has a keychain attached.",
    concerntype: "found",
    location: "Library Reading Area",
    category: "Accessories",
    status: "reported",
    date: new Date("2025-12-17T08:30:00Z"),
    user: "demo-user-08",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
    ],
  },
  {
    itemname: "Wrist Watch - Titan",
    itemdescription: "Black analog Titan watch with leather strap. Found in the washroom near the canteen. Working condition, looks quite new.",
    concerntype: "found",
    location: "Canteen Washroom",
    category: "Accessories",
    status: "reported",
    date: new Date("2025-12-15T15:20:00Z"),
    user: "demo-user-09",
    images: [
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=300&fit=crop",
    ],
  },
  {
    itemname: "USB Flash Drive 32GB",
    itemdescription: "SanDisk 32GB USB flash drive with a red cap. Found plugged into computer in Lab 3. Contains some folders - owner can verify contents.",
    concerntype: "found",
    location: "Computer Lab 3",
    category: "Electronics",
    status: "reported",
    date: new Date("2025-12-14T10:00:00Z"),
    user: "demo-user-10",
    images: [
      "https://images.unsplash.com/photo-1597673030062-0a0f1a801a31?w=400&h=300&fit=crop",
    ],
  },
  {
    itemname: "Gold Earrings",
    itemdescription: "Pair of small gold hoop earrings. Found near the girls' hostel entrance. Traditional design with intricate patterns.",
    concerntype: "found",
    location: "Girls Hostel Entrance",
    category: "Jewelry",
    status: "reported",
    date: new Date("2025-12-13T19:30:00Z"),
    user: "demo-user-11",
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=300&fit=crop",
    ],
  },
  {
    itemname: "Textbook - Data Structures",
    itemdescription: "Data Structures and Algorithms textbook by Cormen. Has name 'Arun Kumar' written inside. Some pages are highlighted. Found in classroom.",
    concerntype: "found",
    location: "Classroom 205",
    category: "Books",
    status: "reported",
    date: new Date("2025-12-12T13:45:00Z"),
    user: "demo-user-12",
    images: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop",
    ],
  },
  {
    itemname: "Umbrella - Black",
    itemdescription: "Large black automatic umbrella. Left behind in the main auditorium after the cultural event. Has a wooden handle.",
    concerntype: "found",
    location: "Main Auditorium",
    category: "Accessories",
    status: "reported",
    date: new Date("2025-12-11T20:00:00Z"),
    user: "demo-user-13",
    images: [
      "https://images.unsplash.com/photo-1534309466160-70b22cc6252c?w=400&h=300&fit=crop",
    ],
  },
  {
    itemname: "Power Bank 20000mAh",
    itemdescription: "Mi Power Bank 20000mAh in white color. Found charging in the common room. Has some scratches but works perfectly.",
    concerntype: "found",
    location: "Common Room - Block B",
    category: "Electronics",
    status: "reported",
    date: new Date("2025-12-10T17:15:00Z"),
    user: "demo-user-14",
    images: [
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=300&fit=crop",
    ],
  },
  // RESOLVED ITEMS (for showing variety)
  {
    itemname: "Car Keys - Honda",
    itemdescription: "Honda car keys with remote. Had a small teddy bear keychain attached. Successfully returned to owner!",
    concerntype: "found",
    location: "Main Gate",
    category: "Keys",
    status: "resolved",
    date: new Date("2025-12-08T09:00:00Z"),
    user: "demo-user-15",
    images: [
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
    ],
  },
  {
    itemname: "Laptop Bag",
    itemdescription: "Black laptop bag with Dell laptop inside. Owner verified with serial number. Item has been claimed successfully.",
    concerntype: "lost",
    location: "Bus Stop",
    category: "Accessories",
    status: "resolved",
    date: new Date("2025-12-05T14:30:00Z"),
    user: "demo-user-16",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=300&fit=crop",
    ],
  },
];

const seed = async () => {
  try {
    if (!process.env.mongoURI && !process.env.MONGO_URI) {
      console.error("Missing mongoURI/MONGO_URI in .env. Cannot seed sample data.");
      process.exit(1);
    }

    await connectToMongo();

    let inserted = 0;
    let updated = 0;

    for (const item of sampleItems) {
      const result = await Item.updateOne(
        { itemname: item.itemname, concerntype: item.concerntype },
        { $set: item },
        { upsert: true }
      );

      if (result.upsertedCount && result.upsertedCount > 0) {
        inserted += 1;
      } else if (result.modifiedCount && result.modifiedCount > 0) {
        updated += 1;
      }
    }

    console.log(`Sample items ready. Inserted: ${inserted}, Updated: ${updated}.`);
  } catch (err) {
    console.error("Error seeding sample items:", err.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seed();
