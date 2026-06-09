import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

app.get("/", (req, res) => {
  res.send("Job Application Tracker Backend Running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});