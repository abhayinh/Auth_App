export const EMAIL_VERIFY_TEMPLATE = `
<!DOCTYPE html>
<html>
  <body>
    <h2>Verify your email</h2>
    <p>Your OTP is:</p>
    <h1>{{otp}}</h1>
    <p>Valid for 24 hours</p>
  </body>
</html>
`;

export const PASSWORD_RESET_TEMPLATE = `
<!DOCTYPE html>
<html>
  <body>
    <h2>Reset your password</h2>
    <p>Your OTP is:</p>
    <h1>{{otp}}</h1>
    <p>Valid for 15 minutes</p>
  </body>
</html>
`;
