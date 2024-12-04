import * as schema from "@/db/schema";
import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";

export const db = drizzle(sql, { schema });

export const getUsers = async () => {
  return db.query.users.findMany();
};
