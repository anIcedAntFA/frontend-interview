import { ComponentProps, useRef, useState } from 'react';
import './reset.css';

import styles from './app.module.css';

const DELAY_TIME = 500;

const countryWithCapitals: Record<string, string> = {
  Indonesia: 'Jakarta',
  Malaysia: 'Kuala Lumpur',
  Singapore: 'Singapore',
  Thailand: 'Bangkok',
  Philippines: 'Manila',
  Vietnam: 'Hanoi',
  Laos: 'Vientiane',
  Myanmar: 'Naypyidaw',
  Cambodia: 'Phnom Penh',
  Brunei: 'Bandar Seri Begawan',
  TimorLeste: 'Dili',
};

const shuffledTags = Object.entries(countryWithCapitals)
  .flat()
  .sort(() => Math.random() - 0.5);

const statuses = {
  IDLE: 'idle',
  SELECTED: 'selected',
  CORRECT: 'correct',
  WRONG: 'wrong',
  DONE: 'done',
} as const;

type Status = (typeof statuses)[keyof typeof statuses];

type TagItemProps = {
  status: Status;
  children: string;
} & ComponentProps<'button'>;

function TagItem({ status, children, ...buttonProps }: TagItemProps) {
  return (
    <button className={styles.tag} data-status={status} {...buttonProps}>
      {children}
    </button>
  );
}

function App() {
  const [statuses, setStatuses] = useState<Status[]>(
    Array(shuffledTags.length).fill('idle')
  );
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);

  const isRunningRef = useRef<boolean>(false);

  // const updateStatuses = (indexes: number[], status: Status) => {
  //   setStatuses((prev) => {
  //     const newStatuses = [...prev];
  //     indexes.forEach((index) => {
  //       newStatuses[index] = status;
  //     });
  //     return newStatuses;
  //   });
  // };

  const updateStatuses = (indexes: number[], status: Status) => {
    setStatuses((prev) => {
      return indexes.reduce(
        (statuses, index) => {
          statuses[index] = status;
          return statuses;
        },
        [...prev]
      );
    });
  };

  const handleClick = (index: number) => {
    if (isRunningRef.current || selectedIndexes[0] === index) return;

    updateStatuses([index], 'selected');

    const newSelectedIndexes = [...selectedIndexes, index];
    setSelectedIndexes(newSelectedIndexes);

    if (newSelectedIndexes.length === 2) {
      isRunningRef.current = true;

      const [firstIndex, secondIndex] = newSelectedIndexes;
      const firstSelected = shuffledTags[firstIndex];
      const secondSelected = shuffledTags[secondIndex];
      const isMatched =
        countryWithCapitals[firstSelected] === secondSelected ||
        countryWithCapitals[secondSelected] === firstSelected;

      updateStatuses(newSelectedIndexes, isMatched ? 'correct' : 'wrong');

      setTimeout(() => {
        isRunningRef.current = false;
        updateStatuses(newSelectedIndexes, isMatched ? 'done' : 'idle');
        setSelectedIndexes([]);
      }, DELAY_TIME);
    }
  };

  return (
    <>
      {statuses.every((status) => status === 'done') ? (
        <p className={styles.text}>Congratulations!</p>
      ) : (
        <div className={styles.list}>
          {shuffledTags.map((item, index) => (
            <TagItem
              key={index}
              status={statuses?.[index]}
              onClick={() => handleClick(index)}
            >
              {item}
            </TagItem>
          ))}
        </div>
      )}
    </>
  );
}

export default App;
