import pg from "pg";

export  const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "Social media",
    password: "DevDBMS@78",
    port: 5432,
  });

  db.connect();