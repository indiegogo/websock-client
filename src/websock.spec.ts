/**
 * @jest-environment jsdom
 */

/**
 ** TODO: fix all this timing nonsense. I think the entire approach here is wrong.
 ** Might benefit from a custom websocket server mock that handles things synchronously.
 **/

import WS from "jest-websocket-mock";
import Websock from "./websock";

let server: WS;
let websock: Websock;
let received_messages: any[];

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

  server.send(JSON.stringify({message: {"testKey": "brillig"}, channel: "test-channel", type: "USER"}))
  await new Promise<void>(res => setTimeout(() => {
    expect(received_messages).toContain("brillig")
    res()
  }, 10));
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

  server.send(JSON.stringify({message: {"otherKey": "slithy toves"}, channel: "test-channel", type: "USER"}))
  await new Promise<void>(res => setTimeout(() => {
    expect(received_messages.length).toBe(0)
    res()
  }, 100));
});

test.skip("it subscribes to a channel without a key", async () => {
  websock.subscribe(
    "test-channel",
    (message: any) => {
      received_messages.push(message)
    }
  )
  await server.connected;

  server.send(JSON.stringify({message: {"anyKey": "mome raths"}, channel: "test-channel", type: "USER"}))
  await new Promise<void>(res => setTimeout(() => {
    expect(received_messages[0].anyKey).toBe("mome raths")
    res()
  }, 10));
});

test.skip("it handles a closed connection", async () => {
  websock.subscribe(
    "test-channel",
    (message: any) => {
      received_messages.push(message.testKey)
    }
  )
  await server.connected;
  expect(websock.browserActivity.stopped).toBe(false)
  server.close
  await server.closed
  // Turns off browserActivity when the connection is closed
  expect(websock.browserActivity.stopped).toBe(true)

  // Will reconnect after 50ms and restart browserActivity
  await server.connected
  expect(websock.browserActivity.stopped).toBe(false)

  // Resubscribes channels so they can receive messages
  // TODO can't make this work, works in the browser so some test magic is missing
  server.send(JSON.stringify({message: {"testKey": "borogoves"}, channel: "test-channel", type: "USER"}))
  await new Promise<void>(res => setTimeout(() => {
    expect(received_messages).toContain("borogoves")
    res()
  }, 10));
})

test.skip("it handles user inactivity", async () => {
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
  await new Promise<void>(res => setTimeout(() => {
    expect(testWebsock.socket.readyState).toBe(WebSocket.OPEN)
    res()
  }, 10));
})
