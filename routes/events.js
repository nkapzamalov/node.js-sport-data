import fs from "fs/promises";
import redis from "redis";
import { Router } from "express";
import { getFromCashe, sentInCashe } from "../utils/cashe.js";
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

const getCasheEvents = async (req, res, next) => {
  const cashedEvents = await getFromCashe("events");
  cashedEvents ? res.send(cashedEvents) : next();
};

const getCasheEvent = async (req, res, next) => {
  const cashedEvent = await client.get("event" + req.params.id);
  cashedEvent ? res.send(cashedEvent) : next();
};

router.get("/", getCasheEvents, async (req, res) => {
  const events = await getEvents();
  await sentInCashe("events", events);
  res.send(events);
});

// router.get("/:id", getCasheEvent, async (req, res) => {
//   const eventId = req.params.id;
//   const events = await getEvents();
//   const parsedEvents = parseEvents(events);

//   const event = parsedEvents.find((event) => event.id === Number(eventId));

//   if (!event) {
//     res.status(404).json({ error: "Event not found" });
//     return;
//   }
//   await client.setEx("event:" + eventId, 3600, JSON.stringify(event));
//   res.send(event);
// });

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

export default router;
