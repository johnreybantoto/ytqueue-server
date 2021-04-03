require("dotenv").config();
const express = require("express");
const { google } = require("googleapis");
const compression = require("compression");
// const cors = require("cors");
const path = require("path");

const app = express();
const port = process.env.PORT;
const maxResults = process.env.MAX_RESULTS;

app.use(compression());
// app.use(cors());

const youtubeApiKey = process.env.YOUTUBE_API_KEY;
const youtube = google.youtube("v3");

async function searchVideo(searchQuery) {
  console.log(
    "🚀 ~ file: app.js ~ line 16 ~ searchVideo ~ searchQuery",
    searchQuery
  );
  const results = await youtube.search.list({
    maxResults,
    type: "video",
    part: "snippet",
    q: searchQuery,
    key: youtubeApiKey,
    videoEmbeddable: "true",
  });

  return results;
}

app.use(express.static(path.join(__dirname, "build")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.get("/api/search/:searchQuery", async (req, res) => {
  const results = await searchVideo(req.params.searchQuery);

  res.status(200).send(results.data.items);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
