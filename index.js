const express = require("express")
const urlRoute = require("./routes/url")
const { connectToDB } = require("./connection")
const url = require("./models/url")
const staticRouter = require("./routes/staticRouters")
const app = express();
const PORT = 8001;
const path = require("path")
const exp = require("constants")
connectToDB('mongodb://localhost:27017/Short-URL').then(() => console.log("mongodb connected"))
app.set("view engine", "ejs");
app.set('views', path.resolve("./views"))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", staticRouter)
app.use("/url", urlRoute)

app.get("/test", async(req, res) => {
    return res.render("home")
})
app.get("/url/:shortId", async(req, res) => {
    const shortId = req.params.shortId;
    console.log(shortId);
    try {
        const entry = await url.findOne({ shortId });
        console.log(entry);
        if (!entry || !entry.redirectUrl) {
            return res.status(404).send("URL not found");
        }

        await url.findOneAndUpdate({ shortId }, {
            $push: {
                visitHistory: {
                    timeStamp: Date.now(),
                },
            },
        });

        res.redirect(entry.redirectUrl);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
});

app.listen(PORT, () => console.log("Server Started"))