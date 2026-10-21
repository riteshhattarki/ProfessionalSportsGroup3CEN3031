const WebSocket = require("ws");

// keeps track of who is watching which league's draft
const rooms = {};

function start(server) {
  const wss = new WebSocket.Server({ server: server, path: "/draft" });

  wss.on("connection", function (socket, req) {
    const url = new URL(req.url, "http://localhost");
    const leagueId = url.searchParams.get("leagueId");

    if (!leagueId) {
      socket.close();
      return;
    }

    if (!rooms[leagueId]) {
      rooms[leagueId] = [];
    }
    rooms[leagueId].push(socket);

    socket.on("close", function () {
      rooms[leagueId] = rooms[leagueId].filter(function (s) {
        return s !== socket;
      });
    });
  });
}

// sends the latest draft to everyone watching that league
function sendToLeague(leagueId, data) {
  const list = rooms[String(leagueId)] || [];
  list.forEach(function (socket) {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(data));
    }
  });
}

module.exports = { start, sendToLeague };
