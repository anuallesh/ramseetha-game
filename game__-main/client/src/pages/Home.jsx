/**
 * Home Page
 * Landing page with options to create or join a room
 */

import { useState } from 'react';

export default function Home({ onCreateRoom, onJoinRoom, onCreateRoomWithBots }) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [showBotsForm, setShowBotsForm] = useState(false);
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onCreateRoom(name);
      setName('');
    }
  };

  const handleCreateWithBotsSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onCreateRoomWithBots(name);
      setName('');
    }
  };

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && roomCode.trim()) {
      onJoinRoom(name, roomCode);
      setName('');
      setRoomCode('');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-mythic flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-7xl font-bold mb-4">
            <span className="text-gradient">RamSeetha</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-2">
            A Mythological Multiplayer Game
          </p>
          <p className="text-gray-400">
            Play with friends inspired by Indian mythology
          </p>
        </div>

        {/* Game Rules */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Characters */}
          <div className="card p-6">
            <h3 className="text-xl font-bold text-saffron mb-4">⚔️ Characters</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex justify-between">
                <span>🙏 Ram</span>
                <span className="text-gold font-bold">1000 pts</span>
              </li>
              <li className="flex justify-between">
                <span>👸 Seetha</span>
                <span className="text-gold font-bold">0 pts</span>
              </li>
              <li className="flex justify-between">
                <span>⚡ Laxman</span>
                <span className="text-gold font-bold">900 pts</span>
              </li>
              <li className="flex justify-between">
                <span>🐵 Hanuman</span>
                <span className="text-gold font-bold">800 pts</span>
              </li>
              <li className="flex justify-between">
                <span>👑 Bharath</span>
                <span className="text-gold font-bold">700 pts</span>
              </li>
              <li className="flex justify-between">
                <span>🏹 Shatrughna</span>
                <span className="text-gold font-bold">600 pts</span>
              </li>
            </ul>
          </div>

          {/* Rules */}
          <div className="card p-6">
            <h3 className="text-xl font-bold text-sage mb-4">📋 Game Rules</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>✓ Min 4 players, max 6 players per room</li>
              <li>✓ Each round, one player gets each character</li>
              <li>✓ Ram must guess who has Seetha</li>
              <li>✓ If correct: Ram gets 1000, Seetha gets 0</li>
              <li>✓ If wrong: Ram gets 0, Seetha gets 1000</li>
              <li>✓ Others always get their character points</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons and Forms */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Create Room */}
          <div>
            {!showCreateForm && !showBotsForm ? (
              <button
                onClick={() => {
                  setShowCreateForm(true);
                  setShowJoinForm(false);
                }}
                className="btn-primary w-full"
              >
                🎮 Create Room
              </button>
            ) : showCreateForm ? (
              <form onSubmit={handleCreateSubmit} className="card p-6 space-y-4">
                <h3 className="text-lg font-bold text-saffron">Create New Game</h3>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={20}
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                    disabled={!name.trim()}
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setName('');
                    }}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : null}
          </div>

          {/* Play with Bots */}
          <div>
            {!showCreateForm && !showBotsForm ? (
              <button
                onClick={() => {
                  setShowBotsForm(true);
                  setShowJoinForm(false);
                }}
                className="btn-success w-full"
              >
                🤖 Play with Bots
              </button>
            ) : showBotsForm ? (
              <form onSubmit={handleCreateWithBotsSubmit} className="card p-6 space-y-4">
                <h3 className="text-lg font-bold text-sage">Play with Bots</h3>
                <p className="text-sm text-gray-400">You + 3 AI bots</p>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={20}
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="btn-success flex-1"
                    disabled={!name.trim()}
                  >
                    Start
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowBotsForm(false);
                      setName('');
                    }}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : null}
          </div>

          {/* Join Room */}
          <div>
            {!showJoinForm ? (
              <button
                onClick={() => {
                  setShowJoinForm(true);
                  setShowCreateForm(false);
                  setShowBotsForm(false);
                }}
                className="btn-secondary w-full"
              >
                🎯 Join Room
              </button>
            ) : showJoinForm ? (
              <form onSubmit={handleJoinSubmit} className="card p-6 space-y-4">
                <h3 className="text-lg font-bold text-saffron">Join Existing Game</h3>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={20}
                  required
                />
                <input
                  type="text"
                  placeholder="Room Code"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  maxLength={6}
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="btn-success flex-1"
                    disabled={!name.trim() || !roomCode.trim()}
                  >
                    Join
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowJoinForm(false);
                      setName('');
                      setRoomCode('');
                    }}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : null}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-400 text-sm">
          <p>🏛️ A mythological game for fun and entertainment</p>
        </div>
      </div>
    </div>
  );
}
