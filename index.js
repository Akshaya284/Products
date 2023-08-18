const express = require('express');
const app = express();
const mongoose = require("mongoose");
const dbConfig = require("./Config/db.config");


mongoose.Promise = global.Promise;
mongoose
  .connect(dbConfig.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    () => {
      console.log("Database connected");
    },
    (error) => {
      console.log("Database can't be connected: " + error);
    }
  );

app.use(express.json());


app.use("/products", require('./Routes/productRoutes'));
app.use("/auth", require("./Routes/authRotes"));

app.listen(process.env.port || 3001, function () {
  console.log("Server started successfully!");
});