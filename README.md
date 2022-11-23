# password-reset

1) Sign up page: 
   1) email already exists validation.
   2) password and forgot password mismatch validation.
   3) registration successfull.
2) Forgot password and reset password
   1) only registered email address validation.
   2) if right email is entered, you will receive email with reset password link.
   3) click the reset password link will open new page to enter password.
   4) once reset password is done, it will redirect to forgot password page.
   5) if clicked again it will redirect to forgot password page cause its submitted already and validated.
   
Usage:
1) Simple ui with bootstrap and toastify.
2) node mailer.
3) mongo db.
4) nodejs-base64 for password token generation.
5) enabled oauth2 for gmail mail to act as server and the token valid only for 1 day(https://developers.google.com/oauthplayground)

Note: screenshot of worked solution also attached  starts with 0 - 7.png
  

