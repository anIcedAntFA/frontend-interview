import './reset.css';
import './style.css';

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

const statuses = {
  IDLE: 'idle',
  SELECTED: 'selected',
  CORRECT: 'correct',
  WRONG: 'wrong',
  DONE: 'done',
} as const;

type Status = (typeof statuses)[keyof typeof statuses];

function initApp() {
  let selectedIndexes: number[] = [];
  let isRunning = false;

  const shuffledTags = Object.entries(countryWithCapitals)
    .flat()
    .sort(() => Math.random() - 0.5);

  const tagListElement = document.createElement('div');
  tagListElement.className = 'list';

  shuffledTags.forEach((tag, index) => {
    const tagElement = document.createElement('button');
    tagElement.className = 'tag';
    tagElement.textContent = tag;
    tagElement.dataset.status = statuses.IDLE;
    tagListElement.appendChild(tagElement);

    tagElement.addEventListener('click', () => {
      if (isRunning || selectedIndexes.includes(index)) return;

      tagElement.dataset.status = statuses.SELECTED;

      selectedIndexes.push(index);

      if (selectedIndexes.length === 2) {
        isRunning = true;

        const [firstSelectedIndex, secondSelectedIndex] = selectedIndexes;

        const firstSelectedTag = shuffledTags[firstSelectedIndex];
        const secondSelectedTag = shuffledTags[secondSelectedIndex];

        const isMatched =
          countryWithCapitals[firstSelectedTag] === secondSelectedTag ||
          countryWithCapitals[secondSelectedTag] === firstSelectedTag;

        const tagElements =
          tagListElement.querySelectorAll<HTMLButtonElement>('.tag');

        const updateStatuses = (indexes: number[], status: Status) => {
          tagElements.forEach((tag, index) => {
            if (indexes.includes(index)) {
              tag.dataset.status = status;
            }
          });
        };

        updateStatuses(
          selectedIndexes,
          isMatched ? statuses.CORRECT : statuses.WRONG
        );

        setTimeout(() => {
          isRunning = false;
          updateStatuses(
            selectedIndexes,
            isMatched ? statuses.DONE : statuses.IDLE
          );
          selectedIndexes = [];
        }, 500);
      }
    });
  });

  const appElement = document.getElementById('app');

  if (appElement) {
    appElement.appendChild(tagListElement);
  }
}

initApp();
