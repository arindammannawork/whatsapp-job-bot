import dotenv from "dotenv";
dotenv.config();
import app from "./app";
// import connectDB from "./config/db";
// connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servder is running on port ${PORT}`);
});

export default app;
// module.exports = app;
