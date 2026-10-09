import React, { useEffect, useMemo, useState } from 'react';
import { Button, Panel, Badge } from './ui';

const ROOM_PREFIX = 'wi-demo-room-';

function readRoom(code) {
  try {
    const value = localStorage.getItem(`${ROOM_PREFIX}${code}`);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function writeRoom(room) {
  try { localStorage.setItem(`${ROOM_PREFIX}${room.code}`, JSON.stringify(room)); } catch { /* local demo storage is optional */ }
}

function makeCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 5 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
}

function cleanName(value, fallback = 'Player') {
  return value.trim().slice(0, 18) || fallback;
}

export function DemoRoomPanel({ state, dispatch }) {
  const hashCode = useMemo(() => new URLSearchParams(window.location.hash.replace(/^#/, '')).get('demo-room') || '', []);
  const [mode, setMode] = useState(hashCode ? 'join' : 'idle');
  const [codeInput, setCodeInput] = useState(hashCode);
  const [nameInput, setNameInput] = useState(state.players[0]?.name || '');
  const [room, setRoom] = useState(() => hashCode ? readRoom(hashCode) : null);
  const [notice, setNotice] = useState(hashCode && !readRoom(hashCode) ? 'This invite was opened on a different browser. Static demo mode cannot sync guests across devices.' : '');

  const inviteLink = room ? `${window.location.origin}${window.location.pathname}#demo-room=${room.code}` : '';

  useEffect(() => {
    if (!room?.code) return undefined;
    const sync = (event) => {
      if (event.key === `${ROOM_PREFIX}${room.code}`) setRoom(readRoom(room.code));
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, [room?.code]);

  useEffect(() => {
    const syncHash = () => {
      const nextCode = new URLSearchParams(window.location.hash.replace(/^#/, '')).get('demo-room') || '';
      const nextRoom = nextCode ? readRoom(nextCode) : null;
      setCodeInput(nextCode);
      setRoom(nextRoom);
      setMode(nextCode ? 'join' : 'idle');
      setNotice(nextCode && !nextRoom ? 'This invite was opened on a different browser. Static demo mode cannot sync guests across devices.' : '');
    };
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, []);

  const createRoom = () => {
    const next = { code: makeCode(), host: cleanName(nameInput, 'Host'), players: [cleanName(nameInput, 'Host')] };
    writeRoom(next); setRoom(next); setMode('host'); setCodeInput(next.code); setNotice('Room created in this browser. Open the invite in another tab to preview the guest flow.');
    window.history.replaceState(null, '', `${window.location.pathname}#demo-room=${next.code}`);
  };

  const joinRoom = () => {
    const code = codeInput.trim().toUpperCase();
    if (!code) { setNotice('Enter a room code or open an invite link first.'); return; }
    const guest = cleanName(nameInput, 'Guest');
    const current = readRoom(code) || { code, host: 'Room host', players: [] };
    const players = current.players.includes(guest) ? current.players : [...current.players, guest];
    const next = { ...current, players };
    writeRoom(next); setRoom(next); setMode('join'); setNotice(current.host === 'Room host' ? 'Joined a local demo room on this browser. The original host will not receive this guest remotely.' : 'You joined the local demo room.');
    window.history.replaceState(null, '', `${window.location.pathname}#demo-room=${code}`);
  };

  const copyInvite = async () => {
    try { await navigator.clipboard.writeText(inviteLink); setNotice('Invite link copied.'); }
    catch { setNotice(inviteLink); }
  };

  const useNames = () => {
    if (!room || room.players.length < 3) { setNotice('Add at least 3 local demo players before loading the game.'); return; }
    dispatch({ type: 'LOAD_ROOM_PLAYERS', names: room.players });
    setNotice('Participant names loaded into the local game setup.');
  };

  const leaveRoom = () => {
    setRoom(null); setMode('idle'); setCodeInput(''); setNotice('Demo room closed on this browser.');
    window.history.replaceState(null, '', window.location.pathname);
  };

  return <Panel className="room-panel">
    <div className="room-heading"><div><span className="eyebrow">Friends mode</span><h2>Share a demo room</h2></div><Badge tone="neutral">Static demo</Badge></div>
    <p className="room-copy">Create an invite link or join with a code. This browser-only preview stores the lobby locally; it does not provide live cross-device sync.</p>
    {!room && mode === 'idle' ? <div className="room-actions"><Button onClick={createRoom}>Host a room</Button><Button variant="secondary" onClick={() => setMode('join')}>Join with a link</Button></div> : !room ? <>
      <div className="room-input-row"><input value={nameInput} maxLength={18} onChange={(event) => setNameInput(event.target.value)} placeholder="Your display name" aria-label="Demo room display name" /><input value={codeInput} maxLength={5} onChange={(event) => setCodeInput(event.target.value.toUpperCase())} placeholder="Code" aria-label="Demo room code" /><Button variant="secondary" onClick={joinRoom}>Join room</Button></div>
      {notice ? <div className="room-notice">{notice}</div> : null}
      <button className="text-button" onClick={() => { setMode('idle'); setNotice(''); }}>Back to room choices</button>
    </> : <>
      <div className="room-code"><span>Room code</span><strong>{room.code}</strong><button type="button" onClick={copyInvite}>Copy invite link</button></div>
      <div className="room-input-row"><input value={nameInput} maxLength={18} onChange={(event) => setNameInput(event.target.value)} placeholder="Your display name" aria-label="Demo room display name" /><input value={codeInput} maxLength={5} onChange={(event) => setCodeInput(event.target.value.toUpperCase())} placeholder="Code" aria-label="Demo room code" /><Button variant="secondary" onClick={joinRoom}>Join room</Button></div>
      <div className="room-members"><span className="field-label">Local participants</span>{room.players.length ? <div className="room-player-list">{room.players.map((player, index) => <span key={`${player}-${index}`}>{String(index + 1).padStart(2, '0')} {player}</span>)}</div> : <small>No one has joined yet.</small>}</div>
      {notice ? <div className="room-notice">{notice}</div> : null}
      <div className="room-actions"><Button disabled={room.players.length < 3} onClick={useNames}>Use these names in game</Button><button className="text-button" onClick={leaveRoom}>Leave demo room</button></div>
    </>}
  </Panel>;
}
