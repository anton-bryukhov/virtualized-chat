const http = require("http");
const querystring = require("querystring");

const hostname = "localhost";
const port = process.env.PORT || 3000;

const messageTextList = [
  "Hi, how are you?",
  "What's up?",
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ",
];

const server = http.createServer((req, res) => {
  const [, query] = req.url.split("?");
  const { cursor } = querystring.parse(query);
  let cursorNum = Number(cursor ?? "0");
  let messages = [];

  for (let i = 0; i < 100; ++i) {
    let curCursor = cursorNum++;
    messages.push({
      id: String(curCursor),
      username: i % 2 === 0 ? "John" : "You",
      text: `${messageTextList[i % 3]} (${curCursor})`,
      timestamp: new Date(),
      userPicUrl: "http://placekitten.com/100/100",
    });
  }

  setTimeout(() => {
    res.statusCode = 200;
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ messages, nextCursor: String(cursorNum) }));
  }, Math.random() * 500);
});

server.listen(port, hostname, () => {
  console.log(`Mock server running at http://${hostname}:${port}/`);
});
