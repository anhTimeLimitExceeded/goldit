import { createContext, useState } from "react";

export const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [topics, setTopics] = useState(null);
  const [trendingTopics, setTrendingTopics] = useState(null);
  const value = { user, setUser, topics, setTopics, trendingTopics, setTrendingTopics };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
