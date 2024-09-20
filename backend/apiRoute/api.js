const express = require("express");
const router = express.Router();
const { default: axios } = require("axios");

const API_KEY = process.env.API_KEY;

// Fetch function for making API calls
async function fetchNews(url, res) {
  console.log(url);
  try {
    const response = await axios.get(url);
    if (response.data.totalResults > 0) {
      res.status(200).json({
        status: 200,
        success: true,
        message: "Successfully fetched the data",
        data: response.data,
      });
    } else {
      res.status(404).json({
        status: 404,
        success: false,
        message: "Data not found",
        data: [],
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: "Failed to fetch data from NewsAPI",
      error: error.message,
    });
  }
}

// Route to get all news
router.get("/all-news", async (req, res) => {
  const {
    q = "today",
    searchIn = null,
    domains = null,
    pageSize = 40,
    page = 1,
  } = req.query;
  let url = `https://newsapi.org/v2/everything?`;

  if (q) url += `q=${encodeURIComponent(q)}&`;
  if (searchIn) url += `searchIn=${encodeURIComponent(searchIn)}&`;
  if (domains && Array.isArray(domains)) {
    const domainString = domains.join(",");
    url += `domains=${encodeURIComponent(domainString)}&`;
  }

  url += `pageSize=${parseInt(pageSize)}&`;
  url += `page=${parseInt(page)}&`;
  url += `apiKey=${API_KEY}`;
  await fetchNews(url, res);
});

// Route to get top headlines
router.get("/top-headlines", async (req, res) => {
  const {
    q = "today",
    sources = null,
    country = "in",
    category = "business",
    pageSize = 40,
    page = 1,
  } = req.query;
  let url = `https://newsapi.org/v2/top-headlines?`;

  if (q) url += `q=${encodeURIComponent(q)}&`;
  if (sources && Array.isArray(sources)) {
    const sourcesString = sources.join(",");
    url += `sources=${encodeURIComponent(sourcesString)}&`;
  }

  url += `country=${country}&`;
  url += `category=${category}&`;
  url += `pageSize=${parseInt(pageSize)}&`;
  url += `page=${parseInt(page)}&`;
  url += `apiKey=${API_KEY}`;
  await fetchNews(url, res);
});

// Route to get country news
router.get("/country/:iso", async (req, res) => {
  const iso = req.params.iso;
  let url = `https://newsapi.org/v2/top-headlines?country=${iso}&apiKey=${API_KEY}`;

  await fetchNews(url, res);
});

module.exports = router;
