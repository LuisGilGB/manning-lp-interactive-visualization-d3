import clsx from 'clsx';
import TennisPlayer from '../../domain/TennisPlayer.ts';
import styles from './TennisPlayerCard.module.css';

interface TennisPlayerCardProps {
  player: TennisPlayer;
  className?: string;
}

const TennisPlayerCard = ({ player, className }: TennisPlayerCardProps) => {
  return (
    <div className={clsx(styles['card'], className)}>
      <div className={styles['name']}>{player.name}</div>
      <div className={styles['home']}>{player.country}</div>
      <div className={styles['total-earnings-section']}>
        Total prize money:{' '}
        <span className={styles['total-earnings']}>
          {player.earningsUsd2019.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            notation: 'compact',
            maximumSignificantDigits: 3,
          })}
        </span>
      </div>
    </div>
  );
};

export default TennisPlayerCard;
