const sqlite3 = require("sqlite3");

const morgan = require("morgan");

const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const port = process.env.PORT || 8081;
const app = express();

const db = new sqlite3.Database(__dirname + "/database.sqlite");

app.use(morgan("dev"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CREATEING TABLES

//CREATE/DROP setup for ITEMS
const CREATE_ITEMS =
  "CREATE TABLE if not exists items (item_ID INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, category TEXT, price INTERGER, order_number INTERGER);";
const DROP_ITEMS = "DROP TABLE if exists items;";

//CREATE/DROP setup for CARDS
const CREATE_CARD =
  "CREATE TABLE if not exists cards (card_ID INTEGER PRIMARY KEY AUTOINCREMENT, card_number INTERGER, store_name TEXT, store_location TEXT, date INTERGER, month_number INTERGER, year_number INTERGER, recipt_number INTERGER);";
const DROP_CARD = "DROP TABLE if exists cards;";

// GET STATEMENTS

//Creating the tables
app.get("/create", (req, res) => {
  db.run(CREATE_ITEMS);
  db.run(CREATE_CARD);
  res.status(201).send("Table created");
});

//Dropping the tables
app.get("/drop", (req, res) => {
  db.run(DROP_ITEMS);
  db.run(DROP_CARD);
  res.status(204).send("Table dropped");
});

//Resets the tables
app.get("/reset", (req, res) => {
  db.run(DROP_ITEMS, () => {
    console.log("Table dropped ...");
    db.run(CREATE_ITEMS, () => {
      console.log("...  and re-created");

      db.run(
        `INSERT INTO items (name, category, price, order_number) VALUES (?,  ?,  null, ?);`
      );
    });
  });

  db.run(DROP_CARD, () => {
    console.log("Table dropped ...");
    db.run(CREATE_CARD, () => {
      console.log("...  and re-created");

      db.run(
        "INSERT INTO cards (card_number, store_name, store_location, date, month_number, year_number, recipt_number) VALUES (null,  ?,  ?, ?, ?, ?, ?);"
      );
    });
  });

  res.sendStatus(205);
});

// MAIN ENTRY. Returns frontpage with usage description on /
router.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

//Returns data stored in tables
app.get("/showall", (req, res) => {
  let data = [];

  let order_number = req.params.order_number;
  let recipt_number = req.params.recipt_number;

  db.serialize(() => {
    db.each(
      "SELECT * FROM items, cards WHERE order_number AND recipt_number IS NOT NULL;",
      order_number,
      recipt_number,
      (err, row) => {
        console.log(row);
        data.push(row);
      },
      () => {
        res.status(200).send(data);
      }
    );
  });
});

//Returns all stored ITEMS
app.get("/items", (req, res) => {
  let items = [];

  db.serialize(() => {
    db.each(
      "SELECT * FROM items WHERE price IS NOT NULL;",
      (err, row) => {
        console.log(row.name);
        items.push(row);
      },
      () => {
        res.status(200).send({ items });
      }
    );
  });
});

//Returns all stored CARDS
app.get("/cards", (req, res) => {
  let cards = [];
  db.serialize(() => {
    db.each(
      "SELECT * FROM cards WHERE recipt_number IS NOT NULL;",
      (err, row) => {
        console.log(row.card_number);
        cards.push(row);
      },
      () => {
        res.status(200).send({ cards });
      }
    );
  });
});

//Returns all data stored to a single CARD
app.get("/card/:card_number", (req, res) => {
  let data = [];
  let card_number = req.params.card_number;
  let order_number = req.params.order_number;
  let recipt_number = req.params.recipt_number;

  db.serialize(() => {
    db.each(
      "SELECT * FROM cards, items WHERE recipt_number == order_number AND card_number == ?",
      recipt_number | order_number | card_number,
      (err, row) => {
        console.log(row);
        data.push(row);
      },
      () => {
        res.status(200).send(data);
      }
    );
  });
});

//Returns data stored to a single DATE
app.get("/day/:date", (req, res) => {
  let data = [];

  let date = req.params.date;
  let recipt_number = req.params.recipt_number;
  let order_number = req.params.order_number;

  db.serialize(() => {
    db.each(
      "SELECT name, price, category, card_number, date, month_number, year_number FROM cards, items WHERE order_number IS NOT NULL AND recipt_number == order_number AND date == ?",
      recipt_number | order_number | date,
      (err, row) => {
        console.log(row);
        data.push(row);
      },
      () => {
        res.status(200).send(data);
      }
    );
  });
});

//Returns data stored to a MONTH/YEAR combination
app.get("/month/:month_number/:year_number", (req, res) => {
  let data = [];

  let month_number = req.params.month_number;
  let year_number = req.params.year_number;
  let order_number = req.params.order_number;
  let recipt_number = req.params.recipt_number;

  db.serialize(() => {
    db.each(
      "SELECT name, price, category, card_number, date, month_number, year_number FROM cards, items WHERE order_number IS NOT NULL AND recipt_number == order_number AND month_number | year_number == ?",
      order_number | recipt_number | month_number | year_number,
      (err, row) => {
        console.log(row);
        data.push(row);
      },
      () => {
        res.status(200).send(data);
      }
    );
  });
});

//Returns all data stored to a LOCATION ( on /City, State (!must include comma and space between, and capital letters))
app.get("/location/:store_location", (req, res) => {
  let data = [];

  let order_number = req.params.order_number;
  let recipt_number = req.params.recipt_number;
  let store_location = req.params.store_location;

  db.serialize(() => {
    db.each(
      "SELECT * FROM cards, items WHERE store_location == ? AND order_number IS NOT NULL AND recipt_number == order_number",
      store_location,
      order_number,
      recipt_number,
      (err, row) => {
        console.log(row.store_location);
        data.push(row);
      },
      () => {
        res.status(200).send(data);
      }
    );
  });
});

//Returns all data stored to a single STORE (on /Store (!must include capital letter))
app.get("/store/:store_name", (req, res) => {
  let data = [];

  let order_number = req.params.order_number;
  let recipt_number = req.params.recipt_number;
  let store_name = req.params.store_name;

  db.serialize(() => {
    db.each(
      "SELECT * FROM cards, items WHERE store_name == ? AND order_number IS NOT NULL AND recipt_number == order_number",
      store_name,
      order_number,
      recipt_number,
      (err, row) => {
        console.log(row.store_name);
        data.push(row);
      },
      () => {
        res.status(200).send(data);
      }
    );
  });
});

// POST STATEMENTS

//POSTING ITEM, usage: Postman
app.post("/item", (req, res) => {
  console.log(req.body);

  let name = req.body.name;
  let category = req.body.category;
  let price = req.body.price;
  let order_number = req.body.order_number;

  db.run(
    "INSERT INTO items (name, category, price, order_number) VALUES ('" +
      name +
      "',  '" +
      category + // ! Use following categories:
      // Beverages – coffee/tea, juice, soda
      // Bread/Bakery – sandwich loaves, dinner rolls, tortillas, bagels
      // Canned/Jarred Goods – vegetables, spaghetti sauce, ketchup
      // Dairy – cheeses, eggs, milk, yogurt, butter
      // Dry/Baking Goods – cereals, flour, sugar, pasta, mixes
      // Frozen Foods – waffles, vegetables, individual meals, ice cream
      // Meat – lunch meat, poultry, beef, pork
      // Produce – fruits, vegetables
      // Cleaners – all- purpose, laundry detergent, dishwashing liquid/detergent
      // Paper Goods – paper towels, toilet paper, aluminium foil, sandwich bags
      // Personal Care – shampoo, soap, hand soap, shaving cream
      // Confectionery – Sweets, Chocolates, Ice-cream, Cakes
      // Other – baby items, pet items, batteries, greeting cards
      "', '" +
      price +
      "', '" +
      order_number + //DO NOT not use an ordernumber thats already been used, use /items to check the last used ordernumber
      "');"
  );
  res.status(201).send("Saved");
});

//POSTING CARD, usage: Postman
app.post("/card", (req, res) => {
  console.log(req.body);

  let card_number = req.body.card_number;
  let store_name = req.body.store_name;
  let store_location = req.body.store_location;
  let date = req.body.date;
  let month_number = req.body.month_number;
  let year_number = req.body.year_number;
  let recipt_number = req.body.recipt_number;

  db.run(
    "INSERT INTO cards (card_number, store_name, store_location, date, month_number, year_number, recipt_number) VALUES ('" +
      card_number +
      "',  '" +
      store_name +
      "', '" +
      store_location +
      "', '" +
      date +
      "', '" +
      month_number +
      "', '" +
      year_number +
      "', '" +
      recipt_number + //!SAME number as order_number at items table.
      "');"
  );

  res.status(201).send("Saved");
});

// DELETE STATEMENT

//DELETING CHOSEN CARD on /:card_number
app.delete("/card/:card_number", (req, res) => {
  let data = [];
  let card_number = req.params.card_number;

  db.serialize(() => {
    db.each(
      "DELETE FROM cards WHERE card_number == ?",
      card_number,
      (err, row) => {
        console.log(`${row.card_number}, ${row.name}`);
        data.push(row);
      },
      () => {
        res.status(204).send("Deleted");
      }
    );
  });
});

app.use("/", router);
app.listen(port, () => console.log("Server is running on port:", port));
