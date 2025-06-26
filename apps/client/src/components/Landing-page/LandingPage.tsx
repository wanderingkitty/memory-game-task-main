import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import './LandingPage.css';

interface HighScore {
	id: string;
	player: string;
	guesses: number;
	timeTakeInSeconds: number;
	score: number;
}

export default function LandingPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const [boardSize, setBoardSize] = useState({ rows: 6, columns: 6 });
	const [username, setUserName] = useState('');
	const [error, setError] = useState('');
	const [leaderboard, setLeaderboard] = useState<HighScore[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchLeaderboard();

		if (location.state?.shouldRefresh) {
			fetchLeaderboard()
		}
	}, [location.state]);

	const fetchLeaderboard = async () => {
		try {
			const response = await fetch('http://localhost:3000/api/high-scores');
			const data = await response.json();

			// Score sorting
			const sortedData = data.sort((a: HighScore, b: HighScore) => {
				if (b.score !== a.score) {
					return b.score - a.score;
				}
				return a.timeTakeInSeconds - b.timeTakeInSeconds;
			});

			setLeaderboard(sortedData.slice(0, 10));
		} catch (error) {
			console.error('Loading leaderboard error:', error);
		} finally {
			setLoading(false);
		}
	};

	const handlePlay = () => {
		if (!username.trim()) {
			setError('Please enter a username');
			return;
		}
		setError('');
		navigate('/board-page', {
			state: {
				...boardSize,
				username: username.trim()
			}
		});
	};

	const handleSize = (rows: number, columns: number) => {
		setBoardSize({ rows, columns });
	};

	const isSelected = (rows: number, columns: number) => {
		return boardSize.rows === rows && boardSize.columns === columns;
	};

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
		const secs = (seconds % 60).toString().padStart(2, '0');
		return `${mins}:${secs}`;
	};

	return (
		<div className="main-layout">
			<section className="log-in-page">
				<h1 className="title">Undercity escape</h1>
				<p className="description">
					Welcome, brave witch. Trapped deep within a cursed dungeon, your only
					hope for escape lies in the mystic board before you. Solve its riddles,
					unlock its secrets, and earn your freedom before the darkness consumes all.
				</p>

				<form>
					<label htmlFor="username">Username</label>
					<input
						id="username"
						type="text"
						value={username}
						onChange={(e) => {
							setUserName(e.target.value);
							if (error) setError('');
						}}
						placeholder="Enter username"
					/>
					{error && <p className="error-message">{error}</p>}
				</form>

				<h2 className="grid-title">Grid</h2>
				<div className="grid-buttons">
					<button
						className={isSelected(6, 6) ? 'selected' : ''}
						onClick={() => handleSize(6, 6)}
						type="button"
					>
						6x6
					</button>
					<button
						className={isSelected(8, 6) ? 'selected' : ''}
						onClick={() => handleSize(8, 6)}
						type="button"
					>
						8x6
					</button>
					<button
						className={isSelected(10, 6) ? 'selected' : ''}
						onClick={() => handleSize(10, 6)}
						type="button"
					>
						10x6
					</button>
				</div>

				<button onClick={handlePlay} className={`play-btn ${!username.trim() ? 'disabled' : ''}`}>
					Play
				</button>
			</section>

			<section className="leaderboard">
				<h1>Leaderboard</h1>
				<div className="score-board">
					{loading ? (
						<p>Loading leaderboard...</p>
					) : (
						<table>
							<thead>
								<tr>
									<th>Rank</th>
									<th>Username</th>
									<th>Score</th>
									<th>Time</th>
									<th>Moves</th>
								</tr>
							</thead>
							<tbody>
								{leaderboard.length > 0 ? (
									leaderboard.map((score, index) => (
										<tr key={score.id}>
											<td>{index + 1}.</td>
											<td>{score.player}</td>
											<td>{score.score}</td>
											<td>{formatTime(score.timeTakeInSeconds)}</td>
											<td>{score.guesses}</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan={5} style={{ textAlign: 'center' }}>
											No scores yet. Be the first to play!
										</td>
									</tr>
								)}
							</tbody>
						</table>
					)}
				</div>
			</section>
		</div>
	);
}