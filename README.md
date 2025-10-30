**Synergia Event Booking API**

Features Implemented

| No | HTTP Method | Endpoint | Description |
|----|--------------|-----------|--------------|
| 1️ | GET | `/api/bookings` | Get all bookings |
| 2️ | POST | `/api/bookings` | Create a new booking |
| 3️ | GET | `/api/bookings/:id` | Get booking by ID |
| 4️ | PUT | `/api/bookings/:id` | Update booking details |
| 5️ | DELETE | `/api/bookings/:id` | Delete/cancel booking |
| 6️ | GET | `/api/bookings/search?email=xyz` | Search booking by email |
| 7️ | GET | `/api/bookings/filter?event=EventName` | Filter booking by event |

--Install Dependencies:

npm install

--Create a .env File:

MONGO_URI=mongodb+srv://<your-username>:<your-password>@cluster0.qqs64.mongodb.net/?appName=Cluster0

--Run the Server

node server.js

--Folder Structure
MONGO_ASSIGNMENT3/
│
├── node_modules/                
│
├── screenshots/               
│   ├── Delete.png
│   ├── Filter.png
│   ├── FinalMongodbData.png
│   ├── Get_All.png
│   ├── Get.png
│   ├── MongodbData.png
│   ├── Post.png
│   ├── Put.png
│   └── Search.png
│
├── .env                        
├── .gitignore                   
├── package-lock.json
├── package.json
├── README.md                   
└── server.js                   

