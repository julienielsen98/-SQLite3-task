const sqlite3 = require("sqlite3");

const morgan = require("morgan");

const express = require("express");
const bodyParser = require("body-parser");
const port = process.env.PORT || 8080;
const app = express();

const db = new sqlite3.Database(__dirname + "/database.sqlite");

app.use(morgan("dev"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello");
});

const CREATE_PETS =
  "CREATE TABLE if not exists pets (pet_ID INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, age INTERGER, owner_name TEXT, species TEXT);";
const DROP_PETS = "DROP TABLE if exists pets;";

app.get("/create", (req, res) => {
  db.run(CREATE_PETS);
  res.send("Table created");
});

app.get("/drop", (req, res) => {
  db.run(DROP_PETS);
  res.send("Table dropped");
});

app.get("/reset", (req, res) => {
  db.run(DROP_PETS, () => {
    console.log("Table dropped ...");
    db.run(CREATE_PETS, () => {
      console.log("...  and re-created");

      db.run(
        "INSERT INTO pets (name, age, owner_name, species) VALUES ('Bo',  '2',  'Julie',  'Dog');"
      );
      db.run(
        "INSERT INTO pets (name, age, owner_name, species) VALUES ('Nicci',  '3',  'Hilde',  'Cat');"
      );
    });
  });

  res.send("Table reset (dropped and re-created)");
});

app.get("/show", (req, res) => {
  let data = [];
  db.serialize(() => {
    db.each(
      "SELECT * FROM pets;",
      (err, row) => {
        console.log(row.name);
        data.push(row);
      },
      () => {
        res.send(data);
      }
    );
  });
});

app.post("/pet", (req, res) => {
  console.log(req.body);

  let name = req.body.name;
  let age = req.body.age;
  let owner_name = req.body.owner_name;
  let species = req.body.species;

  db.run(
    "INSERT INTO pets (name, age, owner_name, species) VALUES ('" +
      name +
      "',  '" +
      age +
      "', '" +
      owner_name +
      "', '" +
      species +
      "');"
  );
  res.send("Saved");
});

app.put("/pet", (req, res) => {
  let data = [];
  db.serialize(() => {
    db.each(
      "SELECT * FROM pets;",
      (err, row) => {
        console.log(row.name);
        data.push(row);
      },
      () => {
        res.send(data);
      }
    );
  });
});

app.get("/pet/:id", (req, res) => {
  let data = [];
  let pet_id = req.params.id;

  db.serialize(() => {
    db.each(
      "SELECT * FROM pets WHERE pet_ID == ?",
      pet_id,
      (err, row) => {
        console.log(row.name);
        data.push(row);
      },
      () => {
        res.send(data);
      }
    );
  });
});
app.delete("/pet/:id", (req, res) => {
  let data = [];
  let pet_id = req.params.id;

  db.serialize(() => {
    db.each(
      "DELETE FROM pets WHERE pet_ID == ?",
      pet_id,
      (err, row) => {
        console.log(row.name);
        data.push(row);
      },
      () => {
        res.send(data);
      }
    );
  });
});

app.listen(port, () => console.log("Server is running on port:", port));
