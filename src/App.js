import "./App.css";
import { useState } from "react";
import { createSecretCode, checkIfUnique } from "./game";

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [guess, setGuess] = useState("");
  const [secretCode, setSecretCode] = useState(createSecretCode());
  const [history, setHistory] = useState([]);
  const [guesses, setGuesses] = useState(0);
  const [invalidGuess, setInvalidGuess] = useState(false);
  const [won, setWon] = useState(false);

  function checkIfNumber(e) {
    if (isNaN(e)) {
      return
    } else {
      setGuess(e);
    }
  }

  function checkForBullsAndCows() {
    let b = 0;
    let c = 0;
    let secretDigit;
    let index;
    for (let i = 0; i < 4; i++) {
      secretDigit = secretCode[i];
      index = guess.indexOf(secretDigit);
      if (secretDigit === parseInt(guess[i])) {
        b++;
      }
      if (index >= 0 && index !== i) {
        c++;
      }
    }

    return [b, c];
  }

  function guessCode() {
    if (guess.length !== 4 || !checkIfUnique(guess)) {
      setInvalidGuess(true);
      return
    } else {
      setInvalidGuess(false);
    }

    var bullsAndCows = checkForBullsAndCows();
    if (bullsAndCows[0] === 4) {
      setWon(true);
    }

    var currHistory = history;
    currHistory.push({ guess: guess, bulls: bullsAndCows[0], cows: bullsAndCows[1] });
    setHistory(currHistory);
    setGuess("");
    var currGuesses = guesses;
    currGuesses++;
    setGuesses(currGuesses);
  }

  function printHistory() {
    const items = []

    let c = 1;
    for (const h of history) {
      items.push(
        <tr key={c}>
          <td>{c}</td>
          <td>{h["guess"]}</td>
          <td className="Bull-col">{h["bulls"]}</td>
          <td className="Cow-col">{h["cows"]}</td>
        </tr>
      )
      c++;
    }

    return items
  }

  function clickOnEnter(e) {
    if (e.key === "Enter") {
      guessCode();
    }
  }

  function startNewGame() {
    setSecretCode(createSecretCode());
    setHistory([]);
    setGuesses(0);
    setWon(false);
  }

  if (!gameStarted) {
    return (
      <div className="Start-menu">
        <h2 id="Start-title">Bulls and Cows</h2>
        <button id="Start-button" onClick={() => setGameStarted(true)}>
          Start Game!
        </button>
      </div>
    );
  }

  if (won) {
    return (
      <div className="Ending-screen">
        <div>You won! The secret code was {secretCode}</div>
        <button className="Ending-button" onClick={startNewGame}>Play again?</button>
        <img src="/default dance.gif" alt="default" id="Default-dance" />
      </div>
    );
  }

  if (guesses >= 8) {
    return (
      <div className="Ending-screen">
        <div>You lost. The secret code was {secretCode}</div>
        <button className="Ending-button" onClick={startNewGame}>Play again?</button>
      </div>
    );
  }

  return (
    <div className="Game">
      <div id="History">
        <table id="History-table">
          <thead>
            <tr>
              <th>Attempt</th>
              <th>Guess</th>
              <th className="Bull-col">Bulls</th>
              <th className="Cow-col">Cows</th>
            </tr>
          </thead>
          <tbody>
            {printHistory()}
          </tbody>
        </table>
      </div>
      <div id="Base">
        <button className="Base-button" onClick={startNewGame}>
          Restart!
        </button>
        <input
          value={guess}
          id="Guess"
          maxLength="4"
          onChange={(e) => checkIfNumber(e.target.value)}
          onKeyPress={clickOnEnter}
        ></input>
        <button className="Base-button" onClick={guessCode}>
          Go!
        </button>
      </div>
      {invalidGuess &&
        <div id="Invalid">
          Invalid Entry
      </div>}
    </div>
  );
}

export default App;
