# SURGE-App
Surge Internship - Practical Test

### Getting Started
## Tech Stack
![alt text](https://raw.githubusercontent.com/Rumirad64/SURGE-App/main/stack.png) 
1. MongoDB - document database
2. Express(.js) - Node.js web framework
3. React(.js) - a client-side JavaScript framework
4. Node(.js) - the premier JavaScript web server
#### .env file structure for Backend

```
DB_CON_STRING=mongodb+srv://admin:NnsmAKaKp50B9dzc@clusterx.0izsi.mongodb.net/MySurgeApp?retryWrites=true&w=majority
JWT_SECRET=sdusfgh34uirdfgvd535584856X
JWT_EXPIRES_IN=24h
AUTH_HEADER_NAME=x-auth-token
PORT=8000
ADDRESS=0.0.0.0
```
These are working credentials for testing purposes.

**Import this .env file to /Backend folder. Otherwise app will not work**


---

### Instructions for run app natively (without docker)

> prerequisites
1. NodeJS 16.x

``` git clone https://github.com/Rumirad64/SURGE-App.git ```

``` cd SURGE-App ```

``` cd BackEnd ```

``` npm i ```

``` npm run dev ```

``` cd .. ```

``` cd FrontEnd ```

``` npm i ```

``` npm start ```

Application will be live on [http://localhost:3000/#/](http://localhost:3000/#/)


---

### Instructions for run app in docker (with docker)

![alt text](https://raw.githubusercontent.com/Rumirad64/SURGE-App/main/docker.png) 

> prerequisites
1. Docker

``` git clone https://github.com/Rumirad64/SURGE-App.git ```

``` cd SURGE-App ```

``` docker-compose up --build ```

Application will be live on [http://localhost:3000/#/](http://localhost:3000/#/)

---

#### Login test credentials 
- username - Rumirad
- password - 123456789

























