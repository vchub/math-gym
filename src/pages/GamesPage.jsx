import { Link } from 'react-router-dom';
import './GamesPage.css';

function GamesPage() {
  const games = [
    {
      id: 'lamp-switch',
      title: '🔦 Lamp-Switch Mapping',
      description: 'Find which switch controls which lamp using minimum moves. Learn binary search strategy!',
      difficulty: 'Medium',
      topic: 'Binary Search',
      path: '/games/lamp-switch'
    },
    // Add more games here in the future
  ];

  return (
    <div className="games-page">
      <div className="games-header">
        <h1>🎮 Math & Logic Games</h1>
        <p className="games-subtitle">
          Interactive games to learn algorithms and problem-solving strategies
        </p>
      </div>

      <div className="games-grid">
        {games.map((game) => (
          <Link to={game.path} key={game.id} className="game-card">
            <div className="game-card-header">
              <h2>{game.title}</h2>
              <span className={`difficulty-badge ${game.difficulty.toLowerCase()}`}>
                {game.difficulty}
              </span>
            </div>
            <p className="game-description">{game.description}</p>
            <div className="game-footer">
              <span className="game-topic">📚 {game.topic}</span>
              <span className="play-arrow">Play →</span>
            </div>
          </Link>
        ))}
      </div>

      {games.length === 0 && (
        <div className="no-games">
          <p>No games available yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}

export default GamesPage;
