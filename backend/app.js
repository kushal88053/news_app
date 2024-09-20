require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { default: axios } = require("axios");

const app = express();
app.use(express.json());
app.use(cors());

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

app.get("/all-news", async (req, res) => {
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

const PORT = process.env.PORT || 3000;

app.get("/top-headlines", async (req, res) => {
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
  console.log(req.ip);
  await fetchNews(url, res);
});

app.get("/country/:iso", async (req, res) => {});

app.get("/", async (req, res) => {
  res.status(200).json({ message: "Health check" });
});
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
