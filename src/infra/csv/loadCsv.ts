import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { getDb } from "../database/sqliteConnection";

export const loadCsv = async () => {
  return new Promise<void>((resolve, reject) => {
    const db = getDb();
    const stmt = db.prepare(
      "INSERT INTO awards (year, title, studios, producers, winner) VALUES (?, ?, ?, ?, ?)"
    );
    const filePath = path.join(__dirname, "../../../Movielist.csv");

    fs.createReadStream(filePath)
      .pipe(csv({separator: ";"}))
      .on("data", (row) => {
        stmt.run([
          parseInt(row.year),
          row.title,
          row.studios,
          row.producers,
          row.winner === 'yes' ? 1 : 0
        ]);
      })
      .on("end", () => resolve())
      .on("error", (err) => reject(err));
  });
};
