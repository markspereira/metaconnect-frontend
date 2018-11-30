/* global Ipfs PubSubRoom */

// -- Constants ------------------------------------------------------------- //
const P2PROOM_INIT_REQUEST = "p2pRoom/P2PROOM_INIT_REQUEST";
const P2PROOM_INIT_SUCCESS = "p2pRoom/P2PROOM_INIT_SUCCESS";
const P2PROOM_INIT_FAILURE = "p2pRoom/P2PROOM_INIT_FAILURE";
const P2PROOM_MESSAGE = "p2pRoom/P2PROOM_MESSAGE";


const P2PROOM_OPEN_ROOM = "p2pRoom/P2PROOM_OPEN_ROOM";

const P2PROOM_UPDATE_LOGS = "p2pRoom/P2PROOM_UPDATE_LOGS";

const P2PROOM_DISCONNECTED = "p2pRoom/P2PROOM_DISCONNECTED";

// -- Actions --------------------------------------------------------------- //


export const p2pRoomSendMessage = (peer, message) => (dispatch, getState) => {
  if (message && typeof message === "object") {
    try {
      message = JSON.stringify(message);
    } catch (error) {
      throw new Error("Message invalid format");
    }
  }
  dispatch({type: P2PROOM_MESSAGE, payload: peer, message});
};

// -- Reducer --------------------------------------------------------------- //
const INITIAL_STATE = {
  roomName:
    process.env.NODE_ENV === "development"
      ? "metaconnect-test"
      : "metaconnect-prod",
  devMonitor: process.env.NODE_ENV === "bob",
  ipfs: null,
  room: null,
  loading: false,
  connected: false,
  userId: "",
  logs: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case P2PROOM_INIT_REQUEST:
      return {
        ...state,
        loading: true
      };

    case P2PROOM_INIT_SUCCESS:
      return {
        ...state,
        loading: false,
        connected: true,
        ipfs: action.payload.ipfs,
        userId: action.payload.userId
      };
    case P2PROOM_INIT_FAILURE:
      return {
        ...state,
        loading: false,
        userId: ""
      };
    case P2PROOM_OPEN_ROOM:
      return {
        ...state,
        room: action.payload
      };
    case P2PROOM_UPDATE_LOGS:
      return {
        ...state,
        logs: action.payload
      };
    case P2PROOM_MESSAGE:
      return {
        ...state,
        message: action.payload
      };
    case P2PROOM_DISCONNECTED:
      return {
        ...state,
        loading: false,
        connected: false,
        userId: "",
        activePeers: []
      };
    default:
      return state;
  }
};
