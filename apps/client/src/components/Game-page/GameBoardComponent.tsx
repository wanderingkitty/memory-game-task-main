import './GameBoardComponent.css'

export default function GameBoardComponent() {
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

			<section className='card-board'>

			</section>
		</>
	)
}
