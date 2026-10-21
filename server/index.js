require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require("http");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", require("./routes/auth"));
app.use("/api/leagues", require("./routes/leagues"));
app.use("/api/draft", require("./routes/draft"));

const server = http.createServer(app);
require("./socket").start(server);

app.get('/', (req, res) => {
  res.send('Dynasty Drafters API running');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log('Server running on port', PORT);
});