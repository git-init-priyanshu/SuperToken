const express = require("express");
const http = require("http").Server(app);
const cors = require("cors");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Available Routes
app.use("/api/", require("./routes/"));
app.use("/api/", require("./routes/"));

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
