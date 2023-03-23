const AMBIT_SLOT_COLUMNS = 9;
const AMBIT_SLOT_ROWS = 2;
const AMBITS = [
  'space',
  'sky',
  'land',
  'water'
];

const UNITS = {
  COMMAND_SHIP: {
    NAME: 'Command Ship',
    CLASS: 'unit-command-ship'
  },
  GALACTIC_BATTLESHIP: {
    NAME: 'Galactic Battleship',
    CLASS: 'unit-galactic-battleship'
  },
  SPACE_FRIGATE: {
    NAME: 'Space Frigate',
    CLASS: 'unit-space-frigate'
  },
  STAR_FIGHTER: {
    NAME: 'Star Fighter',
    CLASS: 'unit-star-fighter'
  },
  FIGHTER_JET: {
    NAME: 'Fighter Jet',
    CLASS: 'unit-fighter-jet'
  },
  HIGH_ALTITUDE_INTERCEPTOR: {
    NAME: 'High Altitude Interceptor',
    CLASS: 'unit-high-altitude-interceptor'
  },
  STEALTH_BOMBER: {
    NAME: 'Stealth Bomber',
    CLASS: 'unit-stealth-bomber'
  },
  ARTILLERY: {
    NAME: 'Artillery',
    CLASS: 'unit-artillery'
  },
  SAM_LAUNCHER: {
    NAME: 'SAM Launcher',
    CLASS: 'unit-sam-launcher'
  },
  TANK: {
    NAME: 'Tank',
    CLASS: 'unit-tank'
  },
  CRUISER: {
    NAME: 'Cruiser',
    CLASS: 'unit-cruiser'
  },
  DESTROYER: {
    NAME: 'Destroyer',
    CLASS: 'unit-destroyer'
  },
  SUB: {
    NAME: 'Sub',
    CLASS: 'unit-sub'
  }
};

/**
 * @param {string} ambit (space|sky|land|water)
 * @param {string} verticalPosition (top|middle|bottom)
 * @param {string} horizontalPosition (top|middle|bottom)
 * @param {boolean} slot
 * @param {string} innerHtml
 * @param {number|null} row
 * @param {number|null} column
 * @return {string}
 */
function renderTileHTML(
  ambit,
  verticalPosition,
  horizontalPosition,
  slot = false,
  row = null,
  column = null,
  innerHtml = ''
) {
  let slotPosition = '';
  if (row !== null && column !== null) {
    slotPosition = `id="slot-${ambit}-${row}-${column}"`
  }

  return `<div ${slotPosition} class="tile tile-${ambit}-${verticalPosition}-${horizontalPosition} ${slot ? 'slot' : ''}">${innerHtml}</div>`;
}

/**
 * @param {number} index
 * @param {number} maxIndex
 * @return {string}
 */
function getTileHorizontalPosition(index, maxIndex) {
  let horizontalPosition = 'middle';
  if (index === 0) {
    horizontalPosition = 'left';
  } else if (index === maxIndex) {
    horizontalPosition = 'right';
  }
  return horizontalPosition;
}

/**
 * @param {number} index
 * @param {number} maxIndex
 * @return {string}
 */
function getTileVerticalPosition(index, maxIndex) {
  let verticalPosition = 'middle';
  if (index === 0) {
    verticalPosition = 'top';
  } else if (index === maxIndex) {
    verticalPosition = 'bottom';
  }
  return verticalPosition;
}

/**
 * @param {string} ambit
 * @param {string} verticalPosition
 * @param {boolean} slot
 * @param {number|null} row
 * @return {string}
 */
function renderTileRowHTML(
  ambit,
  verticalPosition,
  slot = false,
  row = null
) {
  let html = '<div>';
  const maxIndex = AMBIT_SLOT_COLUMNS - 1;

  for (let i = 0; i < AMBIT_SLOT_COLUMNS; i++) {
    const horizontalPosition = getTileHorizontalPosition(i, maxIndex);
    html += renderTileHTML(ambit, verticalPosition, horizontalPosition, slot, row, i);
  }

  html += '</div>';

  return html;
}

/**
 * @param {string} ambit
 * @return {string}
 */
function renderAmbitSlotsHTML(ambit) {
  let html = '';
  const maxIndex = AMBIT_SLOT_ROWS - 1;

  for (let i = 0; i < AMBIT_SLOT_ROWS; i++) {
    const verticalPosition = getTileVerticalPosition(i, maxIndex);
    html += renderTileRowHTML(ambit, verticalPosition, true, i);
  }

  return html;
}

/**
 * @param {number} topAmbitIndex
 * @param {number} bottomAmbitIndex
 * @return {string}
 */
function renderAmbitTransitionHTML(topAmbitIndex, bottomAmbitIndex) {
  let html = '<div>';
  const topAmbit = AMBITS[topAmbitIndex];
  const bottomAmbit = AMBITS[bottomAmbitIndex] ? AMBITS[bottomAmbitIndex] : '';
  const maxIndex = AMBIT_SLOT_COLUMNS - 1;

  for (let i = 0; i < AMBIT_SLOT_COLUMNS; i++) {
    const horizontalPosition = getTileHorizontalPosition(i, maxIndex);

    let innerHtml = '';
    if (bottomAmbit) {
      innerHtml = renderTileHTML(bottomAmbit, 'edge-top', horizontalPosition, false);
    }

    html += renderTileHTML(topAmbit, 'edge-bottom', horizontalPosition, false, null, null, innerHtml);
  }

  html += '</div>';

  return html;
}

function renderMap(mapId) {
  let html = renderTileRowHTML('space', 'edge-top', true);

  for (let i = 0; i < AMBITS.length; i++) {
    html += renderAmbitSlotsHTML(AMBITS[i]);
    html += renderAmbitTransitionHTML(i, i + 1);
  }

  const map = document.getElementById(mapId);
  map.innerHTML = html;
}

/**
 * @param {string} unit
 * @param {boolean} flipHorizontally
 * @return {string}
 */
function renderUnitHTML(unit, flipHorizontally = false) {
  return `
    <div
      class="unit ${UNITS[unit].CLASS} ${flipHorizontally ? 'flipHorizontally' : ''}"
      data-bs-toggle="popover"
      data-bs-content="${UNITS[unit].NAME}"
    ></div>
  `;
}

/**
 * @param {string} unit
 * @param {string} slotPosition
 * @param {boolean} flipHorizontally
 */
function assignUnit(unit, slotPosition, flipHorizontally = false) {
  const slot = document.getElementById(slotPosition);
  slot.innerHTML = renderUnitHTML(unit, flipHorizontally);
}

renderMap('map');

assignUnit('GALACTIC_BATTLESHIP', 'slot-space-0-0');
assignUnit('GALACTIC_BATTLESHIP', 'slot-space-1-0');

assignUnit('COMMAND_SHIP', 'slot-space-0-2');
assignUnit('GALACTIC_BATTLESHIP', 'slot-space-0-3');
assignUnit('STAR_FIGHTER', 'slot-space-0-4');
assignUnit('SPACE_FRIGATE', 'slot-space-1-3');
assignUnit('STAR_FIGHTER', 'slot-space-1-4');

assignUnit('STEALTH_BOMBER', 'slot-sky-0-0');
assignUnit('STEALTH_BOMBER', 'slot-sky-1-0');

assignUnit('STEALTH_BOMBER', 'slot-sky-0-3');
assignUnit('FIGHTER_JET', 'slot-sky-0-4');
assignUnit('HIGH_ALTITUDE_INTERCEPTOR', 'slot-sky-1-3');
assignUnit('FIGHTER_JET', 'slot-sky-1-4');

assignUnit('ARTILLERY', 'slot-land-0-0');
assignUnit('ARTILLERY', 'slot-land-1-0');

assignUnit('ARTILLERY', 'slot-land-0-3');
assignUnit('TANK', 'slot-land-0-4');
assignUnit('SAM_LAUNCHER', 'slot-land-1-3');
assignUnit('TANK', 'slot-land-1-4');

assignUnit('CRUISER', 'slot-water-0-0');
assignUnit('CRUISER', 'slot-water-1-0');

assignUnit('CRUISER', 'slot-water-0-3');
assignUnit('SUB', 'slot-water-0-4');
assignUnit('DESTROYER', 'slot-water-1-3');
assignUnit('SUB', 'slot-water-1-4');



assignUnit('COMMAND_SHIP', 'slot-space-0-8', true);
assignUnit('GALACTIC_BATTLESHIP', 'slot-space-0-7', true);
assignUnit('STAR_FIGHTER', 'slot-space-0-6', true);
assignUnit('SPACE_FRIGATE', 'slot-space-1-7', true);
assignUnit('STAR_FIGHTER', 'slot-space-1-6', true);

assignUnit('STEALTH_BOMBER', 'slot-sky-0-7', true);
assignUnit('FIGHTER_JET', 'slot-sky-0-6', true);
assignUnit('HIGH_ALTITUDE_INTERCEPTOR', 'slot-sky-1-7', true);
assignUnit('FIGHTER_JET', 'slot-sky-1-6', true);

assignUnit('ARTILLERY', 'slot-land-0-7', true);
assignUnit('TANK', 'slot-land-0-6', true);
assignUnit('SAM_LAUNCHER', 'slot-land-1-7', true);
assignUnit('TANK', 'slot-land-1-6', true);

assignUnit('CRUISER', 'slot-water-0-7', true);
assignUnit('SUB', 'slot-water-0-6', true);
assignUnit('DESTROYER', 'slot-water-1-7', true);
assignUnit('SUB', 'slot-water-1-6', true);

const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl, {
    container: 'body'
  });
});
