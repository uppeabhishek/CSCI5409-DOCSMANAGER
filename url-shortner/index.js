import express from "express";
import bodyparser from "body-parser";
import router from "./routes/routes.js";
import cors from "cors";

const PORT = process.env.PORT || 80;

const app = express();

app.use(cors());

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));
app.use("/", router);
