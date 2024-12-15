import { z } from "zod";

export const LOCAL_STORAGE_KEY = "solitude";
const schema = z.array(z.number()).optional().default([]);

export function log(...things: unknown[]) {
  console.log(`[solitude] ${things.join(" ")}`);
}

export function parseStorageContents(storageContents: string | null) {
  if (storageContents === null) {
    return [];
  }

  try {
    return schema.parse(JSON.parse(storageContents));
  } catch (error) {
    return [];
  }
}

type Change = { type: "joined" | "left"; instanceId: number } | { type: "unsupported" };

export function getChange(before: number[], after: number[]): Change {
  if (before.length < after.length) {
    const instanceId = after.find((id) => !before.includes(id))!;
    return { type: "joined", instanceId };
  }

  if (before.length > after.length) {
    const instanceId = before.find((id) => !after.includes(id))!;
    return { type: "left", instanceId };
  }

  return { type: "unsupported" };
}
