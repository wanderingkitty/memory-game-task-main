import { useLocation } from "react-router-dom";
import './GameBoardComponent.css';

interface LocationState {
	rows: number;
	columns: number;
}

export default function GameBoardComponent() {
	const location = useLocation();
	const state = location.state as LocationState | undefined;

	const rows = state?.rows ?? 6;
	const cols = state?.columns ?? 6;

	const maxBoardSize = 560;
	const gapSize = 6.5;

	const cellSize = Math.floor((maxBoardSize - (Math.max(rows, cols) - 1) * gapSize) / Math.max(rows, cols));

	const boardWidth = cols * cellSize + (cols - 1) * gapSize;
	const boardHeight = rows * cellSize + (rows - 1) * gapSize;

	const board = [];

	for (let i = 0; i < rows; i++) {
		const row = [];

		for (let j = 0; j < cols; j++) {
			row.push(
				<div
					className="card-cell"
					style={{ width: cellSize, height: cellSize }}
					key={`cell-${i}-${j}`}
				></div>
			);
		}

		board.push(
			<div className="card-row" key={`row-${i}`} style={{ gap: gapSize }}>
				{row}
			</div>
		);
	}

	return (
		<>
			<section className="game-layout">
				<h1>Mystic card escape</h1>

				<div className="info-stats">
					<div className="stat-block">
						<h3>Timer</h3>
						<div>01:00</div>
					</div>
					<div className="stat-block">
						<h3>Moves</h3>
						<div>0</div>
					</div>
					<div className="stat-block">
						<h3>Score</h3>
						<div>17500</div>
					</div>
				</div>
			</section>

			<section
				className="card-board"
				style={{ width: boardWidth, height: boardHeight }}
			>
				{board}
			</section>
		</>
	);
}
