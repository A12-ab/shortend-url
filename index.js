const express = require('express');
const { connectToMongoDB } = require('./connect');

const urlRoute = require('./routes/url');
const URL = require('./models/url');

const app = express();
const port = 8001;

connectToMongoDB('mongodb://localhost:27017/short-url')
    .then(() => console.log('Mongodb connected'));

app.use(express.json());

app.use('/url', urlRoute);

app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;

    const entry = await URL.findOneAndUpdate(
        { shortId: shortId }, // Query by shortId field
        {
            $push: {
                visitHistory: {
                    timestamp: Date.now()
                },
            },
        },
        { new: true } // Return the updated document
    );

    if (!entry) {
        return res.status(404).json({ error: 'URL not found' });
    }

    res.redirect(entry.redirectURL);
});

app.listen(port, () => {
    console.log(`server started at port: ${port}`);
});
