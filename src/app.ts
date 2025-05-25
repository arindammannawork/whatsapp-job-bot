import express from "express";
import jobRoutes from "./routes/job.routes";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

app.use("/api/jobs", jobRoutes);
app.use("/", (req, res) => {
  res.send("Welcome to the Job Search API!");
});

export default app;
