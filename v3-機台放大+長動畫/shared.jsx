// shared.jsx — gacha state + cosmos/tarot mock content + utilities

const CAPSULE_PALETTES = [
  ['#f0c8a8', '#d4a878'], // amber dawn
  ['#a8c8f0', '#7898c8'], // dusk blue
  ['#c8b8d8', '#a898c0'], // lilac
  ['#f0e0a8', '#d4b878'], // moon gold
  ['#e8d4b8', '#c8a888'], // cream
  ['#b8c8d8', '#8898a8'], // mist
];

// Result content carries tarot-card framing data
const TAROT_RESULTS = [
  { numeral: 'I',     title: 'LA ESTRELLA',   text: '你今天的每一步，都是明天的你謝謝自己的理由。', source: '佚名' },
  { numeral: 'II',    title: 'LA LUNA',       text: '不必完美，只要真實。', source: '佚名' },
  { numeral: 'III',   title: 'EL SOL',        text: '繼續前行本身就是一種勇氣。', source: 'M. Angelou' },
  { numeral: 'IV',    title: 'EL MUNDO',      text: '慢一點沒關係，方向對就好。', source: '林婉瑜' },
  { numeral: 'V',     title: 'LA TEMPLANZA',  text: '光不會總是亮著，但它記得回來。', source: '佚名' },
  { numeral: 'VI',    title: 'LA FUERZA',     text: '你比你想像的更撐得住。', source: '佚名' },
  { numeral: 'VII',   title: 'LA JUSTICIA',   text: '把今天的自己交給明天，溫柔一點。', source: '佚名' },
  { numeral: 'VIII',  title: 'EL ERMITAÑO',   text: '靜下來，答案會自己浮上來。', source: '佚名' },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Capsule type: 50/50 orb or rune stone
function rollCapsuleType() {
  return Math.random() < 0.5 ? 'orb' : 'stone';
}

// State machine: idle → spinning → capsule → opening → result
function useGacha() {
  const [state, setState] = React.useState('idle');
  const [capsule, setCapsule] = React.useState(null);
  const [result, setResult] = React.useState(null);
  const [rolls, setRolls] = React.useState(0);

  const startGacha = React.useCallback(async () => {
    if (state !== 'idle' && state !== 'result') return;
    setResult(null);
    setCapsule(null);
    setState('spinning');
    await sleep(560);
    const colors = pickRandom(CAPSULE_PALETTES);
    const type = rollCapsuleType();
    setCapsule({ top: colors[0], bot: colors[1], type });
    setState('capsule');
  }, [state]);

  const openCapsule = React.useCallback(async () => {
    if (state !== 'capsule') return;
    setState('opening');
    await sleep(420);
    setResult(pickRandom(TAROT_RESULTS));
    setRolls((r) => r + 1);
    setState('result');
  }, [state]);

  const reset = React.useCallback(() => {
    setState('idle');
    setCapsule(null);
    setResult(null);
  }, []);

  return { state, capsule, result, rolls, startGacha, openCapsule, reset };
}

Object.assign(window, {
  useGacha,
  CAPSULE_PALETTES,
  TAROT_RESULTS,
  sleep,
  pickRandom,
});
