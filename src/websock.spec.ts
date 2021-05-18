/**
 * @jest-environment jsdom
 **/

/**
 * As the websocket mock functions are async, we have to use timeouts for our expectations
 * Not ideal, but be aware and adjust timeouts if CI becomes slower and things start to fail.
 * An alternative would be a homegrown websocket mock that is not async, maybe worth building
 * if timing becomes an issue here.
 **/

import WS from "jest-websocket-mock";
import Websock from "./websock";

let server: WS;
let websock: Websock;
let received_messages: String[];

beforeAll(() => {
  server = new WS("ws://localhost:1234/sock");
});

beforeEach(() => {
  websock = new Websock(
    { url: "ws://localhost",
      port: "1234"
    }
  );
  received_messages = [];
});

afterEach(() => {
  WS.clean();
});

test("it subscribes to a channel with a key", async () => {
  websock.subscribe(
    "test-channel",
    (message: any) => {
      received_messages.push(message.testKey)
    },
    "testKey"
  )
  await server.connected;
  server.send(JSON.stringify({
      channel: "test-channel",
      message: "subscribe successful",
      status: "SUCCESS",
      type: "SYSTEM"
    }))

  server.send(JSON.stringify({message: {"testKey": "brillig"}, channel: "test-channel", type: "USER"}))
  setTimeout(() => {
    expect(received_messages).toContain("brillig")
  }, 10);
});

test("it subscribes to a channel with a key and ignores other keys", async () => {
  websock.subscribe(
    "test-channel",
    (message: any) => {
      received_messages.push("Shouldn't get here with otherKey")
    },
    "testKey"
  )
  await server.connected;
  server.send(JSON.stringify({
      channel: "test-channel",
      message: "subscribe successful",
      status: "SUCCESS",
      type: "SYSTEM"
    }))

  server.send(JSON.stringify({message: {"otherKey": "slithy toves"}, channel: "test-channel", type: "USER"}))
  setTimeout(() => {
    expect(received_messages).toBe([])
  }, 10);
});

test("it subscribes to a channel without a key", async () => {
  websock.subscribe(
    "test-channel",
    (message: any) => {
      received_messages.push(message.testKey)
    }
  )
  await server.connected;
  server.send(JSON.stringify({
      channel: "test-channel",
      message: "subscribe successful",
      status: "SUCCESS",
      type: "SYSTEM"
    }))

  server.send(JSON.stringify({message: {"anyKey": "mome raths"}, channel: "test-channel", type: "USER"}))
  setTimeout(() => {
    expect(received_messages).toContain("mome raths")
  }, 10);
});

test("it handles a closed connection", async () => {
  websock.subscribe(
    "test-channel",
    (message: any) => {
      received_messages.push(message.testKey)
    }
  )
  await server.connected;
  expect(websock.browserActivity.stopped).toBe(false)
  server.close

  // Turns off browserActivity when the connection is closed
  setTimeout(() => {
    expect(websock.browserActivity.stopped).toBe(true)
  }, 25);

  // Will reconnect after 50ms and restart browserActivity
  await server.connected
  expect(websock.browserActivity.stopped).toBe(false)

  // Resubscribes channels so they can receive messages
  server.send(JSON.stringify({message: {"anyKey": "borogoves"}, channel: "test-channel", type: "USER"}))
  setTimeout(() => {
    expect(received_messages).toContain("borogoves")
  }, 10);
})

test("it handles user inactivity", async () => {
  let testWebsock = new Websock(
    { url: "ws://localhost",
      port: "1234",
      browseractivityTimeout: 25
    }
  );

  testWebsock.subscribe(
    "test-channel",
    (message: any) => {
      received_messages.push(message.testKey)
    }
  )

  await server.connected;
  setTimeout(() => {
    expect(testWebsock.socket.readyState).toBe(WebSocket.CLOSED)
    expect(testWebsock.closeWasClean).toBe(true)
  }, 30)

  var event = new KeyboardEvent('keydown', {'keyCode': 37});
  document.dispatchEvent(event);
  await server.connected
  expect(testWebsock.socket.readyState).toBe(WebSocket.OPEN)
})
