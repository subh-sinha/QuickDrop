import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import "./jobs/cleanupExpiredFiles.js";

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log("Server started on port " + PORT);
});