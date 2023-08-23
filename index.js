import express from "express";
import router from "./routes/events.js";

const app = express();
const port = 5000;

app.use("/events", router);

app.use((req, res) => {
  res.status(404).send("Oops wrong page");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
