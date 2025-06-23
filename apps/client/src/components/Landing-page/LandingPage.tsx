import './LandingPage.css'

export default function LandingPage() {
	return (
		<div className="main-layout">
			<section className="log-in-page">
				<h1>Mystic card escape</h1>
				<p className="description">
					Welcome, brave witch. Trapped deep within a cursed dungeon, your only hope for escape lies in the mystic board before you. Solve its riddles, unlock its secrets, and earn your freedom before the darkness consumes all.
				</p>

				<form>
					<label htmlFor="username">Username</label>
					<input id="username" type="text" placeholder="Enter username" />
				</form>

				<h2 style={{ textAlign: 'center', color: '#ffb347' }}>Grid</h2>
				<div className="grid-buttons">
					<button>6x6</button>
					<button>8x6</button>
					<button>10x6</button>
				</div>

				<button className="play-btn">Play</button>
			</section>

			<section className="leaderboard">
				<h1>Leaderboard</h1>
				<div className="score-board">
					<table>
						<thead>
							<tr>
								<th>Rank</th>
								<th>Username</th>
								<th>Score</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>1.</td>
								<td>Name 1</td>
								<td>20000</td>
							</tr>
							<tr>
								<td>2.</td>
								<td>Name 2</td>
								<td>18000</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>
		</div>
	);
}
