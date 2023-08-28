import fs from "fs/promises";
import redis from "redis";
import { Router } from "express";
import { getFromCache, sentInCache } from "../utils/cache.js";
import { eventsParser } from "../parsers/events.js";

const client = redis.createClient();

client.connect();

const router = Router();

const getEvents = async () => {
  try {
    const events = await fs.readFile("./data/listEvents.json");
    const parsedEvents = eventsParser(events);
    return parsedEvents;
  } catch (error) {
    console.log(error);
  }
};

const getCacheEvents = async (req, res, next) => {
  const cachedEvents = await getFromCache("events");
  if (req.params.id) {
    const cachedEvent = cachedEvents?.find(
      (event) => event.id === Number(req.params.id)
    );
    cachedEvent ? res.send(cachedEvent) : next();
  } else {
    cachedEvents ? res.send(cachedEvents) : next();
  }
};

router.get("/", getCacheEvents, async (req, res) => {
  const events = await getEvents();
  await sentInCache("events", events);
  res.send(events);
});

router.get("/:id", getCacheEvents, async (req, res) => {
  const eventId = req.params.id;
  const events = await getEvents();
  const event = events.find((event) => event.id === Number(eventId));
  await sentInCache("events", events);

  if (!event) {
    res.status(404).json({ error: "Event not found" });
    return;
  }
  res.send(event);
});

export default router;

// router.get("/stage/:stage", async (req, res) => {
//   const targetStage = req.params.stage;

//   const events = await getEvents();
//   const parsedEvents = parseEvents(events);
//   const eventsByStage = parsedEvents.filter(
//     (event) => event.stage.name === targetStage
//   );
//   if (eventsByStage.length === 0) {
//     res.status(404).json({ error: "No events found for the specified stage" });
//     return;
//   }

//   res.send(eventsByStage);
// });
