# Student Management Backend

### Setup
 
 1. Clone this repo by using
 
 ```
 git clone https://github.com/dev-chester/student-management-backend.git student-management-backend-ca
 ```
 
 
 2. Create an .env file in root folder project
 
 ```
 APP_PORT=4000
 DB_HOST=localhost
 DB_USER=root
 DB_PASS=
 DB_NAME=development-student-management
 DB_DIALECT=mysql
 DB_PORT=3306
 APP_HOST=localhost
 NODE_ENV=development
 ```
 
 3. Install the dependencies
 
 ```
 npm install
 ```
 
 4. Setup the database - (This will ``drop``,``create``, and ``migrate``)
 
 ```
 npm run db:setup
 ```
 ---
 ### Run
 
 1. Run locally
 
 ```
 npm run dev
 ```
