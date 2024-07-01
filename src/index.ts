import express, { Response, Request, Express } from "express";
import { PORT } from "./env";
import rootRoutes from "./routes";
const app: Express = express();
app.use(express.json())

app.use("/api",rootRoutes);


app.get("/", (req: Request, res: Response) => {
    res.json({
        message: "Hello World",
    })
})

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})