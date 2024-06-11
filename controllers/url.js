const shortid = require("shortid");
const URL = require('../models/url');

async function handleGenerateNewShortURL(req, resp) {
    const body = req.body;
    if (!body.url) return resp.status(400).json({ error: 'url is required' });

    const generatedShortId = shortid.generate();  // Use a different name for the variable

    await URL.create({
        shortId: generatedShortId,
        redirectURL: body.url,
        visitHistory: [],
    });

    return resp.json({ id: generatedShortId });
}

module.exports = {
    handleGenerateNewShortURL
}
