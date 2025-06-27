// React and routing imports
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback, useRef } from "react";

// Styles and components
import './GameBoardComponent.css';
import type { GameCard } from "../../models/CardInterfase";
import CardComponent from "./Cards/CardComponent";
import { allIcons } from "../../data/icons";
import ScoreComponent from "../Score-component/ScoreComponent";

// Define structure of the router state that comes from the previous screen
interface LocationState {
	rows: number;
	columns: number;
	username: string;
}

// Utility function: converts seconds to "MM:SS" format
function formatTime(seconds: number) {
	const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
	const secs = (seconds % 60).toString().padStart(2, '0');
	return `${mins}:${secs}`;
}

// Generates a shuffled array of cards based on number of cards needed
function generateShuffledCards(count: number): GameCard[] {
	const neededPairs = Math.ceil(count / 2);
	const icons = allIcons.slice(0, neededPairs);

	let deck: GameCard[] = [];

	icons.forEach((icon, i) => {
		const card1: GameCard = { ...icon, id: i * 2, isFlipped: false, isMatched: false };
		const card2: GameCard = { ...icon, id: i * 2 + 1, isFlipped: false, isMatched: false };
		deck.push(card1, card2);
	});

	// Shuffle and trim to the desired number of cards
	return deck
		.sort(() => Math.random() - 0.5)
		.slice(0, count);
}

export default function GameBoardComponent() {
	// Get state passed via router
	const location = useLocation();
	const navigate = useNavigate();
	const state = location.state as LocationState | undefined;

	// Game state
	const [username] = useState(state?.username ?? '');
	const [moves, setMoves] = useState(0);
	const [isRunning, setIsRunning] = useState(false);
	const [time, setTime] = useState(60);
	const [currentTime, setCurrentTime] = useState('01:00');
	const [hasStarted, setHasStarted] = useState(false);
	const [flippedCards, setFlippedCards] = useState<GameCard[]>([]);
	const [score, setScore] = useState(0);
	const [gameEnded, setGameEnded] = useState(false);

	// Board setup
	const rows = state?.rows ?? 6;
	const cols = state?.columns ?? 6;
	const totalCards = rows * cols;
	const [cards, setCards] = useState<GameCard[]>(generateShuffledCards(totalCards));

	const maxBoardSize = 560;
	const cellSize = Math.floor(maxBoardSize / Math.max(rows, cols));
	const boardWidth = cols * cellSize;

	// Refs to ensure only one save per game
	const hasSavedResult = useRef(false);
	const scoreRef = useRef(score);
	const movesRef = useRef(moves);

	// Keep refs up-to-date with actual state
	useEffect(() => {
		scoreRef.current = score;
	}, [score]);

	useEffect(() => {
		movesRef.current = moves;
	}, [moves]);

	// Function to save the result to backend (or localStorage during testing)
	const saveGameResult = useCallback(async (
		reason: 'victory' | 'timeout',
		currentScore: number,
		currentMoves: number,
		currentTime: number
	) => {
		if (hasSavedResult.current) return;
		hasSavedResult.current = true;
		setGameEnded(true);

		const finalTime = reason === 'timeout' ? 60 : (60 - currentTime);
		const finalScore = currentScore;
		const finalMoves = currentMoves;

		try {
			await fetch("http://localhost:3000/api/high-scores", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					player: username,
					guesses: finalMoves,
					score: finalScore,
					timeTakeInSeconds: finalTime
				})
			});
		} catch (error) {
			console.error('Failed to save result:', error);
		}
	}, [username]);

	// Format and update display time
	useEffect(() => {
		setCurrentTime(formatTime(time));
	}, [time]);

	// Game timer logic (ticks every second)
	useEffect(() => {
		if (!isRunning || gameEnded) return;

		const interval = setInterval(() => {
			setTime(prev => {
				if (prev <= 1) {
					clearInterval(interval);
					setIsRunning(false);
					saveGameResult('timeout', scoreRef.current, movesRef.current, 0);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, [isRunning, gameEnded, saveGameResult]);

	// Check for matched pairs and handle game logic
	useEffect(() => {
		if (flippedCards.length === 2) {
			const [first, second] = flippedCards;
			let newScore = score;

			if (first.icon === second.icon) {
				newScore = score + 50;
				setScore(newScore);

				// Mark matched cards
				setCards(prevCards =>
					prevCards.map(card =>
						card.id === first.id || card.id === second.id
							? { ...card, isMatched: true }
							: card
					)
				);

				// Check for win condition
				const allMatched = cards.every(card =>
					card.isMatched || card.id === first.id || card.id === second.id
				);

				if (allMatched) {
					setIsRunning(false);
					setTimeout(() => {
						saveGameResult('victory', newScore, movesRef.current, time);
					}, 100);
				}
			} else {
				// Flip back if not matched
				setTimeout(() => {
					setCards(prevCards =>
						prevCards.map(card =>
							card.id === first.id || card.id === second.id
								? { ...card, isFlipped: false }
								: card
						)
					);
				}, 600);
			}

			// Reset flipped state
			setFlippedCards([]);
		}
	}, [flippedCards, cards, score, time, saveGameResult]);

	// Handle user clicking a card
	const handleCardClick = (id: number) => {
		if (!hasStarted) {
			setHasStarted(true);
			setIsRunning(true);
		}
		if (gameEnded) return;

		const clickedCard = cards.find(card => card.id === id);
		if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched) return;
		if (flippedCards.length >= 2) return;

		setFlippedCards(current => [...current, clickedCard]);
		setMoves(prev => prev + 1);

		// Flip the clicked card
		setCards(prev =>
			prev.map(card =>
				card.id === id ? { ...card, isFlipped: true } : card
			)
		);
	};

	// Render the board with rows and columns
	const board = [];
	for (let i = 0; i < rows; i++) {
		const row = [];
		for (let j = 0; j < cols; j++) {
			const card = cards[i * cols + j];
			if (!card) continue;

			row.push(
				<CardComponent
					key={card.id}
					card={card}
					onClick={() => handleCardClick(card.id)}
					size={cellSize}
				/>
			);
		}
		board.push(<div className="card-row" key={i}>{row}</div>);
	}

	// Navigate back to main menu
	const handleNavigateToMain = () => {
		navigate('/', { state: { shouldRefresh: true } });
	};

	return (
		<>
			<button onClick={handleNavigateToMain} className="back-btn">Back to menu</button>
			<section className="game-layout">
				<h1>Undercity escape</h1>
				<ScoreComponent
					moves={moves}
					currentTime={currentTime}
					score={score}
				/>
			</section>
			{gameEnded ? (
				<p style={{ textAlign: "center", color: "#39ff14", fontSize: "1.2em" }}>
					The game is over!
				</p>
			) : (
				<section
					className="card-board"
					style={{ width: boardWidth }}
				>
					{board}
				</section>
			)}
		</>
	);
}
