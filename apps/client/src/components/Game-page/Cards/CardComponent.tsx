import type { GameCard } from '../../../models/CardInterfase';
import './CardComponent.css';

interface CardProps {
	card: GameCard;
	onClick?: () => void;
	size: number;
}

export default function CardComponent({ card, onClick, size }: CardProps) {
	const iconUrl = `https://wow.zamimg.com/images/wow/icons/large/${card.icon.toLowerCase()}.jpg`;

	return (
		<div
			className={`card ${card.isFlipped ? 'flipped' : ''}`}
			style={{ width: size, height: size }}
			onClick={onClick}
		>
			{card.isFlipped ? (
				<img src={iconUrl} alt={card.title} />
			) : (
				<div className="card-back" />
			)}
		</div>
	);
}
