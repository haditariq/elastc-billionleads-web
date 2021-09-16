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
    const { skip, limit, q } = req.query;
    const { body } = await client.search({
      index: "billionleads",
      body: {
        from: parseInt(skip),
        size: parseInt(limit),
        query: {
          query_string: {
            query: q,
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

app.listen(9090, () => console.log("Listening on 9090"));
