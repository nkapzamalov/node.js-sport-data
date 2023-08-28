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
      sentence: event.sentence,
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
