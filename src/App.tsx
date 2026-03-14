import { useState, useEffect, useCallback } from 'react'
import './App.css'

const WORDS: { word: string; hint: string }[] = [
  { word: 'HAKATON', hint: 'Programersko takmičenje' },
  { word: 'ALGORITAM', hint: 'Niz koraka za rešavanje problema' },
  { word: 'PROGRAM', hint: 'Instrukcije za računar' },
  { word: 'SERVER', hint: 'Računar koji pruža usluge mreži' },
  { word: 'INTERNET', hint: 'Globalna računarska mreža' },
  { word: 'SOFTVER', hint: 'Nematerijalni deo računara' },
  { word: 'APLIKACIJA', hint: 'Korisnički program' },
  { word: 'INOVACIJA', hint: 'Novo rešenje ili ideja' },
  { word: 'TAKMICENJE', hint: 'Nadmetanje učesnika' },
  { word: 'PROGRAMER', hint: 'Osoba koja piše kod' },
  { word: 'KODIRANJE', hint: 'Pisanje izvornog koda' },
  { word: 'KOMPAJLER', hint: 'Prevodi kod u izvršni fajl' },
  { word: 'TERMINAL', hint: 'Tekstualni interfejs OS-a' },
  { word: 'FUNKCIJA', hint: 'Blok koda koji se može pozvati' },
  { word: 'PROMENLJIVA', hint: 'Vrednost u memoriji sa imenom' },
  { word: 'PETLJA', hint: 'Ponavlja blok koda' },
  { word: 'MATRICA', hint: 'Dvodimenzionalni niz podataka' },
  { word: 'REKURZIJA', hint: 'Funkcija koja zove samu sebe' },
  { word: 'TESTIRANJE', hint: 'Provera ispravnosti softvera' },
  { word: 'BIBLIOTEKA', hint: 'Skup gotovih funkcija' },
  { word: 'SINTAKSA', hint: 'Pravila pisanja koda' },
  { word: 'VALIDACIJA', hint: 'Provera ispravnosti podataka' },
  { word: 'OPTIMIZACIJA', hint: 'Poboljšanje performansi' },
  { word: 'SIMULACIJA', hint: 'Imitacija realnog sistema' },
  { word: 'RAZVOJ', hint: 'Proces izrade softvera' },
  { word: 'PROJEKAT', hint: 'Organizovani zadatak' },
  { word: 'BLOCKCHAIN', hint: 'Decentralizovana baza podataka' },
  { word: 'BAZA', hint: 'Organizovana kolekcija podataka' },
  { word: 'MREZA', hint: 'Povezani računarski sistemi' },
  { word: 'BEZBEDNOST', hint: 'Zaštita sistema od napada' },
]

const MAX_WRONG = 6

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
]

function getRandomEntry() {
  return WORDS[Math.floor(Math.random() * WORDS.length)]
}

interface HangmanProps {
  wrongGuesses: number
}

function HangmanDrawing({ wrongGuesses }: HangmanProps) {
  return (
    <svg viewBox="0 0 200 260" className="hangman-svg" aria-label={`Hangman drawing: ${wrongGuesses} wrong guesses`}>
      {/* Gallows structure — always visible */}
      <line x1="20" y1="240" x2="180" y2="240" className="gallows" />
      <line x1="60" y1="240" x2="60" y2="20" className="gallows" />
      <line x1="60" y1="20" x2="140" y2="20" className="gallows" />
      <line x1="140" y1="20" x2="140" y2="55" className="gallows" />

      {/* Wrong guess 1 — Head */}
      {wrongGuesses >= 1 && (
        <circle cx="140" cy="72" r="17" className="body-part" />
      )}

      {/* Wrong guess 2 — Body */}
      {wrongGuesses >= 2 && (
        <line x1="140" y1="89" x2="140" y2="158" className="body-part" />
      )}

      {/* Wrong guess 3 — Left arm */}
      {wrongGuesses >= 3 && (
        <line x1="140" y1="108" x2="108" y2="138" className="body-part" />
      )}

      {/* Wrong guess 4 — Right arm */}
      {wrongGuesses >= 4 && (
        <line x1="140" y1="108" x2="172" y2="138" className="body-part" />
      )}

      {/* Wrong guess 5 — Left leg */}
      {wrongGuesses >= 5 && (
        <line x1="140" y1="158" x2="108" y2="200" className="body-part" />
      )}

      {/* Wrong guess 6 — Right leg */}
      {wrongGuesses >= 6 && (
        <line x1="140" y1="158" x2="172" y2="200" className="body-part" />
      )}
    </svg>
  )
}

function App() {
  const [entry, setEntry] = useState(getRandomEntry)
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set())

  const { word, hint } = entry
  const wrongGuesses = [...guessedLetters].filter(l => !word.includes(l)).length
  const isWon = word.split('').every(l => guessedLetters.has(l))
  const isLost = wrongGuesses >= MAX_WRONG
  const isGameOver = isWon || isLost

  const guessLetter = useCallback((letter: string) => {
    if (isGameOver || guessedLetters.has(letter)) return
    setGuessedLetters(prev => new Set([...prev, letter]))
  }, [isGameOver, guessedLetters])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const letter = e.key.toUpperCase()
      if (/^[A-Z]$/.test(letter)) guessLetter(letter)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [guessLetter])

  const resetGame = () => {
    setEntry(getRandomEntry())
    setGuessedLetters(new Set())
  }

  const livesLeft = MAX_WRONG - wrongGuesses

  return (
    <div className="game-container">
      {/* Decorative grid overlay */}
      <div className="grid-overlay" aria-hidden="true" />

      <header className="game-header">
        <div className="brand-tag" aria-label="FON Hakaton">
          <span className="tag-bracket">&lt;</span>
          <span className="tag-text">FON</span>
          <span className="tag-accent">HAKATON</span>
          <span className="tag-bracket">/&gt;</span>
        </div>
        <h1 className="game-title">VEŠALA</h1>
        <p className="game-subtitle">Pogodi reč pre nego što vreme istekne</p>
      </header>

      <main className="game-content">
        {/* Left panel — hangman drawing */}
        <div className="left-panel">
          <div className="hangman-card">
            <HangmanDrawing wrongGuesses={wrongGuesses} />
          </div>
          <div className="lives-display">
            <span className="lives-label">ŽIVOTI</span>
            <div className="lives-pips">
              {Array.from({ length: MAX_WRONG }, (_, i) => (
                <div
                  key={i}
                  className={`pip ${i < livesLeft ? 'active' : 'dead'}`}
                />
              ))}
            </div>
            <span className="lives-count">{livesLeft} / {MAX_WRONG}</span>
          </div>
        </div>

        {/* Right panel — word, hint, keyboard */}
        <div className="right-panel">
          <div className="hint-box">
            <span className="hint-label">&#9679; HINT</span>
            <span className="hint-text">{hint}</span>
          </div>

          {isGameOver && (
            <div className={`status-banner ${isWon ? 'status-won' : 'status-lost'}`}>
              <span className="status-icon">{isWon ? '✓' : '✗'}</span>
              <span className="status-text">{isWon ? 'POBEDA!' : 'PORAZ!'}</span>
              {isLost && (
                <div className="reveal-word">
                  Reč: <strong>{word}</strong>
                </div>
              )}
            </div>
          )}

          <div className="word-display" aria-label="Word to guess">
            {word.split('').map((letter, i) => {
              const revealed = guessedLetters.has(letter)
              const missed = isLost && !revealed
              return (
                <div key={i} className="letter-slot">
                  <span className={`letter-char ${revealed ? 'revealed' : ''} ${missed ? 'missed' : ''}`}>
                    {revealed || isLost ? letter : '\u00A0'}
                  </span>
                  <span className="letter-underline" />
                </div>
              )
            })}
          </div>

          <div className="keyboard" role="group" aria-label="Letter keyboard">
            {KEYBOARD_ROWS.map((row, ri) => (
              <div key={ri} className="keyboard-row">
                {row.map(letter => {
                  const guessed = guessedLetters.has(letter)
                  const correct = guessed && word.includes(letter)
                  const wrong = guessed && !word.includes(letter)
                  return (
                    <button
                      key={letter}
                      className={`key ${correct ? 'key-correct' : ''} ${wrong ? 'key-wrong' : ''}`}
                      onClick={() => guessLetter(letter)}
                      disabled={guessed || isGameOver}
                      aria-label={`Letter ${letter}`}
                      aria-pressed={guessed}
                    >
                      {letter}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>

          {isGameOver && (
            <button className="new-game-btn" onClick={resetGame}>
              &#8635; NOVA IGRA
            </button>
          )}
        </div>
      </main>

      <footer className="game-footer">
        <span>FON HAKATON 2026 &nbsp;·&nbsp; Powered by&nbsp;</span>
        <span className="footer-accent">FONIS</span>
      </footer>
    </div>
  )
}

export default App
