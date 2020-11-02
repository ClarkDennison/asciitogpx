# asciitogpx
Converts ascii(specifically gulf stream data) to gpx format for upload into navigational software

npm install

create .env file

Needs to have these two variable defined
USERNAME=<email username on gmail>
PASSWORD=<password on gmail>
TOEMAIL=<email address you want mailed to>
  
node main.js 

generates file GulfStream.GPX
emailed to address specified above
