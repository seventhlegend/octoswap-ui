"use client";

import { createContext, useContext, useReducer, ReactNode } from "react";

type Theme = "light" | "dark";

interface GlobalState {
  theme: Theme;
  notifications: Array<{
    id: string;
    message: string;
    type: "success" | "error" | "info";
  }>;
}

type Action =
  | { type: "SET_THEME"; payload: Theme }
  | {
      type: "ADD_NOTIFICATION";
      payload: Omit<GlobalState["notifications"][0], "id">;
    }
  | { type: "REMOVE_NOTIFICATION"; payload: string };

const initialState: GlobalState = {
  theme: "light",
  notifications: [],
};

const GlobalContext = createContext<{
  state: GlobalState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

function globalReducer(state: GlobalState, action: Action): GlobalState {
  switch (action.type) {
    case "SET_THEME":
      return { ...state, theme: action.payload };
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [
          ...state.notifications,
          { ...action.payload, id: Date.now().toString() },
        ],
      };
    case "REMOVE_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter(
          (n) => n.id !== action.payload
        ),
      };
    default:
      return state;
  }
}

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(globalReducer, initialState);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalState() {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalProvider");
  }
  return context;
}
