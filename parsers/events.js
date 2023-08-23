export const eventsParser = (data) => {
  const events = JSON.parse(data)?.data.listEvents;

  const resultTypeMap = {
    1: "currentResult",
    2: "fullTimeResult",
    3: "firstHalfTimeResult",
    4: "afterExtraTime",
    5: "afterPenalties",
    6: "secondHalfTimeResult",
    7: "extraTime",
    8: "penalties",
  };

  const stageTypemap = {
    1: "Scheduled",
    2: "Live",
    3: "Finished",
    4: "Postponed",
    5: "Canceled",
    6: "Extra Time",
    7: "Penalties",
    8: "Retired",
    9: "Walkover",
    10: "After Extra Time",
    11: "After Penalties",
    12: "1st Half",
    13: "2nd Half",
  };

  const scoreMapping = (scores) => {
    return scores
      ?.map((score) => {
        const resultType = resultTypeMap[score.resultTypeId];
        return resultType ? { [resultType]: score.value } : null;
      })
      .filter(Boolean);
  };

  const mapedEvents = events?.map((event) => {
    return {
      id: event.id,
      sentance: event.sentance,
      home: {
        participantName: event.home?.participant[0]?.name,
        scoreHome: scoreMapping(event.home.scoreAll),
      },
      away: {
        participantName: event.away?.participant[0]?.name,
        scoreAway: scoreMapping(event.away.scoreAll),
      },
    };
  });

  return mapedEvents;
};
