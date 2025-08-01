import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { getDb } from "../database/sqliteConnection";

export const loadCsv = async (): Promise<void> => {
  const db = await getDb(); // db aqui já é da lib sqlite com Promise

  const filePath = path.join(__dirname, "../../../Movielist.csv");

  return new Promise<void>((resolve, reject) => {
    const rows: any[] = [];

    fs.createReadStream(filePath)
      .pipe(csv({ separator: ";" }))
      .on("data", (row) => {
        rows.push([
          parseInt(row.year),
          row.title,
          row.studios,
          row.producers,
          row.winner === "yes" ? 1 : 0,
        ]);
      })
      .on("end", async () => {
        try {
          for (const params of rows) {
            await db.run(
              "INSERT INTO awards (year, title, studios, producers, winner) VALUES (?, ?, ?, ?, ?)",
              params
            );
          }
          resolve();
        } catch (err) {
          reject(err);
        }
      })
      .on("error", (err) => reject(err));
  });
};
