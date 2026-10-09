import { describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS, assignRoles, checkWin, displayForPlayer, makePlayers, resolveVote, scoreRound } from './gameLogic';

describe('game logic', () => {
  it('assigns the requested number of imposters and keeps special roles distinct', () => {
    const players = makePlayers(['A', 'B', 'C', 'D', 'E'], 5);
    const roles = assignRoles(players, { ...DEFAULT_SETTINGS, imposterCount: 2, mode: 'Spy Twist', detective: true }, () => 0.2);
    expect(roles.players.filter((player) => player.role === 'imposter')).toHaveLength(2);
    expect(roles.players.filter((player) => player.role === 'jester')).toHaveLength(1);
    expect(roles.players.filter((player) => player.isDetective)).toHaveLength(1);
  });

  it('declares a crew win when no imposters remain', () => {
    const players = makePlayers(['A', 'B', 'C'], 3).map((player) => ({ ...player, role: player.id === 'player-1' ? 'crew' : 'crew' }));
    expect(checkWin(players).winner).toBe('crew');
  });

  it('declares an imposter win at parity', () => {
    const players = makePlayers(['A', 'B', 'C', 'D', 'E'], 5).map((player, index) => ({ ...player, role: index < 2 ? 'imposter' : 'crew' }));
    players[4].alive = false;
    expect(checkWin(players).winner).toBe('imposters');
  });

  it('supports both no-ejection and revote tie rules', () => {
    const players = makePlayers(['A', 'B', 'C'], 3);
    const votes = { a: 'player-1', b: 'player-2' };
    expect(resolveVote(votes, players, 'none').ejectedId).toBeNull();
    expect(resolveVote(votes, players, 'revote').revote).toBe(true);
  });

  it('awards crew win and correct-vote points', () => {
    const players = makePlayers(['A', 'B', 'C'], 3).map((player, index) => ({ ...player, role: index === 0 ? 'imposter' : 'crew' }));
    const delta = scoreRound(players, 'player-1', 'crew');
    expect(delta['player-2']).toBe(2);
    expect(delta['player-1']).toBe(0);
  });

  it('has holdToReveal enabled by default in settings', () => {
    expect(DEFAULT_SETTINGS.holdToReveal).toBe(true);
  });

  it('generates rich secret identity cards for crew and imposter', () => {
    const players = makePlayers(['Alice', 'Bob', 'Charlie'], 3);
    const word = { category: 'Food', word: 'Pizza', hint: 'Italian dish' };
    const crewCard = displayForPlayer(players[0], word, DEFAULT_SETTINGS, players);
    expect(crewCard.tone).toBe('crew');
    expect(crewCard.secret).toBe('Pizza');
    expect(crewCard.title).toContain('CREW');

    const imposterPlayer = { ...players[1], role: 'imposter' };
    const imposterCard = displayForPlayer(imposterPlayer, word, DEFAULT_SETTINGS, [players[0], imposterPlayer, players[2]]);
    expect(imposterCard.tone).toBe('imposter');
    expect(imposterCard.secret).toBe('Italian dish');
    expect(imposterCard.title).toContain('IMPOSTER');
  });
});
