Login API
URL POST REQUEST: http://127.0.0.1:8080/api/v1/auth/login
Body: {
    "username":"adwait",
    "password":"adwait"
}
Response:
{
    "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZHdhaXQiLCJpYXQiOjE3MzAwMzAxODIsImV4cCI6MTczMTUwMTQxMX0.3Usd55gVXrJBVgpEOA-3vkdolcWakIg_JAnVcdkhnxA",
    "message": "SUCCESS"
}
=========================================================
Register API
URL POST REQUEST: http://127.0.0.1:8080/api/v1/auth/register
BODY: {
    "firstname":"adwait",
    "lastname":"adwait",
    "username":"adwait",
    "email":"adwait",
    "password":"adwait"
}
RESPONSE: {
    "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZHdhaXQiLCJpYXQiOjE3MzAwMzAxMTAsImV4cCI6MTczMTUwMTMzOX0.qXxnHokY50RV1WZN5i4Uc6yDPcI70_lYBDMMaz-rurk",
    "message": "SUCCESS"
}