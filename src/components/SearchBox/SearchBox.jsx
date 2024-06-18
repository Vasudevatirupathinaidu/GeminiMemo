import { useContext, useEffect, useState } from "react";
import { Context } from "../../context/Context";
import styles from "./SearchBox.module.css";
import colorThemes from "../../assets/colorThemes";

// Functional component to render a search box
export default function SearchBox({ setMemoCards, setSelectedMemoCard }) {
  const { onSent, isLoading, resultData, setInput, input, setCurrentPrompt } =
    useContext(Context);

  const [lastMemoCardId, setLastMemoCardId] = useState(null);

  // Handles input change and updates context state
  const handleOnChangeInput = (e) => {
    setInput(e.target.value);
  };

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input?.trim()) return;

    setCurrentPrompt(input);
    const newCardId = handleNewMemoCard();
    setLastMemoCardId(newCardId);
    await onSent();
  };

  // Creates a new memo card with random position and color theme
  const handleNewMemoCard = () => {
    const centralWidth = window.innerWidth / 2;
    const centralHeight = window.innerHeight / 2;

    const startX = window.innerWidth / 4;
    const startY = window.innerHeight / 4;

    const x = Math.random() * centralWidth + startX;
    const y = Math.random() * centralHeight + startY;

    const randomSelectedColorId = Math.floor(
      Math.random() * (colorThemes.length - 1)
    );

    const newMemoCard = {
      id: crypto.randomUUID(),
      question: input,
      answer: resultData ? "" : "No response received. Please try again.",
      colorTheme: {
        name: colorThemes[randomSelectedColorId].name,
        background: colorThemes[randomSelectedColorId].background,
        color: colorThemes[randomSelectedColorId].color,
        border: colorThemes[randomSelectedColorId].border,
      },
      pos: { x, y },
    };

    setMemoCards((prevCards) => {
      const updatedCards = [...prevCards, newMemoCard];
      localStorage.setItem("memoCards", JSON.stringify(updatedCards));
      setSelectedMemoCard(newMemoCard.id);
      return updatedCards;
    });

    return newMemoCard.id;
  };

  // Updates memo card with the response data once available
  useEffect(() => {
    if (lastMemoCardId && resultData) {
      setMemoCards((prevCards) => {
        const updatedCards = prevCards.map((card) =>
          card.id === lastMemoCardId ? { ...card, answer: resultData } : card
        );
        localStorage.setItem("memoCards", JSON.stringify(updatedCards));
        return updatedCards;
      });
    }
  }, [resultData, lastMemoCardId, setMemoCards]);

  // Loads memo cards from local storage on component mount
  useEffect(() => {
    const storedCards = localStorage.getItem("memoCards");
    if (storedCards) {
      setMemoCards(JSON.parse(storedCards));
    }
  }, [setMemoCards]);

  return (
    <article className={styles["search-box"]}>
      <form className={styles["search-form"]} onSubmit={handleSubmit}>
        <input
          type="text"
          name="search-prompt"
          id="search-prompt"
          placeholder="Enter a prompt here"
          autoComplete="off"
          value={input}
          onChange={handleOnChangeInput}
          disabled={isLoading ? true : false}
        />
        <button disabled={isLoading ? true : false}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </form>
    </article>
  );
}
