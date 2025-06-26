import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import './GameBoardComponent.css';
import type { GameCard } from "../../models/CardInterfase";
import CardComponent from "./Cards/CardComponent";
import { allIcons } from "../../data/icons";
import ScoreComponent from "../Score-component/ScoreComponent";

interface LocationState {
	rows: number;
	columns: number;
}

function formatTime(seconds: number) {
	const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
	const secs = (seconds % 60).toString().padStart(2, '0');
	return `${mins}:${secs}`;
}

function generateShuffledCards(count: number): GameCard[] {
	const neededPairs = Math.ceil(count / 2);
	const icons = allIcons.slice(0, neededPairs);

	let deck: GameCard[] = [];

	icons.forEach((icon, i) => {
		const card1: GameCard = { ...icon, id: i * 2, isFlipped: false, isMatched: false };
		const card2: GameCard = { ...icon, id: i * 2 + 1, isFlipped: false, isMatched: false };
		deck.push(card1, card2);
	});

	return deck
		.sort(() => Math.random() - 0.5)
		.slice(0, count);
}

export default function GameBoardComponent() {
	const location = useLocation();
	const navigate = useNavigate();
	const state = location.state as LocationState | undefined;

	const [moves, setMoves] = useState(0);
	const [isRunning, setIsRunning] = useState(false);
	const [time, setTime] = useState(60);
	const [currentTime, setCurrentTime] = useState('01:00');
	const [hasStarted, setHasStarted] = useState(false);
	const [flippedCards, setFlippedCards] = useState<GameCard[]>([]);
	const [score, setScore] = useState(0);
	const [isChecking, setIsChecking] = useState(false);


	const rows = state?.rows ?? 6;
	const cols = state?.columns ?? 6;
	const totalCards = rows * cols;

	const [cards, setCards] = useState<GameCard[]>(generateShuffledCards(totalCards));

	const maxBoardSize = 560;
	const cellSize = Math.floor(maxBoardSize / Math.max(rows, cols));
	const boardWidth = cols * cellSize;

	useEffect(() => {
		setCurrentTime(formatTime(time));
	}, [time]);

	useEffect(() => {
		if (!isRunning) return;

		const interval = setInterval(() => {
			setTime(prev => {
				if (prev <= 1) {
					clearInterval(interval);
					setIsRunning(false);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, [isRunning]);

	useEffect(() => {
		if (flippedCards.length === 2) {
			const [first, second] = flippedCards;

			if (first.icon === second.icon) {
				setScore(prev => prev + 50)
				setCards(prevCards =>
					prevCards.map(card =>
						card.id === first.id || card.id === second.id
							? { ...card, isMatched: true }
							: card
					)
				)

			} else {
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
			setFlippedCards([]);
		}
	}, [flippedCards]);


	const handleCardClick = (id: number) => {
		if (!hasStarted) {
			setHasStarted(true);
			setIsRunning(true);
		}

		// Найди карту по id
		const clickedCard = cards.find(card => card.id === id);

		// ⛔ Если уже открыта или уже подобрана — ничего не делай
		if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched) {
			return;
		}
		setFlippedCards(current => [...current, clickedCard]);

		// ✅ Увеличиваем ходы только если карта еще не открыта
		setMoves(prev => prev + 1);

		// Переворачиваем карту
		setCards(prev =>
			prev.map(card => {
				if (card.id === id) {
					return { ...card, isFlipped: true };
				}
				return card;
			})
		);
	};

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
		board.push(
			<div className="card-row" key={i}>
				{row}
			</div>
		);
	}

	const handleNavigateToMain = () => {
		navigate('/')
	}
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

			<section
				className="card-board"
				style={{ width: boardWidth }}
			>
				{board}
			</section>
		</>
	);
}
