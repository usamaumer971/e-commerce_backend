const app = require('./app');
const db = require("./models/database");
const dotenv = require('dotenv');
dotenv.config({ path:'config/config.env'});
// Handle Uncatch Exception
process.on("uncaughtException", (err)=>{
  console.log(`Error: ${err.message}`);
  console.log("Server down due to unhandel exception");
  process.exit(1);
})

db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })

app.get("/", (req, res) => {
    res.json({ message: "API Running" });
});

app.listen(4000, ()=>{
    console.log(`Server is running 4000`);
});

// Unhandel promise rejection
process.on("unhandledRejection",(err)=>{
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to unhandel promises rejection");

    process.exit(1);
})