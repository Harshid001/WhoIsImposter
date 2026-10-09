import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { Button, Panel, Badge, Avatar, Toggle, Stepper, Toast, Modal, EmptyState } from './components/ui';
import { DemoRoomPanel } from './components/demo-room';
import { CATEGORY_NAMES, createCustomEntry } from './data/wordBank';
import {
  AVATAR_COLORS, DEFAULT_SETTINGS, MAX_PLAYERS, MIN_PLAYERS, PHASES, assignRoles, checkWin,
  displayForPlayer, makePlayers, maxImposters, normalizeNames, pickChaosEvent, pickWord,
  resolveVote, scoreRound
} from './utils/gameLogic';
import './styles.css';

const STORAGE_KEYS = { settings: 'wi-settings', names: 'wi-names', used: 'wi-used-words', scores: 'wi-scoreboard', custom: 'wi-custom-words' };

function readStorage(key, fallback) {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; } catch { return fallback; }
}
function writeStorage(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* private browsing is fine */ } }
function initialState() {
  const settings = { ...DEFAULT_SETTINGS, ...readStorage(STORAGE_KEYS.settings, {}) };
  const names = normalizeNames(readStorage(STORAGE_KEYS.names, []), settings.playerCount);
  return {
    phase: PHASES.SETUP,
    settings,
    players: makePlayers(names, settings.playerCount),
    word: null,
    usedWords: readStorage(STORAGE_KEYS.used, []),
    customWords: readStorage(STORAGE_KEYS.custom, []),
    scoreboard: readStorage(STORAGE_KEYS.scores, {}),
    dealingIndex: 0,
    revealed: false,
    isAnimating: false,
    discussionReady: false,
    timerSeconds: settings.timerMinutes * 60,
    timerRunning: false,
    votes: {},
    privateVoteIndex: 0,
    selectedVote: null,
    revoteNotice: false,
    chaosEvent: null,
    round: 1,
    firstSpeakerId: null,
    lastEjectedId: null,
    ejectionResolved: false,
    outcome: null,
    lastChanceOpen: false,
    lastChanceSeconds: 10,
    lastChanceSuccess: false,
    scoreApplied: false,
    toast: null
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_SETTING': {
      const settings = { ...state.settings, [action.key]: action.value };
      if (action.key === 'playerCount') {
        const count = action.value;
        settings.imposterCount = Math.min(settings.imposterCount, maxImposters(count));
        const names = normalizeNames(state.players.map((player) => player.name), count);
        return { ...state, settings, players: makePlayers(names, count) };
      }
      if (action.key === 'timerMinutes') return { ...state, settings, timerSeconds: action.value * 60 };
      return { ...state, settings };
    }
    case 'SET_NAME': return { ...state, players: state.players.map((player) => player.id === action.id ? { ...player, name: action.value } : player) };
    case 'LOAD_ROOM_PLAYERS': {
      const playerCount = Math.max(MIN_PLAYERS, Math.min(MAX_PLAYERS, action.names.length));
      const settings = { ...state.settings, playerCount, imposterCount: Math.min(state.settings.imposterCount, maxImposters(playerCount)) };
      return { ...state, settings, players: makePlayers(normalizeNames(action.names, playerCount), playerCount) };
    }
    case 'SHUFFLE_SEATS': {
      const shuffled = [...state.players].sort(() => Math.random() - 0.5).map((player, index) => ({ ...player, color: AVATAR_COLORS[index % AVATAR_COLORS.length] }));
      return { ...state, players: shuffled };
    }
    case 'TOGGLE_CATEGORY': {
      const category = action.category;
      if (category === 'Random') return { ...state, settings: { ...state.settings, categories: ['Random'] } };
      const withoutRandom = state.settings.categories.filter((item) => item !== 'Random');
      const categories = withoutRandom.includes(category) ? withoutRandom.filter((item) => item !== category) : [...withoutRandom, category];
      return { ...state, settings: { ...state.settings, categories: categories.length ? categories : ['Random'] } };
    }
    case 'ADD_CUSTOM_WORD': return { ...state, customWords: [...state.customWords, action.entry], toast: { message: 'Custom word added to the mission bank.', tone: 'success' } };
    case 'DEAL': {
      const roles = assignRoles(state.players.map((player) => ({ ...player, alive: true })), state.settings);
      const word = pickWord(state.settings.categories, state.usedWords, state.customWords);
      const wordKey = `${word.category}:${word.word}`;
      return {
        ...state, phase: PHASES.DEALING, players: roles.players, word, usedWords: [...new Set([...state.usedWords, wordKey])], dealingIndex: 0,
        revealed: false, isAnimating: false, discussionReady: false, timerRunning: false, timerSeconds: state.settings.timerMinutes * 60,
        votes: {}, privateVoteIndex: 0, selectedVote: null, revoteNotice: false, chaosEvent: state.settings.chaos ? pickChaosEvent() : null,
        round: 1, firstSpeakerId: roles.firstSpeakerId, lastEjectedId: null, ejectionResolved: false, outcome: null, lastChanceOpen: false, scoreApplied: false,
        toast: null
      };
    }
    case 'REVEAL': return state.isAnimating ? state : { ...state, revealed: true };
    case 'HIDE_PASS': return state.revealed && !state.isAnimating ? { ...state, revealed: false, isAnimating: true } : state;
    case 'FINISH_PASS': {
      const lastCard = state.dealingIndex >= state.players.length - 1;
      return lastCard ? { ...state, phase: PHASES.DISCUSSION, isAnimating: false, discussionReady: true } : { ...state, dealingIndex: state.dealingIndex + 1, isAnimating: false };
    }
    case 'READY_DISCUSSION': return { ...state, discussionReady: false, timerRunning: state.settings.timerMinutes > 0, firstSpeakerId: state.firstSpeakerId || state.players.find((player) => player.alive)?.id };
    case 'TICK': return state.timerRunning && state.timerSeconds > 0 ? { ...state, timerSeconds: state.timerSeconds - 1, timerRunning: state.timerSeconds > 1 } : state;
    case 'TOGGLE_TIMER': return { ...state, timerRunning: !state.timerRunning && state.timerSeconds > 0 };
    case 'ADD_TIME': return { ...state, timerSeconds: state.timerSeconds + 30 };
    case 'START_VOTING': return { ...state, phase: PHASES.VOTING, timerRunning: false, votes: {}, privateVoteIndex: 0, selectedVote: null, revoteNotice: false };
    case 'SELECT_VOTE': return { ...state, selectedVote: action.id };
    case 'SUBMIT_HOST_VOTE': {
      const votes = action.id === 'skip' ? { host: 'skip' } : { host: action.id };
      return { ...state, votes, phase: PHASES.EJECTION, ejectionResolved: false, lastEjectedId: action.id === 'skip' ? null : action.id };
    }
    case 'SUBMIT_PRIVATE_VOTE': {
      const living = state.players.filter((player) => player.alive);
      const voter = living[state.privateVoteIndex];
      const votes = { ...state.votes, [voter.id]: action.id };
      const lastVoter = state.privateVoteIndex >= living.length - 1;
      if (!lastVoter) return { ...state, votes, privateVoteIndex: state.privateVoteIndex + 1, selectedVote: null };
      const result = resolveVote(votes, state.players, state.settings.tieRule);
      if (result.revote) return { ...state, votes: {}, privateVoteIndex: 0, selectedVote: null, revoteNotice: true };
      return { ...state, votes, phase: PHASES.EJECTION, ejectionResolved: false, lastEjectedId: result.ejectedId };
    }
    case 'REVEAL_EJECTION': return { ...state, ejectionResolved: true };
    case 'OPEN_LAST_CHANCE': return { ...state, lastChanceOpen: true, lastChanceSeconds: 10 };
    case 'LAST_CHANCE_TICK': return state.lastChanceOpen && state.lastChanceSeconds > 0 ? { ...state, lastChanceSeconds: state.lastChanceSeconds - 1 } : state;
    case 'RESOLVE_LAST_CHANCE': return { ...state, lastChanceOpen: false, lastChanceSuccess: action.success, outcome: action.success ? 'imposters' : 'crew' };
    case 'CONTINUE_ROUND': {
      const living = state.players.filter((player) => player.alive);
      const currentIndex = living.findIndex((player) => player.id === state.firstSpeakerId);
      const nextSpeaker = living[(currentIndex + 1 + living.length) % living.length] || living[0];
      return { ...state, phase: PHASES.DISCUSSION, round: state.round + 1, firstSpeakerId: nextSpeaker?.id, timerSeconds: state.settings.timerMinutes * 60, timerRunning: state.settings.timerMinutes > 0, lastEjectedId: null, ejectionResolved: false, outcome: null };
    }
    case 'APPLY_EJECTION': {
      const target = state.players.find((player) => player.id === state.lastEjectedId);
      if (!target) return { ...state, phase: PHASES.DISCUSSION, ejectionResolved: true };
      const players = state.players.map((player) => player.id === target.id ? { ...player, alive: false } : player);
      const result = checkWin(players);
      const needsLastChance = target.role === 'imposter' && result.winner === 'crew' && state.settings.lastChance;
      return { ...state, players, ejectionResolved: true, outcome: result.winner, lastChanceOpen: needsLastChance, lastChanceSeconds: 10, phase: PHASES.EJECTION };
    }
    case 'FINALIZE_RESULT': return { ...state, phase: PHASES.RESULT, scoreApplied: false };
    case 'APPLY_SCORE': {
      if (state.scoreApplied || !state.outcome) return state;
      const delta = scoreRound(state.players, state.lastEjectedId, state.outcome, state.lastChanceSuccess);
      const scoreboard = { ...state.scoreboard };
      state.players.forEach((player) => { scoreboard[player.name] = (scoreboard[player.name] || 0) + (delta[player.id] || 0); });
      return { ...state, scoreboard, scoreApplied: true };
    }
    case 'PLAY_AGAIN': return reducer({ ...state, phase: PHASES.SETUP }, { type: 'DEAL' });
    case 'GO_HOME': return { ...state, ...initialState(), players: makePlayers(state.players.map((player) => player.name), state.players.length), settings: state.settings };
    case 'SHOW_SCOREBOARD': return { ...state, phase: PHASES.SCOREBOARD };
    case 'DISMISS_TOAST': return { ...state, toast: null };
    case 'SET_TOAST': return { ...state, toast: action.toast };
    case 'RESET_SCORES': return { ...state, scoreboard: {} };
    default: return state;
  }
}

function formatTime(seconds) { return `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`; }
function playTone(kind = 'tap') {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    if (kind === 'flip') {
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(420, now);
      oscillator.frequency.exponentialRampToValueAtTime(780, now + 0.22);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start(now);
      oscillator.stop(now + 0.22);
      return;
    }

    if (kind === 'flipBack') {
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(680, now);
      oscillator.frequency.exponentialRampToValueAtTime(360, now + 0.14);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start(now);
      oscillator.stop(now + 0.14);
      return;
    }

    const tones = {
      tap: { frequency: 440, type: 'triangle', duration: 0.09 },
      reveal: { frequency: 660, type: 'sine', duration: 0.24 },
      vote: { frequency: 520, type: 'triangle', duration: 0.12 },
      win: { frequency: 880, type: 'sine', duration: 0.28 },
      danger: { frequency: 180, type: 'square', duration: 0.16 }
    };
    const tone = tones[kind] || tones.tap;
    oscillator.frequency.value = tone.frequency;
    oscillator.type = tone.type;
    gain.gain.setValueAtTime(0.045, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + tone.duration);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start(now);
    oscillator.stop(now + tone.duration);
  } catch { /* sound is an enhancement, never a blocker */ }
}

function useWakeLock(active) {
  const lock = useRef(null);
  useEffect(() => {
    if (!active || !('wakeLock' in navigator)) return undefined;
    navigator.wakeLock.request('screen').then((wakeLock) => { lock.current = wakeLock; }).catch(() => {});
    return () => { lock.current?.release?.(); lock.current = null; };
  }, [active]);
}

function Header({ state, dispatch }) {
  return <header className="topbar"><button className="brand" onClick={() => dispatch({ type: 'GO_HOME' })} aria-label="Return to setup"><span className="brand-orbit" aria-hidden="true">◒</span><span><b>WHO IS</b><strong>IMPOSTER?</strong></span></button><div className="mission-status" aria-label={`Current phase ${state.phase}`}><span className="status-dot" /> {state.phase === PHASES.SETUP ? 'Game setup' : `Round ${state.round}`}</div><div className="top-actions"><button className="icon-button" onClick={() => dispatch({ type: 'SET_SETTING', key: 'theme', value: state.settings.theme === 'dark' ? 'neon' : 'dark' })} aria-label="Switch visual theme">{state.settings.theme === 'dark' ? '◐' : '☼'}</button><button className="score-link" onClick={() => dispatch({ type: 'SHOW_SCOREBOARD' })}>Scoreboard <span>↗</span></button></div></header>;
}

function SectionHeading({ eyebrow, title, text, action }) { return <div className="section-heading"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{text ? <p>{text}</p> : null}</div>{action}</div>; }

function SetupScreen({ state, dispatch }) {
  const [customWord, setCustomWord] = useState({ word: '', hint: '', hardHint: '' });
  const [showHow, setShowHow] = useState(false);
  const canDeal = state.players.every((player) => player.name.trim()) && state.settings.categories.length > 0;
  const addCustom = () => {
    if (customWord.word.trim().length < 2 || customWord.hint.trim().length < 2) { dispatch({ type: 'SET_TOAST', toast: { message: 'Add a word and a related one-word hint first.', tone: 'danger' } }); return; }
    dispatch({ type: 'ADD_CUSTOM_WORD', entry: createCustomEntry(customWord.word, customWord.hint, customWord.hardHint) }); setCustomWord({ word: '', hint: '', hardHint: '' });
  };
  return <main className="page setup-page"><section className="hero-copy"><span className="eyebrow">PASS-AND-PLAY • 3–12 PLAYERS</span><h1>Someone is bluffing.<br /><em>Make them sweat.</em></h1><p className="hero-lede">A social word-deduction game for friends who can’t keep a straight face. One shared screen. One secret word. Plenty of suspicious clues.</p><div className="hero-actions"><Button icon="✦" onClick={() => document.getElementById('players-panel')?.scrollIntoView({ behavior: 'smooth' })}>Set up the game</Button><button className="text-button" onClick={() => setShowHow((value) => !value)}>How to play <span>{showHow ? '↑' : '↓'}</span></button></div><div className="alert-card"><span className="alert-icon">!</span><div><strong>Pass the screen, keep the secret.</strong><p>Only the current player should peek at their role card.</p></div></div><div className="orbit-art" aria-hidden="true"><div className="planet planet-large">◒</div><div className="planet planet-small">✦</div><div className="orbit-ring ring-one" /><div className="orbit-ring ring-two" /><span className="orbit-star star-one">✦</span><span className="orbit-star star-two">·</span><span className="orbit-star star-three">✧</span></div>{showHow ? <Panel className="how-panel"><div className="how-step"><span>01</span><div><strong>Deal the secrets</strong><p>Everyone sees a role card. Crew sees the word; imposters only get a hint.</p></div></div><div className="how-step"><span>02</span><div><strong>Trade suspicious clues</strong><p>Give one clue each, then debate which player is faking it.</p></div></div><div className="how-step"><span>03</span><div><strong>Vote someone into space</strong><p>Eject imposters before they reach parity with the crew.</p></div></div></Panel> : null}</section><section id="players-panel" className="setup-cockpit"><DemoRoomPanel state={state} dispatch={dispatch} /><Panel className="players-panel"><SectionHeading eyebrow="Before we start" title="Who’s playing?" text="Add 3–12 players. The screen will be passed around during dealing." action={<button className="text-button" onClick={() => dispatch({ type: 'SHUFFLE_SEATS' })}>Shuffle seating ↻</button>} /><div className="player-list">{state.players.map((player, index) => <label className="player-input" key={player.id}><span className="player-index">{String(index + 1).padStart(2, '0')}</span><input value={player.name} maxLength={18} onChange={(event) => dispatch({ type: 'SET_NAME', id: player.id, value: event.target.value })} aria-label={`Player ${index + 1} name`} /><span className="input-check">✓</span></label>)}</div><Stepper label="Players" value={state.settings.playerCount} min={MIN_PLAYERS} max={MAX_PLAYERS} onChange={(value) => dispatch({ type: 'SET_SETTING', key: 'playerCount', value })} hint="More friends, more alibis" /></Panel><Panel className="settings-panel"><SectionHeading eyebrow="Game settings" title="Make it yours" text="Every setting is saved on this device." /><div className="settings-grid"><Stepper label="Imposters" value={state.settings.imposterCount} min={1} max={maxImposters(state.settings.playerCount)} onChange={(value) => dispatch({ type: 'SET_SETTING', key: 'imposterCount', value })} hint={`Up to ${maxImposters(state.settings.playerCount)} at this crew size`} /><Toggle label="Random imposters" checked={state.settings.randomImposters} onChange={(value) => dispatch({ type: 'SET_SETTING', key: 'randomImposters', value })} hint="Keep the count unpredictable" /></div><div className="form-field"><label htmlFor="difficulty">Clue difficulty</label><select id="difficulty" value={state.settings.difficulty} onChange={(event) => dispatch({ type: 'SET_SETTING', key: 'difficulty', value: event.target.value })}><option>Easy</option><option>Medium</option><option>Hard</option></select></div><div className="form-field"><label htmlFor="timer">Discussion timer</label><select id="timer" value={state.settings.timerMinutes} onChange={(event) => dispatch({ type: 'SET_SETTING', key: 'timerMinutes', value: Number(event.target.value) })}><option value="0">Off</option><option value="1">1 minute</option><option value="2">2 minutes</option><option value="3">3 minutes</option><option value="5">5 minutes</option></select></div><div className="chip-group"><span className="field-label">Secret categories</span><div className="chips">{CATEGORY_NAMES.map((category) => <button key={category} className={`chip ${state.settings.categories.includes(category) ? 'chip-active' : ''}`} onClick={() => dispatch({ type: 'TOGGLE_CATEGORY', category })}>{category === 'Random' ? '✦ ' : ''}{category}</button>)}</div></div><div className="settings-divider" /><div className="form-field"><label htmlFor="mode">Game mode</label><select id="mode" value={state.settings.mode} onChange={(event) => dispatch({ type: 'SET_SETTING', key: 'mode', value: event.target.value })}><option>Classic</option><option>Blind Imposter</option><option>Spy Twist</option></select></div><div className="settings-grid compact"><Toggle label="Detective role" checked={state.settings.detective} onChange={(value) => dispatch({ type: 'SET_SETTING', key: 'detective', value })} hint="One question in round one" /><Toggle label="Chaos events" checked={state.settings.chaos} onChange={(value) => dispatch({ type: 'SET_SETTING', key: 'chaos', value })} hint="Surprises between rounds" /><Toggle label="Last-chance guess" checked={state.settings.lastChance} onChange={(value) => dispatch({ type: 'SET_SETTING', key: 'lastChance', value })} hint="Final imposter gets 10 seconds" /><Toggle label="Imposters know each other" checked={state.settings.impostersKnowEachOther} onChange={(value) => dispatch({ type: 'SET_SETTING', key: 'impostersKnowEachOther', value })} hint="Show their allies" /><Toggle label="Show category" checked={state.settings.showCategory} onChange={(value) => dispatch({ type: 'SET_SETTING', key: 'showCategory', value })} /><Toggle label="Show imposter count" checked={state.settings.showImposterCount} onChange={(value) => dispatch({ type: 'SET_SETTING', key: 'showImposterCount', value })} /><Toggle label="Private voting" checked={state.settings.privateVoting} onChange={(value) => dispatch({ type: 'SET_SETTING', key: 'privateVoting', value })} hint="Pass the screen for each vote" /><Toggle label="Touch & hold card" checked={state.settings.holdToReveal} onChange={(value) => dispatch({ type: 'SET_SETTING', key: 'holdToReveal', value })} hint="Hold to peek role, release to hide" /><Toggle label="Sound effects" checked={state.settings.sound} onChange={(value) => dispatch({ type: 'SET_SETTING', key: 'sound', value })} /></div><div className="form-field"><label htmlFor="tie">Tie-break rule</label><select id="tie" value={state.settings.tieRule} onChange={(event) => dispatch({ type: 'SET_SETTING', key: 'tieRule', value: event.target.value })}><option value="none">Tie = no ejection</option><option value="revote">Tie = revote</option></select></div><Button className="deal-button" icon="🚀" disabled={!canDeal} onClick={() => { if (state.settings.sound) playTone('reveal'); dispatch({ type: 'DEAL' }); }}>Deal the secrets <span className="button-arrow">→</span></Button></Panel><Panel className="custom-panel"><SectionHeading eyebrow="Make it yours" title="Add custom words" text="Create a tiny local category for inside jokes." /><div className="custom-form"><input placeholder="Secret word" value={customWord.word} onChange={(event) => setCustomWord({ ...customWord, word: event.target.value })} /><input placeholder="Easy hint" value={customWord.hint} onChange={(event) => setCustomWord({ ...customWord, hint: event.target.value })} /><input placeholder="Hard hint (optional)" value={customWord.hardHint} onChange={(event) => setCustomWord({ ...customWord, hardHint: event.target.value })} /><Button variant="secondary" onClick={addCustom}>Add to bank</Button></div>{state.customWords.length ? <p className="custom-count">{state.customWords.length} custom word{state.customWords.length === 1 ? '' : 's'} ready to deploy.</p> : null}</Panel></section></main>;
}

function PhaseRail({ state }) { const phases = ['DEALING', 'DISCUSSION', 'VOTING', 'EJECTION']; return <div className="phase-rail">{phases.map((phase, index) => <div key={phase} className={`phase-step ${state.phase === phase ? 'current' : ''} ${phases.indexOf(state.phase) > index ? 'done' : ''}`}><span>{String(index + 1).padStart(2, '0')}</span>{phase}</div>)}</div>; }

function DealScreen({ state, dispatch }) {
  const player = state.players[state.dealingIndex];
  const nextPlayer = state.players[state.dealingIndex + 1];
  const isLastCard = state.dealingIndex >= state.players.length - 1;
  const roleCard = player && state.word ? displayForPlayer(player, state.word, state.settings, state.players) : null;

  const [isHolding, setIsHolding] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [hasViewed, setHasViewed] = useState(false);
  const [shake, setShake] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsHolding(false);
    setIsLocked(false);
    setHasViewed(false);
    setShake(false);
    setIsTransitioning(false);
  }, [state.dealingIndex]);

  useEffect(() => {
    if (!isHolding) return undefined;
    const releaseHold = () => {
      setIsHolding(false);
      if (state.settings.sound && !isLocked) playTone('flipBack');
    };
    window.addEventListener('pointerup', releaseHold);
    window.addEventListener('pointercancel', releaseHold);
    window.addEventListener('touchend', releaseHold);
    window.addEventListener('mouseup', releaseHold);
    return () => {
      window.removeEventListener('pointerup', releaseHold);
      window.removeEventListener('pointercancel', releaseHold);
      window.removeEventListener('touchend', releaseHold);
      window.removeEventListener('mouseup', releaseHold);
    };
  }, [isHolding, isLocked, state.settings.sound]);

  const isFlipped = isHolding || isLocked;
  const progress = ((state.dealingIndex + (hasViewed ? 1 : 0)) / state.players.length) * 100;

  const handlePointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    if (isTransitioning) return;

    if (e.currentTarget?.setPointerCapture && e.pointerId !== undefined) {
      try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
    }

    if (!isHolding) {
      setIsHolding(true);
      setHasViewed(true);
      if (state.settings.sound) playTone('flip');
      if (state.settings.vibration && typeof navigator !== 'undefined' && navigator.vibrate) {
        try { navigator.vibrate(35); } catch {}
      }
    }
  };

  const handlePointerUp = () => {
    if (isHolding) {
      setIsHolding(false);
      if (state.settings.sound && !isLocked) playTone('flipBack');
      if (state.settings.vibration && typeof navigator !== 'undefined' && navigator.vibrate) {
        try { navigator.vibrate(15); } catch {}
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (!isHolding) {
        setIsHolding(true);
        setHasViewed(true);
        if (state.settings.sound) playTone('flip');
      }
    }
  };

  const handleKeyUp = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      setIsHolding(false);
      if (state.settings.sound && !isLocked) playTone('flipBack');
    }
  };

  const handlePass = () => {
    if (isTransitioning) return;
    if (!hasViewed) {
      setShake(true);
      setTimeout(() => setShake(false), 460);
      if (state.settings.sound) playTone('danger');
      dispatch({
        type: 'SET_TOAST',
        toast: { message: `Touch and hold the card to reveal ${player.name}'s role first!`, tone: 'warning' }
      });
      return;
    }

    if (state.settings.sound) playTone('tap');
    setIsTransitioning(true);
    setIsHolding(false);
    setIsLocked(false);
    setTimeout(() => {
      dispatch({ type: 'FINISH_PASS' });
    }, 280);
  };

  if (!player || !roleCard) return null;

  return (
    <main className="page play-page">
      <PhaseRail state={state} />
      <section className="deal-stage">
        <div className="deal-meta">
          <span className="eyebrow">Private transmission</span>
          <strong>Card {state.dealingIndex + 1} <small>of {state.players.length}</small></strong>
          <div className="progress-track">
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className={`deal-card-scene ${shake ? 'card-shake' : ''} ${isTransitioning ? 'card-dealing-transition' : ''}`}>
          <div
            className={`deal-card-3d ${isFlipped ? 'is-flipped' : ''} ${isHolding ? 'is-holding' : ''}`}
            tabIndex={0}
            role="button"
            aria-label={isFlipped ? "Secret identity revealed. Release hold to flip back." : `Cover card for ${player.name}. Touch and hold to reveal identity.`}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            onContextMenu={(e) => e.preventDefault()}
          >
            {/* FRONT FACE: Default Cover Card */}
            <div className="deal-card-face deal-card-front pass-panel">
              <div className="card-reveal-header">
                <Badge tone="neutral">Private transmission</Badge>
                <span className="card-lock-badge">🔒 Hidden</span>
              </div>

              <div className="cover-player-section">
                <span className="eyebrow">Hand device to</span>
                <h1 className="cover-player-name">{player.name}</h1>
                <div className="cover-avatar-wrap">
                  <Avatar player={player} size="lg" />
                </div>
              </div>

              {/* Touch & Hold Biometric Scanner Pad */}
              <div className="hold-scanner-pad">
                <div className="scanner-beacon">
                  <span className="radar-ring" />
                  <span className="radar-ring ring-two" />
                  <span className="scanner-beacon-icon">👆</span>
                </div>
                <div className="scanner-text-group">
                  <strong className="scanner-title">Touch & Hold Card</strong>
                  <span className="scanner-sub">Hold down to reveal identity • Release to hide</span>
                </div>
              </div>

              <div className="cover-footer-note">
                <span className="privacy-note">
                  {hasViewed ? 'Identity viewed ✓ · Hold again anytime to review' : 'Secret only displays while finger is held on screen'}
                </span>
                {hasViewed ? (
                  <div className="viewed-badge">✓ Role inspected · Hidden safely</div>
                ) : null}
              </div>
            </div>

            {/* BACK FACE: Secret Identity Reveal */}
            <div className={`deal-card-face deal-card-back secret-card role-${roleCard.tone} secret-${roleCard.tone}`}>
              <div className="card-reveal-header">
                <span className={`role-pill role-pill-${roleCard.tone}`}>
                  {roleCard.tone === 'imposter' ? '👾 Threat Signal' : roleCard.tone === 'crew' ? '🧑‍🚀 Crew Signal' : '✦ Special Role'}
                </span>
                <span className="live-peek-indicator">
                  <span className="pulse-dot" /> {isLocked ? 'Pinned Open' : 'Live Peek'}
                </span>
              </div>

              <div className="role-reveal-body">
                <div className={`role-hero-title role-hero-${roleCard.tone}`}>
                  {roleCard.title}
                </div>

                <div className={`secret-transmission-box secret-box-${roleCard.tone}`}>
                  <span className="transmission-label">{roleCard.label}</span>
                  <strong className="transmission-word">{roleCard.secret}</strong>
                  {roleCard.category ? (
                    <span className="transmission-category">Category · {roleCard.category}</span>
                  ) : null}
                </div>

                <p className="role-mission-desc">{roleCard.subline}</p>

                {roleCard.allies?.length ? (
                  <div className="allies-warning-box">
                    <span>Other Imposters:</span> <strong>{roleCard.allies.join(', ')}</strong>
                  </div>
                ) : null}
              </div>

              <div className="release-cue-banner">
                <span>✋</span> {isLocked ? 'Pinned open · Click toggle below to hide' : 'Release hold to flip back & hide secret'}
              </div>
            </div>
          </div>
        </div>

        {/* Pass Device Controls */}
        <div className="deal-controls-bar">
          <Button
            className="deal-pass-button"
            variant={hasViewed ? 'primary' : 'secondary'}
            onClick={handlePass}
            disabled={isTransitioning}
            icon={isLastCard ? '🚀' : '👤'}
          >
            {isLastCard
              ? 'Everyone ready • Start discussion →'
              : `Done • Pass to ${nextPlayer?.name || 'next player'} →`}
          </Button>

          <div className={`deal-status-hint ${hasViewed ? 'is-viewed' : ''}`}>
            {hasViewed ? (
              <span><span className="status-dot" style={{ background: 'var(--mint)' }} /> Card is flipped back & safe to hand over</span>
            ) : (
              <span><span className="status-dot" /> Press & hold the card above before passing</span>
            )}
          </div>

          <button
            type="button"
            className="deal-lock-toggle"
            onClick={() => setIsLocked((prev) => !prev)}
            aria-label="Toggle stay revealed hands-free mode"
          >
            {isLocked ? '🔓 Switch back to Touch & Hold gesture' : '📌 Need hands-free? Keep card revealed'}
          </button>
        </div>

        <div className="deal-footer">
          <span><span className="status-dot" /> Secret stays on this device</span>
          {state.settings.showImposterCount && state.word ? (
            <span>{state.players.filter((candidate) => candidate.role === 'imposter').length} imposter{state.players.filter((candidate) => candidate.role === 'imposter').length === 1 ? '' : 's'} in the shadows</span>
          ) : null}
        </div>
      </section>
    </main>
  );
}

function DiscussionScreen({ state, dispatch }) {
  const living = state.players.filter((player) => player.alive);
  const first = state.players.find((player) => player.id === state.firstSpeakerId) || living[0];
  const prompts = ['Give a one-word clue.', 'Describe it without saying what it is.', 'What would you find near it?'];
  return <main className="page play-page"><PhaseRail state={state} /><SectionHeading eyebrow={`Round ${state.round} • Discussion`} title="Trade clues. Read the room." text="Everyone gives one clue. The first speaker sets the temperature." action={state.settings.timerMinutes > 0 ? <div className={`timer ${state.timerSeconds <= 10 && state.timerSeconds > 0 ? 'timer-danger' : ''} ${state.timerSeconds === 0 ? 'timer-done' : ''}`}><span>◷</span><strong>{state.timerSeconds === 0 ? 'TIME’S UP' : formatTime(state.timerSeconds)}</strong><div><button onClick={() => dispatch({ type: 'TOGGLE_TIMER' })}>{state.timerRunning ? 'Pause' : 'Start'}</button><button onClick={() => dispatch({ type: 'ADD_TIME' })}>+30s</button></div></div> : <Badge tone="neutral">Timer off</Badge>} />{state.chaosEvent ? <Panel className="chaos-card"><span className="chaos-icon">✹</span><div><span className="eyebrow">Chaos event</span><h3>{state.chaosEvent}</h3></div><Badge tone="warning">This round</Badge></Panel> : null}<div className="discussion-grid"><Panel className="speaker-panel"><div className="panel-title-row"><div><span className="eyebrow">Speaking order</span><h3>Who goes first?</h3></div><Badge tone="crew">{first?.name}</Badge></div><div className="speaker-list">{living.map((player, index) => <div className={`speaker-row ${player.id === first?.id ? 'speaker-first' : ''}`} key={player.id}><span className="speaker-number">{index + 1}</span><Avatar player={player} size="sm" /><strong>{player.name}</strong>{player.id === first?.id ? <Badge tone="crew">First clue</Badge> : null}</div>)}</div></Panel><div className="prompt-stack">{prompts.map((prompt, index) => <Panel className="prompt-card" key={prompt}><span className="prompt-number">0{index + 1}</span><p>{prompt}</p><span className="prompt-arrow">↗</span></Panel>)}<Button className="full-button" icon="⚖" onClick={() => dispatch({ type: 'START_VOTING' })}>Start voting <span className="button-arrow">→</span></Button></div></div></main>;
}

function VotingScreen({ state, dispatch }) {
  const living = state.players.filter((player) => player.alive);
  const currentVoter = living[state.privateVoteIndex];
  const [confirmOpen, setConfirmOpen] = useState(false);
  const selectedPlayer = state.players.find((player) => player.id === state.selectedVote);
  const submit = (id) => {
    if (state.settings.sound) playTone('vote');
    if (state.settings.privateVoting) dispatch({ type: 'SUBMIT_PRIVATE_VOTE', id }); else { dispatch({ type: 'SUBMIT_HOST_VOTE', id }); setConfirmOpen(false); }
  };
  return <main className="page play-page"><PhaseRail state={state} /><SectionHeading eyebrow="The council is live" title={state.settings.privateVoting ? `Vote privately, ${currentVoter?.name}.` : 'Who is faking it?'} text={state.settings.privateVoting ? 'Pass the screen after every vote. The tally stays hidden until everyone has voted.' : 'Tap the group’s chosen player. A skip is allowed, but it gives the imposters another breath.'} action={<Badge tone="warning">{state.settings.privateVoting ? `Vote ${state.privateVoteIndex + 1} of ${living.length}` : 'Host vote'}</Badge>} />{state.revoteNotice ? <div className="notice notice-warning"><span>↻</span><div><strong>Tie vote — no signal.</strong><p>Break the tie with a private revote.</p></div></div> : null}<div className="vote-grid">{living.map((player) => <button key={player.id} className={`vote-card ${state.selectedVote === player.id ? 'vote-selected' : ''}`} onClick={() => dispatch({ type: 'SELECT_VOTE', id: player.id })}><Avatar player={player} size="lg" /><strong>{player.name}</strong><span>{player.id === state.firstSpeakerId ? 'First speaker' : 'Crew manifest'}</span><span className="vote-check">{state.selectedVote === player.id ? '✓' : '+'}</span></button>)}<button className={`vote-card vote-skip ${state.selectedVote === 'skip' ? 'vote-selected' : ''}`} onClick={() => dispatch({ type: 'SELECT_VOTE', id: 'skip' })}><span className="skip-icon">∅</span><strong>Skip vote</strong><span>No one leaves</span><span className="vote-check">{state.selectedVote === 'skip' ? '✓' : '+'}</span></button></div><div className="vote-footer"><span className="privacy-note">{state.settings.privateVoting ? 'Your choice is locked in privately.' : 'The host is the only one touching the final vote.'}</span><Button disabled={!state.selectedVote} onClick={() => { if (state.settings.privateVoting) submit(state.selectedVote); else setConfirmOpen(true); }}>{state.settings.privateVoting ? 'Lock in vote' : 'Confirm ejection'} <span className="button-arrow">→</span></Button></div>{confirmOpen ? <Modal title={selectedPlayer ? `Eject ${selectedPlayer.name}?` : 'Skip this vote?'} onClose={() => setConfirmOpen(false)} actions={<><Button variant="secondary" onClick={() => setConfirmOpen(false)}>Go back</Button><Button variant={selectedPlayer ? 'danger' : 'primary'} onClick={() => submit(state.selectedVote)}>{selectedPlayer ? 'Eject player' : 'Skip vote'}</Button></>}><p>{selectedPlayer ? 'Their role will be revealed to everyone. Make sure the group is ready for the truth.' : 'No one will be ejected this round.'}</p></Modal> : null}</main>;
}

function EjectionScreen({ state, dispatch }) {
  const target = state.players.find((player) => player.id === state.lastEjectedId);
  const [guess, setGuess] = useState('');
  useEffect(() => {
    if (!state.lastChanceOpen) return undefined;
    const id = setInterval(() => dispatch({ type: 'LAST_CHANCE_TICK' }), 1000);
    return () => clearInterval(id);
  }, [state.lastChanceOpen, dispatch]);
  useEffect(() => {
    if (state.lastChanceOpen && state.lastChanceSeconds <= 0) dispatch({ type: 'RESOLVE_LAST_CHANCE', success: false });
  }, [state.lastChanceOpen, state.lastChanceSeconds, dispatch]);
  useEffect(() => {
    if (state.phase === PHASES.EJECTION && state.lastEjectedId && !state.ejectionResolved) {
      const id = setTimeout(() => dispatch({ type: 'APPLY_EJECTION' }), 380);
      return () => clearTimeout(id);
    }
  }, [state.phase, state.lastEjectedId, state.ejectionResolved, dispatch]);
  const canContinue = state.outcome && !state.lastChanceOpen;
  const imposterCount = state.players.filter((player) => player.alive && player.role === 'imposter').length;
  if (!target) return <main className="page play-page"><div className="ejection-empty"><div className="eject-icon">∅</div><span className="eyebrow">Council result</span><h1>No one was ejected.</h1><p>The ship stays crowded. Everyone is still alive — for now.</p><Button onClick={() => dispatch({ type: 'CONTINUE_ROUND' })}>Continue to round {state.round + 1} <span className="button-arrow">→</span></Button></div></main>;
  const roleLabel = target.role === 'imposter' ? 'was an IMPOSTER!' : target.role === 'jester' ? 'was the JESTER!' : 'was a Crewmate…';
  const tone = target.role === 'imposter' ? 'imposter' : target.role === 'jester' ? 'jester' : 'crew';
  return <main className="page play-page ejection-page"><div className={`ejection-spotlight tone-${tone}`}><div className="eject-ship" aria-hidden="true">🚀</div><span className="eyebrow">Ejection confirmed</span><div className="eject-avatar"><Avatar player={target} size="xl" /></div><h1>{target.name} <em>{roleLabel}</em></h1><p>{target.role === 'imposter' ? 'The crew caught a signal in the noise.' : target.role === 'jester' ? 'Exactly as planned. The Jester steals the win.' : 'The signal was clean. The suspicion was not.'}</p><div className="ejection-stat"><span>Imposters remaining</span><strong>{imposterCount}</strong></div></div>{state.lastChanceOpen ? <Panel className="last-chance-card"><div className="last-chance-timer">00:{String(state.lastChanceSeconds).padStart(2, '0')}</div><div><span className="eyebrow">Last-chance guess</span><h2>One final shot to steal the win.</h2><p>{target.name} was the final imposter. Guess the secret word before the airlock closes.</p><div className="guess-row"><input autoFocus value={guess} onChange={(event) => setGuess(event.target.value)} placeholder="Type the secret word" /><Button disabled={!guess.trim()} onClick={() => dispatch({ type: 'RESOLVE_LAST_CHANCE', success: guess.trim().toLowerCase() === state.word.word.toLowerCase() })}>Guess</Button></div></div></Panel> : null}{state.ejectionResolved && !state.lastChanceOpen ? <div className="ejection-actions">{canContinue ? <><p className="outcome-tease">{state.outcome === 'crew' ? 'Crew has the advantage.' : 'The imposters control the ship.'}</p><Button onClick={() => dispatch({ type: 'FINALIZE_RESULT' })}>See the verdict <span className="button-arrow">→</span></Button></> : <Button onClick={() => dispatch({ type: 'CONTINUE_ROUND' })}>Continue to round {state.round + 1} <span className="button-arrow">→</span></Button>}</div> : null}</main>;
}

function ResultScreen({ state, dispatch, setToast }) {
  useEffect(() => { dispatch({ type: 'APPLY_SCORE' }); }, [dispatch]);
  const crewWon = state.outcome === 'crew';
  const jester = state.players.find((player) => player.role === 'jester' && player.id === state.lastEjectedId);
  const firstEjected = state.players.find((player) => !player.alive);
  const mvp = [...state.players].sort((a, b) => (state.scoreboard[b.name] || 0) - (state.scoreboard[a.name] || 0))[0];
  const share = async () => { const text = `Who is Imposter? — ${crewWon ? 'Crew wins' : 'Imposters win'}! Secret word was ${state.word.word}.`; try { await navigator.clipboard?.writeText(text); setToast({ message: 'Result copied to clipboard.', tone: 'success' }); } catch { setToast({ message: text, tone: 'info' }); } };
  return <main className="page play-page result-page"><div className={`result-hero ${crewWon ? 'result-crew' : 'result-imposters'}`}><div className="result-sparkles" aria-hidden="true">✦ · ✧ · ✦</div><span className="eyebrow">Mission complete</span><h1>{crewWon ? 'Crew wins.' : 'Imposters win.'}</h1><p>{crewWon ? 'The signal is clear. The liars are out of the airlock.' : 'The imposters blended in until the numbers turned.'}</p></div><div className="result-grid"><Panel className="reveal-panel"><SectionHeading eyebrow="The truth" title="The secret transmission" /><div className="truth-word"><span>Secret word</span><strong>{state.word?.word}</strong><small>{state.word?.category} · Imposter hint: {state.word?.hint}</small></div><div className="role-roster">{state.players.map((player) => <div className="role-row" key={player.id}><Avatar player={player} size="sm" muted={!player.alive} /><span><strong>{player.name}</strong><small>{player.alive ? 'Survived' : 'Ejected'}</small></span><Badge tone={player.role === 'imposter' ? 'imposter' : player.role === 'jester' ? 'jester' : player.isDetective ? 'detective' : 'crew'}>{player.role === 'imposter' ? 'Imposter' : player.role === 'jester' ? 'Jester' : player.isDetective ? 'Detective' : 'Crewmate'}</Badge></div>)}</div></Panel><Panel className="stats-panel"><SectionHeading eyebrow="Flight recorder" title="The receipts" /><div className="stat-grid"><div><span>Rounds</span><strong>{state.round}</strong></div><div><span>First out</span><strong>{firstEjected?.name || 'Nobody'}</strong></div><div><span>MVP</span><strong>{mvp?.name || 'Crew'}</strong></div><div><span>Last chance</span><strong>{state.lastChanceSuccess ? 'Stolen' : jester ? 'Jester' : 'Nope'}</strong></div></div><div className="result-actions"><Button icon="🚀" onClick={() => dispatch({ type: 'PLAY_AGAIN' })}>Play again</Button><Button variant="secondary" onClick={() => dispatch({ type: 'GO_HOME' })}>Rematch settings</Button><button className="text-button" onClick={share}>Share result ↗</button></div></Panel></div></main>;
}

function ScoreboardScreen({ state, dispatch }) {
  const entries = Object.entries(state.scoreboard).sort(([, a], [, b]) => b - a);
  return <main className="page scoreboard-page"><SectionHeading eyebrow="Across all missions" title="The scoreboard" text="Points stay on this device. Reset any time before the next game." action={<Button variant="secondary" onClick={() => dispatch({ type: 'GO_HOME' })}>Back to setup</Button>} />{entries.length ? <Panel className="leaderboard">{entries.map(([name, score], index) => <div className="leader-row" key={name}><span className="leader-rank">{String(index + 1).padStart(2, '0')}</span><span className="leader-medal">{index === 0 ? '✦' : index === 1 ? '◇' : '·'}</span><strong>{name}</strong><span className="leader-line" /><b>{score}<small> pts</small></b></div>)}<button className="text-button danger-text" onClick={() => dispatch({ type: 'RESET_SCORES' })}>Reset scoreboard</button></Panel> : <Panel><EmptyState icon="✦" title="No legends yet" text="Finish a game and the best bluffer will appear here." action={<Button onClick={() => dispatch({ type: 'GO_HOME' })}>Start a mission</Button>} /></Panel>}<div className="scoring-note"><span className="eyebrow">How points work</span><p>Crew win +1 per crewmate · Imposter win +3 per imposter · Correct vote +1 · Jester +3 · Last-chance steal +2</p></div></main>;
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const [toastOverride, setToastOverride] = useState(null);
  const activeGame = state.phase !== PHASES.SETUP && state.phase !== PHASES.SCOREBOARD;
  useWakeLock(activeGame);
  useEffect(() => { document.documentElement.dataset.theme = state.settings.theme; }, [state.settings.theme]);
  useEffect(() => { writeStorage(STORAGE_KEYS.settings, state.settings); writeStorage(STORAGE_KEYS.names, state.players.map((player) => player.name)); writeStorage(STORAGE_KEYS.used, state.usedWords); writeStorage(STORAGE_KEYS.scores, state.scoreboard); writeStorage(STORAGE_KEYS.custom, state.customWords); }, [state.settings, state.players, state.usedWords, state.scoreboard, state.customWords]);
  useEffect(() => { if (state.phase === PHASES.DISCUSSION && state.timerRunning) { const id = setInterval(() => dispatch({ type: 'TICK' }), 1000); return () => clearInterval(id); } }, [state.phase, state.timerRunning]);
  useEffect(() => { if (state.settings.sound && state.phase === PHASES.RESULT) playTone(state.outcome === 'crew' ? 'win' : 'danger'); }, [state.phase, state.outcome, state.settings.sound]);
  const toast = toastOverride || state.toast;
  useEffect(() => { if (state.toast) { const id = setTimeout(() => dispatch({ type: 'DISMISS_TOAST' }), 3500); return () => clearTimeout(id); } }, [state.toast]);
  const screen = useMemo(() => {
    if (state.phase === PHASES.SETUP) return <SetupScreen state={state} dispatch={dispatch} />;
    if (state.phase === PHASES.DEALING) return <DealScreen state={state} dispatch={dispatch} />;
    if (state.phase === PHASES.DISCUSSION) return <DiscussionScreen state={state} dispatch={dispatch} />;
    if (state.phase === PHASES.VOTING) return <VotingScreen state={state} dispatch={dispatch} />;
    if (state.phase === PHASES.EJECTION) return <EjectionScreen state={state} dispatch={dispatch} />;
    if (state.phase === PHASES.RESULT) return <ResultScreen state={state} dispatch={dispatch} setToast={setToastOverride} />;
    return <ScoreboardScreen state={state} dispatch={dispatch} />;
  }, [state]);
  return <div className="app-shell"><div className="space-backdrop" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div><Header state={state} dispatch={dispatch} />{screen}<Toast toast={toast} onClose={() => { setToastOverride(null); dispatch({ type: 'DISMISS_TOAST' }); }} /><footer className="site-footer"><span>WHO IS IMPOSTER? <small>v1.0 · made for suspicious friends</small></span><span>Local game · No account required</span></footer></div>;
}
