const IO = require('socket.io-client');

let socketUrl =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? 'http://localhost:4000'
    : "https://relayer.tenzorum.app";

export const socket = IO(socketUrl);