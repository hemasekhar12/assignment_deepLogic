const express = require("express");
const request = require("request");
const cheerio = require("cheerio");

const app = express();

const fetchHTML = (url) => {
  return new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        resolve(body);
      } else {
        reject(
          `Failed to fetch HTML content from ${url}. Status code: ${response.statusCode}`
        );
      }
    });
  });
};

const extractLatestStories = (html) => {
  const $ = cheerio.load(html);
  const latestStories = [];
  $("h3.latest-stories__item-headline").each((index, element) => {
    const title = $(element).text().trim();
    const link = $(element).parent().attr("href");
    latestStories.push({ title, link });
  });
  return latestStories.slice(0, 6);
};

app.get("/getTimeStories", async (req, res) => {
  const url = "http://time.com";
  try {
    const html = await fetchHTML(url);
    const latestStories = extractLatestStories(html);
    res.json(latestStories);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
