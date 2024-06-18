import styles from "./MemoCardCustomizer.module.css";
import colorThemes from "../../assets/colorThemes";
import { icons } from "../../assets/icons";
import { useContext, useRef } from "react";
import { Context } from "../../context/Context";

// Functional component to render a memo card customizer
export default function MemoCardCustomizer({
  memoCards,
  setMemoCards,
  selectedMemoCard,
}) {
  const { setShowResult } = useContext(Context);

  const trashPopUpRef = useRef(null);

  // Handle clear local storage and reset memo cards
  const handleYesOnClick = () => {
    localStorage.clear();
    setMemoCards([]);
    trashPopUpRef.current.classList.toggle(styles["visible"]);
    setShowResult(false);
  };

  // Handle close the trash popup without clearing data
  const handleNoOnClick = () => {
    trashPopUpRef.current.classList.toggle(styles["visible"]);
  };

  // Handle update the color theme of the selected memo card
  const handleColorTheme = (id) => {
    const updatedMemoCards = memoCards.map((card) => {
      if (card.id === selectedMemoCard) {
        return {
          ...card,
          colorTheme: colorThemes[id],
        };
      }
      return card;
    });

    setMemoCards(updatedMemoCards);
    localStorage.setItem("memoCards", JSON.stringify(updatedMemoCards));
  };

  // Handle toggle the trash popup visibility
  const handleTrashIcon = () => {
    if (trashPopUpRef) {
      trashPopUpRef.current.classList.toggle(styles["visible"]);
    }
  };

  return (
    <article className={styles["memo-card-customizer"]}>
      <section className={styles["color-themes"]}>
        {colorThemes.map((theme, i) => (
          <div
            key={i}
            className={styles["theme"]}
            style={{ backgroundColor: theme.background, color: theme.color }}
            onClick={() => handleColorTheme(i)}
          ></div>
        ))}
      </section>
      <div className={styles["trash-icon"]} onClick={handleTrashIcon}>
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
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
          />
        </svg>
      </div>

      <div ref={trashPopUpRef} className={styles["trash-icon-popup"]}>
        <p>Confirm data deletion?</p>
        <div className={styles["trash-icon-controls"]}>
          <div className={styles["yes"]} onClick={handleYesOnClick}>
            <img src={icons.yes} alt="yes" />
          </div>
          <div className={styles["no"]} onClick={handleNoOnClick}>
            <img src={icons.no} alt="no" />
          </div>
        </div>
      </div>
    </article>
  );
}
