const shortid = require('shortid');
const URL = require('../models/url'); // Assuming URL is your Mongoose model

async function generateNewShortUrl(req, res) {
    const body = req.body;
    console.log(body);
    if (!body.url) return res.status(400).json({ error: "URL is required" });

    const shortId = shortid.generate();
    console.log(shortId);
    try {
        const newURL = await URL.create({
            shortId: shortId,
            redirectUrl: body.url,
            visitHistory: [],
        });
        return res.render("home", {
            id: newURL.shortId,
        });
    } catch (error) {
        return res.status(500).json({ error: "Error creating short URL" });
    }
}

async function getAnalytics(req, res) {
    const shortId = req.params.shortId;

    try {
        const result = await URL.findOne({ shortId });
        if (!result) {
            return res.status(404).json({ error: 'URL not found' });
        }
        return res.json({
            totalClicks: result.visitHistory.length,
            analytics: result.visitHistory
        });
    } catch (error) {
        return res.status(500).json({ error: "Error fetching analytics" });
    }
}

module.exports = {
    generateNewShortUrl,
    getAnalytics,
};