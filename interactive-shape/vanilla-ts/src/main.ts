import './reset.css';
import './style.css';

const BOX_DATA = [
  [1, 1, 1],
  [1, 0, 0],
  [1, 1, 1],
];

const DELAY_TIME = 1000;

function initApp() {
  let counter = 0;
  let validBoxAmount = 0;
  let isRunning = false;
  let intervalCounter = 0;

  const boxItemMap = new Map<number, HTMLButtonElement>();

  const boxGrid = document.createElement('ul');
  boxGrid.classList.add('box-grid');

  BOX_DATA.forEach((row) => {
    const rowElement = document.createElement('ul');
    rowElement.classList.add('box-row');

    boxGrid.appendChild(rowElement);

    row.forEach((cell) => {
      const cellElement = document.createElement('li');
      cellElement.classList.add('box-cell');

      const boxElement = document.createElement('button');
      boxElement.classList.add('box-item');

      cellElement.appendChild(boxElement);
      rowElement.appendChild(cellElement);

      if (cell === 0) {
        boxElement.setAttribute('data-empty', 'true');
        return;
      }

      validBoxAmount++;

      boxElement.addEventListener('click', () => {
        //* Prevent user from clicking the box while the animation is running
        //* and clicking the box that already selected
        if (isRunning || boxElement.dataset.selected === 'true') return;

        boxElement.setAttribute('data-selected', 'true');
        boxElement.textContent = `${counter + 1}`;

        boxItemMap.set(counter, boxElement);

        counter += 1;

        //* If all the box is selected, run the animation
        if (counter === validBoxAmount) {
          intervalCounter = 0;
          isRunning = true;

          const resetBox = () => {
            const boxItem = boxItemMap.get(intervalCounter);

            if (!boxItem) return;

            boxItem.removeAttribute('data-selected');
            boxItem.textContent = '';
          };

          //* To make the animation run before the interval
          resetBox();

          const intervalID = setInterval(() => {
            intervalCounter++;

            resetBox();

            //* Handle when the animation is done
            if (intervalCounter === validBoxAmount - 1) {
              clearInterval(intervalID);
              boxItemMap.clear();
              counter = 0;
              isRunning = false;
            }
          }, DELAY_TIME);
        }
      });
    });
  });

  const appElement = document.getElementById('app');

  if (appElement) {
    appElement.appendChild(boxGrid);
  }
}

initApp();
