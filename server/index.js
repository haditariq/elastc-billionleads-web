const app = require("express")();
const bodyParser = require("body-parser");
const { Client } = require("@elastic/elasticsearch");
const cors = require("cors");

const client = new Client({
  node: "http://65.21.21.126:9200",
  auth: {
    username: "elastic",
    password: "changeme",
  },
});
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/search", async (req, res, next) => {
  try {
    const { skip, limit, q, job_title } = req.query;
    const match = buildMatch(q, job_title);

    const { body } = await client.search({
      index: "billionleads",

      body: {
        from: parseInt(skip),
        size: parseInt(limit),
        query: {
          bool: {
            must: [match],
            // ...(job_title && { filter: { term: { job_title } } }),
          },
        },
      },
    });

    return res.send({ body, statusCode: 200 });
  } catch (error) {
    console.log("error :>> ", error);
    res.send(error);
  }
});
const PORT = process.env.PORT || 9090;

app.listen(PORT, () => console.log("Listening on 9090"));
function buildMatch(searchTerm, job_title) {
  return searchTerm
    ? {
        multi_match: {
          query: searchTerm,
        },
      }
    : { match_all: {} };
}
