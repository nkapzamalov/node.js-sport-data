import { createClient } from "redis";

const client = createClient();

await client.connect();

export const sentInCache = async (key, data) => {
  await client.setEx(key, 3600, JSON.stringify(data));
};

export const getFromCache = async (key) => {
  const cashedEvents = await client.get(key);
  if (cashedEvents) {
    return JSON.parse(cashedEvents);
  }
};
