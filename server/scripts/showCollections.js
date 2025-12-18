const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

async function showCollections() {
  try {
    await mongoose.connect(process.env.mongoURI);
    console.log('\n===========================================');
    console.log('MongoDB Database: ' + mongoose.connection.db.databaseName);
    console.log('===========================================\n');
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 COLLECTIONS:');
    console.log('---------------');
    for (const col of collections) {
      const count = await mongoose.connection.db.collection(col.name).countDocuments();
      console.log(`  • ${col.name}: ${count} documents`);
    }
    
    console.log('\n👤 LOSTANDFOUND_USERS COLLECTION (Login/Signup Data):');
    console.log('------------------------------------------------------');
    const users = await mongoose.connection.db.collection('lostandfound_users').find({}).toArray();
    if (users.length === 0) {
      console.log('  No users found');
    } else {
      users.forEach((u, i) => {
        console.log(`  ${i + 1}. Email: ${u.email}`);
        console.log(`     Username: ${u.username}`);
        console.log(`     Roll No: ${u.rollno}`);
        console.log(`     Role: ${u.role}`);
        console.log('');
      });
    }
    
    console.log('📦 ITEMS COLLECTION (Lost & Found):');
    console.log('------------------------------------');
    const items = await mongoose.connection.db.collection('items').find({}).project({ itemname: 1, concerntype: 1, status: 1 }).toArray();
    if (items.length === 0) {
      console.log('  No items found');
    } else {
      items.slice(0, 5).forEach((item, i) => {
        console.log(`  ${i + 1}. ${item.itemname} [${item.concerntype}] - ${item.status || 'reported'}`);
      });
      if (items.length > 5) {
        console.log(`  ... and ${items.length - 5} more items`);
      }
    }
    
    console.log('\n===========================================\n');
    
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

showCollections();
