import socket from "socket.io-client";

let socketInstance = null;

export const initialiseSocket = (projectId) => {
  socketInstance = socket.connect("http://localhost:3000", {
    auth: {
      token: localStorage.getItem("token"),
    },
    query: {
      projectId,
    },
  });

  return socketInstance;
};

export const recieveMessage = (eventName, cb) => {
  socketInstance.on(eventName, cb);
};
export const sendMessage = (eventName, cb) => {
  socketInstance.emit(eventName, cb);
};
