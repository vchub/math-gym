import { useState } from 'react';
import './LampSwitchGamePage.css';

function LampSwitchGamePage() {
  // Game state
  const [numLamps, setNumLamps] = useState(5);
  const [gameStatus, setGameStatus] = useState('setup'); // 'setup' | 'playing' | 'solved'
  const [mapping, setMapping] = useState({}); // switch index -> lamp index
  const [switchStates, setSwitchStates] = useState([]);
  const [lampStates, setLampStates] = useState([]);
  const [moveCount, setMoveCount] = useState(0);
  const [userMapping, setUserMapping] = useState({});
  const [moveHistory, setMoveHistory] = useState([]);
  const [resultMessage, setResultMessage] = useState('');

  // Calculate optimal number of moves (binary search: ceil(log2(n)))
  const optimalMoves = numLamps > 0 ? Math.ceil(Math.log2(numLamps)) : 0;

  // Start a new game
  const startGame = () => {
    // Create random mapping (shuffle)
    const lampIndices = Array.from({ length: numLamps }, (_, i) => i);
    const shuffled = [...lampIndices].sort(() => Math.random() - 0.5);
    const newMapping = {};
    shuffled.forEach((lampIdx, switchIdx) => {
      newMapping[switchIdx] = lampIdx;
    });

    setMapping(newMapping);
    setSwitchStates(new Array(numLamps).fill(false));
    setLampStates(new Array(numLamps).fill(false));
    setMoveCount(0);
    setUserMapping({});
    setMoveHistory([]);
    setResultMessage('');
    setGameStatus('playing');
  };

  // Toggle a switch
  const toggleSwitch = (index) => {
    if (gameStatus !== 'playing') return;
    const newStates = [...switchStates];
    newStates[index] = !newStates[index];
    setSwitchStates(newStates);
  };

  // Execute action - apply switch states to lamps
  const executeAction = () => {
    if (gameStatus !== 'playing') return;

    // Create new lamp states based on current switch positions
    const newLampStates = new Array(numLamps).fill(false);
    
    // For each switch that is ON, turn on its connected lamp
    switchStates.forEach((isOn, switchIdx) => {
      if (isOn) {
        const lampIdx = mapping[switchIdx];
        newLampStates[lampIdx] = true;
      }
    });

    setLampStates(newLampStates);
    setMoveCount(moveCount + 1);
    
    // Record move in history
    const activeSwitches = switchStates
      .map((on, idx) => on ? idx + 1 : null)
      .filter(x => x !== null);
    
    setMoveHistory([
      ...moveHistory,
      {
        move: moveCount + 1,
        switches: activeSwitches,
        result: newLampStates.map((on, idx) => on ? idx + 1 : null).filter(x => x !== null)
      }
    ]);

    // Keep switches in their current state so user can see what they selected
    // User can manually toggle them for the next move
  };

  // Handle user mapping input
  const handleMappingInput = (switchIdx, value) => {
    const lampIdx = parseInt(value) - 1; // Convert to 0-based index
    if (!isNaN(lampIdx) && lampIdx >= 0 && lampIdx < numLamps) {
      setUserMapping({ ...userMapping, [switchIdx]: lampIdx });
    } else if (value === '') {
      const newMapping = { ...userMapping };
      delete newMapping[switchIdx];
      setUserMapping(newMapping);
    }
  };

  // Check if user's mapping is correct
  const checkSolution = () => {
    if (Object.keys(userMapping).length !== numLamps) {
      setResultMessage('❌ Please fill in all mappings!');
      return;
    }

    let isCorrect = true;
    for (let i = 0; i < numLamps; i++) {
      if (userMapping[i] !== mapping[i]) {
        isCorrect = false;
        break;
      }
    }

    if (isCorrect) {
      setGameStatus('solved');
      const efficiency = ((optimalMoves / moveCount) * 100).toFixed(1);
      setResultMessage(
        `🎉 Correct! You solved it in ${moveCount} moves. ` +
        `Optimal: ${optimalMoves} moves. Efficiency: ${efficiency}%`
      );
    } else {
      setResultMessage('❌ Not quite right. Keep trying!');
    }
  };

  // Reset to setup
  const resetGame = () => {
    setGameStatus('setup');
    setResultMessage('');
  };

  return (
    <div className="lamp-switch-game">
      <h1>🔦 Lamp-Switch Mapping Game</h1>
      
      <div className="game-description">
        <p>
          <strong>Challenge:</strong> Find which switch controls which lamp using the minimum number of moves.
          This demonstrates <strong>binary search</strong> strategy!
        </p>
        <p>
          💡 <strong>Optimal strategy:</strong> Use {optimalMoves} moves (⌈log₂({numLamps})⌉) by testing switches in groups.
        </p>
      </div>

      {/* Setup Phase */}
      {gameStatus === 'setup' && (
        <div className="game-setup">
          <h2>Setup</h2>
          <div className="setup-controls">
            <label>
              Number of Lamps:
              <input
                type="number"
                min="2"
                max="10"
                value={numLamps}
                onChange={(e) => setNumLamps(parseInt(e.target.value) || 2)}
              />
            </label>
            <button onClick={startGame} className="btn-primary">
              Start Game
            </button>
          </div>
        </div>
      )}

      {/* Playing Phase */}
      {(gameStatus === 'playing' || gameStatus === 'solved') && (
        <>
          {/* Game Stats */}
          <div className="game-stats">
            <div className="stat">
              <span className="stat-label">Moves:</span>
              <span className="stat-value">{moveCount}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Optimal:</span>
              <span className="stat-value">{optimalMoves}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Lamps:</span>
              <span className="stat-value">{numLamps}</span>
            </div>
          </div>

          {/* Main Game Area */}
          <div className="game-area">
            {/* Switches Panel */}
            <div className="panel switches-panel">
              <h3>Switches</h3>
              <div className="switches">
                {switchStates.map((isOn, idx) => (
                  <div key={idx} className="switch-item">
                    <span className="switch-label">SW {idx + 1}</span>
                    <button
                      className={`switch-btn ${isOn ? 'on' : 'off'}`}
                      onClick={() => toggleSwitch(idx)}
                      disabled={gameStatus === 'solved'}
                    >
                      {isOn ? 'ON' : 'OFF'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Lamps Panel */}
            <div className="panel lamps-panel">
              <h3>Lamps</h3>
              <div className="lamps">
                {lampStates.map((isOn, idx) => (
                  <div key={idx} className="lamp-item">
                    <span className="lamp-label">L {idx + 1}</span>
                    <div className={`lamp ${isOn ? 'on' : 'off'}`}>
                      <div className="lamp-bulb"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Control */}
          <div className="action-control">
            <button
              onClick={executeAction}
              className="btn-action"
              disabled={gameStatus === 'solved' || !switchStates.some(s => s)}
            >
              🎬 Execute Action
            </button>
            <button onClick={resetGame} className="btn-secondary">
              🔄 New Game
            </button>
          </div>

          {/* Move History */}
          {moveHistory.length > 0 && (
            <div className="move-history">
              <h3>Move History</h3>
              <div className="history-list">
                {moveHistory.map((move, idx) => (
                  <div key={idx} className="history-item">
                    <strong>Move {move.move}:</strong> Switched ON: [{move.switches.join(', ')}] 
                    → Lamps ON: [{move.result.join(', ')}]
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mapping Input */}
          <div className="mapping-input">
            <h3>Enter Your Mapping</h3>
            <p className="mapping-hint">Which lamp does each switch control?</p>
            <div className="mapping-grid">
              {Array.from({ length: numLamps }, (_, idx) => (
                <div key={idx} className="mapping-item">
                  <label>Switch {idx + 1} →</label>
                  <input
                    type="number"
                    min="1"
                    max={numLamps}
                    placeholder="?"
                    value={userMapping[idx] !== undefined ? userMapping[idx] + 1 : ''}
                    onChange={(e) => handleMappingInput(idx, e.target.value)}
                    disabled={gameStatus === 'solved'}
                  />
                  <span>Lamp</span>
                </div>
              ))}
            </div>
            <button
              onClick={checkSolution}
              className="btn-check"
              disabled={gameStatus === 'solved'}
            >
              ✓ Check Solution
            </button>
          </div>

          {/* Result Message */}
          {resultMessage && (
            <div className={`result-message ${gameStatus === 'solved' ? 'success' : 'error'}`}>
              {resultMessage}
            </div>
          )}
        </>
      )}

      {/* Educational Info */}
      <div className="educational-info">
        <h3>📚 About Binary Search Strategy</h3>
        <ul>
          <li><strong>Naive approach:</strong> Test each switch one at a time = n moves</li>
          <li><strong>Binary search approach:</strong> Test switches in groups = ⌈log₂(n)⌉ moves</li>
          <li><strong>Example (n=5):</strong> Group switches as: {'{1,2}'}, {'{3,4}'}, {'{5}'} → 3 moves max</li>
          <li><strong>Key insight:</strong> Each move can eliminate ~half of possibilities</li>
        </ul>
      </div>
    </div>
  );
}

export default LampSwitchGamePage;
