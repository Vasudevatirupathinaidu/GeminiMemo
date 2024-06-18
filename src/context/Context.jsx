import { createContext, useEffect, useState } from "react";
import run from "../config/gemini";

// Create a context for the application
export const Context = createContext();

const ContextProvider = (props) => {
  // State variables
  const [input, setInput] = useState("");
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [resultData, setResultData] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if memo cards are available in localStorage on component mount
  useEffect(() => {
    let memoCardsLength = JSON.parse(localStorage.getItem("memoCards"))?.length;
    memoCardsLength ? setShowResult(true) : setShowResult(false);
  }, []);

  // Function to handle the sent input
  const onSent = async () => {
    setResultData("");
    setIsLoading(true);
    setShowResult(true);
    setCurrentPrompt(input);
    setInput("");

    // Get the response from the GEMINI API
    const response = await run(input);

    if (response === null) {
      setResultData(null);
      setIsLoading(false);
      return;
    }

    // Process the response to add formatting
    const responseArr = response.split("**");

    let newResponse = "";
    responseArr.forEach((word, i) => {
      if (i === 0 || i % 2 !== 1) {
        newResponse += word;
      } else {
        newResponse += "<b>" + word + "</b>";
      }
    });

    let newResponse2 = newResponse.split("*").join("</br>");
    newResponse2 = newResponse2.replaceAll("##", "");

    // Check if memo cards are available in localStorage
    let areMemoCardsAvailable = JSON.parse(localStorage.getItem("memoCards"))
      ?.length
      ? true
      : false;

    setShowResult(areMemoCardsAvailable);
    setResultData(newResponse2);
    setIsLoading(false);
  };

  // Context value to be provided to the children components
  const contextValue = {
    onSent,
    currentPrompt,
    setCurrentPrompt,
    isLoading,
    setIsLoading,
    resultData,
    showResult,
    setShowResult,
    setResultData,
    input,
    setInput,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
