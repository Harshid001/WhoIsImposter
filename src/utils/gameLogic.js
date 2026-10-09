import { flattenWordBank } from '../data/wordBank';

export const MAX_PLAYERS = 12;
export const MIN_PLAYERS = 3;
export const PHASES = Object.freeze({
  SETUP: 'SETUP',
  DEALING: 'DEALING',
  DISCUSSION: 'DISCUSSION',
  VOTING: 'VOTING',
  EJECTION: 'EJECTION',
  RESULT: 'RESULT',
  SCOREBOARD: 'SCOREBOARD'
});

export const DEFAULT_SETTINGS = Object.freeze({
  playerCount: 5,
  imposterCount: 1,
  randomImposters: false,
  categories: ['Random'],
  difficulty: 'Medium',
  timerMinutes: 3,
  tieRule: 'none',
  sound: true,
  vibration: true,
  showCategory: true,
  showImposterCount: true,
  imposterKnowsCategory: true,
  privateVoting: false,
  holdToReveal: true,
  mode: 'Classic',
  detective: false,
  chaos: false,
  lastChance: true,
  impostersKnowEachOther: true,
  theme: 'dark'
});

export const AVATAR_COLORS = [
  '#ff6b9d',
  '#ff9f43',
  '#ffe66d',
  '#7ce38b',
  '#61dafb',
  '#8b7cff',
  '#b78cff',
  '#f78fb3',
  '#4dd9c0',
  '#ff827a',
  '#83a8ff',
  '#d5e7ff'
];
export const AVATAR_ICONS = [
  '🛰️',
  '🌙',
  '🪐',
  '🚀',
  '☄️',
  '👾',
  '🛸',
  '🌟',
  '🧑‍🚀',
  '🔭',
  '🛰️',
  '🌌'
];

export function clamp(value, min, max) {
  return Math.min(Math.max(Number(value) || min, min), max);
}

export function maxImposters(playerCount) {
  return Math.max(1, Math.floor((playerCount - 1) / 2));
}

export function normalizeNames(names, count) {
  const used = new Map();
  return Array.from({ length: count }, (_, index) => {
    const base = String(names[index] || '').trim() || `Player ${index + 1}`;
    const key = base.toLocaleLowerCase();
    const seen = used.get(key) || 0;
    used.set(key, seen + 1);
    return seen ? `${base} ${seen + 1}` : base;
  });
}

export function makePlayers(names, count = names.length) {
  return normalizeNames(names, count).map((name, index) => ({
    id: `player-${index + 1}`,
    name,
    avatar: AVATAR_ICONS[index % AVATAR_ICONS.length],
    color: AVATAR_COLORS[index % AVATAR_COLORS.length],
    alive: true,
    role: null,
    isJester: false,
    isDetective: false
  }));
}

export function pickImposterCount(settings, playerCount, random = Math.random) {
  const max = maxImposters(playerCount);
  return settings.randomImposters ? 1 + Math.floor(random() * max) : clamp(settings.imposterCount, 1, max);
}

export function pickWord(selectedCategories, usedWords = [], customWords = [], random = Math.random) {
  const bank = flattenWordBank(selectedCategories);
  const custom = (customWords || []).filter((entry) => entry?.word && entry?.hint).map((entry) => ({ ...entry, category: entry.category || 'Custom words' }));
  const all = [...bank, ...custom];
  if (!all.length) return { word: 'Moon', hint: 'Night', hardHint: 'Orbit', category: 'Emergency' };
  const available = all.filter((entry) => !usedWords.includes(`${entry.category}:${entry.word}`));
  const pool = available.length ? available : all;
  return pool[Math.floor(random() * pool.length)];
}

function shuffled(items, random = Math.random) {
  return [...items].sort(() => random() - 0.5);
}

export function assignRoles(players, settings, random = Math.random) {
  const nextPlayers = players.map((player) => ({ ...player, role: 'crew', isJester: false, isDetective: false }));
  const imposterCount = pickImposterCount(settings, players.length, random);
  const picked = shuffled(nextPlayers, random);
  const imposterIds = new Set(picked.slice(0, imposterCount).map((player) => player.id));
  nextPlayers.forEach((player) => {
    if (imposterIds.has(player.id)) player.role = 'imposter';
  });

  if (settings.mode === 'Spy Twist') {
    const jesterCandidate = nextPlayers.find((player) => player.role === 'crew');
    if (jesterCandidate) {
      jesterCandidate.role = 'jester';
      jesterCandidate.isJester = true;
    }
  }

  if (settings.detective) {
    const detectiveCandidate = nextPlayers.find((player) => player.role === 'crew');
    if (detectiveCandidate) detectiveCandidate.isDetective = true;
  }

  return {
    players: nextPlayers,
    imposterCount,
    firstSpeakerId: shuffled(nextPlayers.filter((player) => player.role !== 'jester'), random)[0]?.id || nextPlayers[0]?.id,
    imposterIds: [...imposterIds]
  };
}

export function getHint(word, difficulty) {
  if (difficulty === 'Hard') return word.hardHint || 'Mystery';
  if (difficulty === 'Easy') return word.hint;
  return word.hint || word.hardHint || 'Mystery';
}

export function displayForPlayer(player, word, settings, allPlayers = []) {
  if (player.role === 'imposter') {
    return {
      title: 'YOU ARE THE IMPOSTER',
      label: settings.mode === 'Blind Imposter' ? 'No hint tonight' : 'Your only hint',
      secret: settings.mode === 'Blind Imposter' ? 'Blend in without a clue' : getHint(word, settings.difficulty),
      tone: 'imposter',
      subline: 'Blend in. Don’t get caught.',
      category: settings.imposterKnowsCategory ? word.category : null,
      allies: settings.impostersKnowEachOther ? allPlayers.filter((candidate) => candidate.role === 'imposter' && candidate.id !== player.id).map((candidate) => candidate.name) : []
    };
  }
  if (player.role === 'jester') {
    return { title: 'JESTER', label: 'Your secret mission', secret: 'Get voted out', tone: 'jester', subline: 'Make them suspicious of you.', category: settings.showCategory ? word.category : null, allies: [] };
  }
  if (player.isDetective) {
    return { title: 'DETECTIVE', label: 'The secret word', secret: word.word, tone: 'detective', subline: 'Ask one yes/no question in round one.', category: settings.showCategory ? word.category : null, allies: [] };
  }
  return { title: 'CREWMATE', label: 'The secret word', secret: word.word, tone: 'crew', subline: 'Give a clue. Protect the signal.', category: settings.showCategory ? word.category : null, allies: [] };
}

export function tallyVotes(votes, players) {
  const livingIds = new Set(players.filter((player) => player.alive).map((player) => player.id));
  const counts = {};
  Object.values(votes || {}).forEach((vote) => {
    if (vote === 'skip' || !livingIds.has(vote)) return;
    counts[vote] = (counts[vote] || 0) + 1;
  });
  const max = Math.max(0, ...Object.values(counts));
  const leaders = Object.entries(counts).filter(([, count]) => count === max && max > 0).map(([id]) => id);
  return { counts, leaders, topCount: max, isTie: leaders.length > 1 };
}

export function resolveVote(votes, players, tieRule = 'none') {
  const result = tallyVotes(votes, players);
  if (!result.leaders.length) return { ...result, ejectedId: null, skipped: true, revote: false };
  if (result.isTie) return { ...result, ejectedId: tieRule === 'revote' ? null : null, skipped: false, revote: tieRule === 'revote' };
  return { ...result, ejectedId: result.leaders[0], skipped: false, revote: false };
}

export function checkWin(players) {
  const living = players.filter((player) => player.alive);
  const livingImposters = living.filter((player) => player.role === 'imposter').length;
  const livingCrew = living.filter((player) => player.role !== 'imposter' && player.role !== 'jester').length;
  if (livingImposters === 0) return { winner: 'crew', livingImposters, livingCrew };
  if (livingImposters >= livingCrew) return { winner: 'imposters', livingImposters, livingCrew };
  return { winner: null, livingImposters, livingCrew };
}

export function scoreRound(players, ejectedId, outcome, lastChanceSuccess = false) {
  const delta = Object.fromEntries(players.map((player) => [player.id, 0]));
  if (outcome === 'crew') players.filter((player) => player.role !== 'imposter').forEach((player) => { delta[player.id] += 1; });
  if (outcome === 'imposters') players.filter((player) => player.role === 'imposter').forEach((player) => { delta[player.id] += 3; });
  if (ejectedId) {
    const target = players.find((player) => player.id === ejectedId);
    if (target?.role === 'imposter') players.filter((player) => player.role !== 'imposter').forEach((player) => { delta[player.id] += 1; });
    if (target?.role === 'jester') delta[ejectedId] += 3;
  }
  if (lastChanceSuccess && ejectedId) delta[ejectedId] += 2;
  return delta;
}

export const CHAOS_EVENTS = [
  'Everyone must give a clue using only two words.',
  'Speak in reverse order this round.',
  'No one may use a colour word in their clue.',
  'The first clue-giver gets only five seconds to think.',
  'Everyone must end their clue with the word “actually”.'
];

export function pickChaosEvent(random = Math.random) {
  return CHAOS_EVENTS[Math.floor(random() * CHAOS_EVENTS.length)];
}
