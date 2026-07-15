const admin = require('firebase-admin');

// Initialize with default application credentials (assumes 'firebase login' was run and has access)
admin.initializeApp({
  projectId: 'elephant-392b0'
});

async function createAdmin() {
  try {
    const userRecord = await admin.auth().createUser({
      email: 'admin@hec.local',
      password: 'password123',
      displayName: 'System Admin',
    });
    
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      name: 'System Admin',
      role: 'admin',
      phone: 'admin',
      createdAt: new Date()
    });
    
    console.log("Admin created successfully!");
    process.exit(0);
  } catch(e) {
    if (e.code === 'auth/email-already-exists') {
        console.log("Admin already exists!");
        process.exit(0);
    }
    console.error(e.message);
    process.exit(1);
  }
}

createAdmin();
