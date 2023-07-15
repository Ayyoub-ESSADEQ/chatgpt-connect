const {WebSocket} = require('ws');

function runServer() {
  //1956 : Morocco got its independence
  const bridge = new WebSocket.Server({ port: 1956 });
  const members = {};

  bridge.on('connection', (client) => {
    console.debug(Object.keys(members));

    client.on('message', (message) => {
      const messageAsText = message.toString();
      const data = JSON.parse(messageAsText);

      // Here we retrieve the identifier of the client
      const clientID = data.clientID;

      // Those are the data related to the question
      const source = data.source;
      const destination = data.destination;
      const conversation  = data.conversation;

      // Those are the data related to the answer
      const conversationData = data.conversationData;
      const error = data.error;
      const done = data.done;

      // The form of the answer
      const answer = {
        conversationData: conversationData,
        error: error,
        done: done,
      };

      // When the client connects to the server, we add it to the members object in order
      // to direct the messages that correspond to it.

      if (clientID) {
        members[clientID] = client;
      } else {
        const target = members[destination];
        if (target.readyState === WebSocket.OPEN) {
          const messageBody = {
            source: source,
            conversation : conversation,
            answer: answer,
          };

          target.send(JSON.stringify(messageBody));
        }
      }
    });
  });
}

runServer();