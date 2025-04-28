const bcrypt = require('bcryptjs');
bcrypt.hash('anas@1234', 10, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
  } else {
    console.log('New hash:', hash);
  }
});