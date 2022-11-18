# Mandatory Assignment - Web Technologies

## Description

Database for the stores to:

- Registrer/scan new items, and registrer it to a card.
- The system builds up a collection of items in memory, and records the last four digits of the customers card, the store name, the location of the store, and the date:

Database for the government to:

- Access data for a given store type
- Access data for a given area
- Access data for a single user/costumer
- Access ALL data for a given date OR month
- Erase all data for a given user

## Installation

Install dependancies:

```
npm install
```

Use start script:

```
npm start
```

## Usage

```node
Express app, storing sessions in memory with SQLITE3 database.

# Use Postman to GET:
Location: localhost:8081/location/:store_location
Store: localhost:8081/store/:store_name
Costumer/User: localhost:8081/card/:card_number
Data for given date: localhost:8081/day/:date
Data for given Month: localhost:8081/month/:month/:year
All stored cards: localhost:8081/cards
All stored items: localhost:8081/items

# Use Postman to POST:
New items: localhost:8081/item
Example:
 {
    "name": "Vanilla Icecream",
    "category": "Dairy",
    "price": "19,00",
    "order_number": 1101 //!important to not use a ordernumber thats already been used, use /items to check the last used ordernumber
}

! Use following categories when posting new item:
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

New costumer/user: localhost:8081/card
Example:
{
    "card_number": 1897,
    "store_name": "Kiwi",
    "store_location": "Stathelle, Bamble",
    "date": 5,
    "month_number": 11,
    "year_number": 22
    "recipt_number": 1101 //!SAME number as order_number items table.
}

# Use Postman to DELETE:
Deleting user/costumer:localhost:8081/card/:card_number
```

## Dependencies

    "body-parser": "^1.20.1"
     - body-parser extracts the entire body portion of an incoming request stream and exposes it on req. body

    "cookie-parser": "^1.4.6"
     - cookie-parser is a middleware which parses cookies attached to the client request object.

    "express": "^4.18.2"
     - express is a node js web application framework to build web and mobile applications. It's a layer built on the top of the Node js that helps manage servers and routes.

    "express-router": "^0.0.1"
     - creates a router as a module, loads a middleware function in it, defines some routes, and mounts the router module on a path in the main app.

    "express-session": "^1.17.3"
     - express-session is an HTTP server-side framework used to create and manage a session middleware.

    "morgan": "^1.10.0"
     - Morgan is an HTTP request level Middleware for Node.js, great to use for debugging because it logs the requests.

    "path": "^0.12.7"
     - NodeJS path module is a core built-in module. It provides functionalities for accessing and interacting with files.

    "sqlite": "^4.1.2"
     - SQLite consist of a single file and a library to make your application interact with it. Used to to manage data and data definition in RDBMS.
     Example: "SELECT * FROM users WHERE name = 'Julie';"

    "sqlite3": "^5.1.2"
     - is just the version 3 of SQLite which provides - more compact format for database files. Supports both UTF-8 and UTF-16 text.

## Author

Julie Nielsen (@julienielsen98)

## License

[MIT](https://choosealicense.com/licenses/mit/)
