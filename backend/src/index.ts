import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import applicationRoutes from "./routes/applicationRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use(
  "/api/applications",
  applicationRoutes
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});