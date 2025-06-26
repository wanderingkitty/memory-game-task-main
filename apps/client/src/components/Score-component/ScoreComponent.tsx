import './ScoreComponent.css';

interface ScoreProps {
	moves: number;
	currentTime: string;
	score: number;
}

export default function ScoreComponent({ moves, currentTime, score }: ScoreProps) {

	return (
		<div className="info-stats">
			<div className="stat-block">
				<h3>Timer</h3>
				<div>{currentTime}</div>
			</div>
			<div className="stat-block">
				<h3>Moves</h3>
				<div>{moves}</div>
			</div>
			<div className="stat-block">
				<h3>Score</h3>
				<div>{score}</div>
			</div>
		</div>
	);
}
