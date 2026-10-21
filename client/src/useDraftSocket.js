import { useEffect, useState } from "react";
import { API_URL } from "./AuthContext";

// gives back the latest draft and updates by itself when anyone makes a pick
function useDraftSocket(leagueId, token) {
  const [draft, setDraft] = useState(null);

  useEffect(
    function () {
      // get the draft as it is right now
      fetch(API_URL + "/api/draft/" + leagueId, {
        headers: { Authorization: "Bearer " + token },
      })
        .then(function (response) {
          return response.ok ? response.json() : null;
        })
        .then(function (data) {
          if (data) {
            setDraft(data);
          }
        });

      // then listen for new picks
      const socket = new WebSocket("ws://localhost:5000/draft?leagueId=" + leagueId);
      socket.onmessage = function (event) {
        setDraft(JSON.parse(event.data));
      };

      return function () {
        socket.close();
      };
    },
    [leagueId, token]
  );

  return draft;
}

export default useDraftSocket;
