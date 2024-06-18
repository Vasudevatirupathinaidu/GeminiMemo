import { useState, useEffect, useContext } from "react";
import MemoCard from "./components/MemoCard/MemoCard";
import MemoCardCustomizer from "./components/MemoCardCustomizer/MemoCardCustomizer";
import { Context } from "./context/Context";
import SearchBox from "./components/SearchBox/SearchBox";
import Connect from "./components/Connect/Connect";

function App() {
  const { showResult } = useContext(Context);

  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [memoCards, setMemoCards] = useState([]);
  const [isDraggable, setIsDraggable] = useState(false);
  const [selectedMemoCard, setSelectedMemoCard] = useState(null);

  useEffect(() => {
    const storedMemoCards = localStorage.getItem("memoCards");

    if (storedMemoCards) {
      setMemoCards(JSON.parse(storedMemoCards));
    }
  }, []);

  useEffect(() => {
    function handleMousemove(e) {
      if (selectedMemoCard === null) return;

      const newX = e.clientX - startPos.x;
      const newY = e.clientY - startPos.y;

      setStartPos({ x: e.clientX, y: e.clientY });

      const updatedMemoCards = memoCards.map((card) => {
        if (card.id === selectedMemoCard) {
          return {
            ...card,
            pos: { x: card.pos.x + newX, y: card.pos.y + newY },
          };
        }
        return card;
      });

      setMemoCards(updatedMemoCards);
    }

    function handleMouseup() {
      setIsDraggable(false);
      localStorage.setItem("memoCards", JSON.stringify(memoCards));

      document.removeEventListener("mousemove", handleMousemove);
      document.removeEventListener("mouseup", handleMouseup);
    }

    if (isDraggable) {
      document.addEventListener("mousemove", handleMousemove);
      document.addEventListener("mouseup", handleMouseup);
    }

    return () => {
      document.removeEventListener("mousemove", handleMousemove);
      document.removeEventListener("mouseup", handleMouseup);
    };
  }, [isDraggable, startPos, memoCards, selectedMemoCard]);

  function handleMousedown(e, id) {
    setIsDraggable(true);
    setSelectedMemoCard(id);
    setStartPos({ x: e.clientX, y: e.clientY });
  }

  return (
    <section id="gemini-memo-container">
      <Connect />
      <MemoCardCustomizer
        memoCards={memoCards}
        selectedMemoCard={selectedMemoCard}
        setSelectedMemoCard={setSelectedMemoCard}
        setMemoCards={setMemoCards}
      />
      {!showResult ? (
        <div className="app-title">
          <h1>Gemini Memo</h1>
          <p>This tool was optimized for users who use large screens.</p>
        </div>
      ) : (
        memoCards.map((memoCard) => (
          <MemoCard
            memoCards={memoCards}
            setMemoCards={setMemoCards}
            key={memoCard.id}
            id={memoCard.id}
            isDraggable={isDraggable}
            memoCard={memoCard}
            selectedMemoCard={selectedMemoCard}
            setSelectedMemoCard={setSelectedMemoCard}
            handleMousedown={(e) => handleMousedown(e, memoCard.id)}
          />
        ))
      )}
      <SearchBox
        setSelectedMemoCard={setSelectedMemoCard}
        setMemoCards={setMemoCards}
      />
    </section>
  );
}

export default App;
