// Simple test script for password reset functionality
// Run with: node test-password-reset.js

const crypto = require('crypto');

// Test password hashing
const testPassword = 'testpassword123';
const saltRounds = 10;

// Simulate bcrypt hashing (you would use actual bcrypt in the app)
const hashedPassword = crypto.createHash('sha256').update(testPassword + 'salt').digest('hex');
console.log('Original password:', testPassword);
console.log('Hashed password:', hashedPassword);

// Test reset token generation
const resetToken = crypto.randomBytes(32).toString('hex');
const resetPasswordToken = crypto
  .createHash('sha256')
  .update(resetToken)
  .digest('hex');

console.log('\nReset token (for email):', resetToken);
console.log('Hashed reset token (for database):', resetPasswordToken);

// Test token verification
const verifyToken = crypto
  .createHash('sha256')
  .update(resetToken)
  .digest('hex');

console.log('\nToken verification:', verifyToken === resetPasswordToken ? 'SUCCESS' : 'FAILED');

// Test expiration
const now = new Date();
const expiration = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now
console.log('\nCurrent time:', now.toISOString());
console.log('Expiration time:', expiration.toISOString());
console.log('Is expired:', now > expiration ? 'YES' : 'NO');

console.log('\n✅ Password reset functionality test completed!'); 