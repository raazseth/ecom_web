const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 5000;

app.get("/scrape", async (req, res) => {
  try {
    const response = await axios.get(
      "https://www.maincharacterindia.com/collections/all"
    );
    const $ = cheerio.load(response.data);

    const quotes = [];

    $(".grid__item").each((index, element) => {
      const title = $(element).find(".card__heading").text().trim();
      const price = $(element)
        .find(".card-information .price .price__container .price-item:first")
        .text()
        .trim();
      const media = $(element).find(".motion-reduce").attr("src");
      const link = $(element).find(".full-unstyled-link").attr("href");

      const cleanedTitle = title.replace(/\s+/g, " ").trim();
      const cleanedPrice = price.replace(/\s+/g, " ").replace(/ /g, "").trim();

      quotes.push({
        title: cleanedTitle,
        price: cleanedPrice,
        media,
        link,
      });
    });

    res.json(quotes);
  } catch (error) {
    console.error("Error scraping:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/scraped", async (req, res) => {
  try {
    const response = await axios.get(
      `https://www.maincharacterindia.com${req.query.link}`
    );
    const $ = cheerio.load(response.data);

    const quotes = [];

    $(".product").each((index, element) => {
      const title = $(element).find(".product__title").text().trim();
      const price = $(element)
        .find(".price .price__container .price-item:first")
        .text()
        .trim();
      const cleanedTitle = title.replace(/\s+/g, " ").trim();
      const cleanedPrice = price.replace(/\s+/g, " ").replace(/ /g, "").trim();
      const media = $(element).find(".product-single__photo ").attr("src");
      const description = $(element)
        .find(".product-single__description")
        .text();

      quotes.push({
        title: cleanedTitle,
        price: cleanedPrice,
        media,
        description,
      });
    });

    res.json(quotes);
  } catch (error) {
    console.error("Error scraping:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
