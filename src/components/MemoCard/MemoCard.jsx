import { useContext, useRef, useState } from "react";
import styles from "./MemoCard.module.css";
import { Context } from "../../context/Context";

// Functional component to render a memo card
export default function MemoCard({
  memoCards,
  setMemoCards,
  id,
  isDraggable,
  memoCard,
  handleMousedown,
  setSelectedMemoCard,
  selectedMemoCard,
}) {
  const { currentPrompt, isLoading, resultData, setShowResult } =
    useContext(Context);

  const memoCardRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const isSelected = selectedMemoCard === id;

  // Format the result data for display in the memo card
  const formattedResultData = memoCard.question
    ? `<b>Q: ${memoCard.question}</b> <b>A:</b> ${memoCard.answer}`
    : `<b>Q: ${currentPrompt}</b> <b>A:</b> ${resultData}`;

  // Handle selecting the memo card
  const handleMemoCard = () => {
    setSelectedMemoCard(id);
  };

  // Handle clicking on the card (toggle open/close)
  const handleCardClick = (e) => {
    if (
      !e.target.closest(`.${styles["drag-icon"]}`) &&
      !e.target.closest(`.${styles["drop-down-details"]}`) &&
      !e.target.closest(`.${styles["trash-icon"]}`)
    ) {
      if (memoCardRef.current?.classList.contains(styles["memo-card"])) {
        setIsOpen(!isOpen);
      }
    }
  };

  // Handle deleting the memo card
  const handleTrashIcon = (e) => {
    e.stopPropagation();

    const filteredMemoCards = memoCards.filter(
      (memoCard) => memoCard.id !== id
    );

    setMemoCards(filteredMemoCards);
    localStorage.setItem("memoCards", JSON.stringify(filteredMemoCards));

    if (JSON.parse(localStorage.getItem("memoCards"))?.length === 0) {
      setShowResult(false);
    }
  };

  return (
    <article
      ref={memoCardRef}
      className={`${styles["memo-card"]} ${
        isSelected ? styles["selected"] : ""
      }`}
      style={{
        backgroundColor: memoCard.colorTheme.background,
        color: memoCard.colorTheme.color,
        top: `${memoCard.pos.y}px`,
        left: `${memoCard.pos.x}px`,
        zIndex: isSelected ? 1000 : 1,
      }}
      onClick={(e) => {
        e.stopPropagation();
        handleMemoCard();
        handleCardClick(e);
      }}
    >
      {isLoading && selectedMemoCard === memoCard.id ? (
        <div className="dots-spinner">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      ) : (
        <>
          <div
            className={`${styles["drag-icon"]} ${
              isDraggable ? styles["grabbing"] : ""
            }`}
            onMouseDown={(e) => handleMousedown(e, id)}
            onDoubleClick={(e) => handleMousedown(e, id)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                fill="currentColor"
                d="M2.518 0c-1.104 0-2 .897-2 2 0 1.101.896 2 2 2S4.52 3.101 4.52 2c0-1.103-.897-2-2-2M10 0C8.896 0 7.999.897 7.999 2c0 1.101.897 2 2 2 1.105 0 2.002-.899 2.002-2C12 .896 11.104 0 10 0M17.48 0c-1.104 0-2 .897-2 2 0 1.101.896 2 2 2s2.001-.899 2.001-2c0-1.103-.897-2-2-2M2.518 8c-1.104 0-2 .897-2 2 0 1.101.896 2 2 2s2.001-.899 2.001-2c0-1.103-.897-2-2-2M10 8c-1.104 0-2.001.897-2.001 2 0 1.101.897 2 2 2 1.105 0 2.002-.899 2.002-2 0-1.103-.897-2-2.001-2M17.48 8c-1.104 0-2 .897-2 2 0 1.101.896 2 2 2s2.001-.899 2.001-2c0-1.103-.897-2-2-2M2.518 16c-1.104 0-2 .897-2 2 0 1.102.896 2 2 2s2.001-.898 2.001-2c0-1.103-.897-2-2-2M10 16c-1.104 0-2.001.897-2.001 2 0 1.102.897 2 2 2 1.105 0 2.002-.898 2.002-2 0-1.103-.897-2-2.001-2M17.48 16c-1.104 0-2 .897-2 2 0 1.102.896 2 2 2s2.001-.898 2.001-2c0-1.103-.897-2-2-2"
              ></path>
            </svg>
          </div>

          <div className={styles["trash-icon"]}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              onClick={handleTrashIcon}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </div>

          <p className={styles["drop-down-title"]}>
            {memoCard.question.slice(0, 15) + "..." ||
              currentPrompt.slice(0, 15) + "..."}
          </p>

          <p className={styles["drop-down-icon"]}>
            {isOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 16 16"
              >
                <path
                  stroke="#222222"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M3.75 10.25 8 5.75l4.25 4.5"
                ></path>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 16 16"
              >
                <path
                  stroke="#222222"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M12.25 5.75 8 10.25l-4.25-4.5"
                ></path>
              </svg>
            )}
          </p>

          {isOpen && (
            <p
              className={styles["drop-down-details"]}
              style={{
                zIndex: isSelected ? 1000 : 1,
                backgroundColor: memoCard.colorTheme.background,
              }}
              dangerouslySetInnerHTML={{
                __html: formattedResultData,
              }}
            ></p>
          )}
        </>
      )}
    </article>
  );
}
