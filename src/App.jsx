import { useEffect, useRef, useState } from 'react';

const confettiColors = ['#d65d6d', '#f18a79', '#edbb6a', '#a9c8bc', '#c6acd9', '#f5c6ad'];
const dandelions = [
  { x: '3%', y: '8%', scale: '.72', tilt: '-16deg', delay: '0s' },
  { x: '88%', y: '6%', scale: '.9', tilt: '14deg', delay: '-2s' },
  { x: '14%', y: '32%', scale: '.55', tilt: '22deg', delay: '-4s' },
  { x: '94%', y: '35%', scale: '.7', tilt: '-24deg', delay: '-1s' },
  { x: '1%', y: '64%', scale: '.86', tilt: '12deg', delay: '-3s' },
  { x: '90%', y: '61%', scale: '.52', tilt: '-14deg', delay: '-5s' },
  { x: '18%', y: '83%', scale: '.68', tilt: '-20deg', delay: '-2.5s' },
  { x: '79%', y: '86%', scale: '.82', tilt: '20deg', delay: '-4.5s' },
];

function createConfetti() {
  return Array.from({ length: 72 }, (_, index) => ({
    id: `${Date.now()}-${index}`,
    left: `${Math.random() * 100}%`,
    color: confettiColors[index % confettiColors.length],
    radius: index % 3 === 0 ? '50%' : '2px',
    rotation: `${Math.random() * 180}deg`,
    drift: `${(Math.random() - 0.5) * 280}px`,
    fallTime: `${2.5 + Math.random() * 2.5}s`,
    delay: `${Math.random() * 0.45}s`,
  }));
}

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isNoteUnfolded, setIsNoteUnfolded] = useState(false);
  const [isSongPlaying, setIsSongPlaying] = useState(false);
  const [confetti, setConfetti] = useState([]);
  const [loveBubbles, setLoveBubbles] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const envelopeRef = useRef(null);
  const toastTimer = useRef(null);
  const songAudioRef = useRef(null);

  useEffect(() => () => {
    clearTimeout(toastTimer.current);
  }, []);

  function stopSong() {
    if (songAudioRef.current) {
      songAudioRef.current.pause();
      songAudioRef.current.currentTime = 0;
    }
    setIsSongPlaying(false);
  }

  function playSong() {
    stopSong();
    const songAudio = songAudioRef.current;
    if (!songAudio) return;
    songAudio.volume = 0.55;
    songAudio.currentTime = 0;
    songAudio.play()
      .then(() => setIsSongPlaying(true))
      .catch(() => setIsSongPlaying(false));
  }

  function openEnvelope() {
    setIsOpen(true);
    setIsNoteUnfolded(false);
    setConfetti(createConfetti());
    setShowToast(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setShowToast(false), 2800);
    setTimeout(() => document.querySelector('#birthdayNote')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 600);
  }

  function replay() {
    setIsOpen(false);
    setIsNoteUnfolded(false);
    stopSong();
    setConfetti([]);
    setLoveBubbles([]);
    setShowToast(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => envelopeRef.current?.focus(), 350);
  }

  function unfoldNote() {
    if (isNoteUnfolded) return;
    setIsNoteUnfolded(true);
    playSong();
  }

  function toggleSong() {
    if (isSongPlaying) stopSong();
    else playSong();
  }

  function handleNoteKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      unfoldNote();
    }
  }

  function sendLove() {
    setLoveBubbles(Array.from({ length: 14 }, (_, index) => ({
      id: `${Date.now()}-${index}`,
      left: `${42 + Math.random() * 16}%`,
      delay: `${Math.random() * 0.35}s`,
      drift: `${(Math.random() - 0.5) * 180}px`,
      color: confettiColors[index % confettiColors.length],
    })));
    setShowToast(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => {
      setShowToast(false);
      setLoveBubbles([]);
    }, 2800);
  }

  return (
    <div className={`app${isOpen ? ' is-open' : ''}${isNoteUnfolded ? ' is-unfolded' : ''}${isSongPlaying ? ' is-song-playing' : ''}`}>
      <div className="sparkle-field" aria-hidden="true" />
      <div className="dandelion-field" aria-hidden="true">
        {dandelions.map((dandelion, index) => (
          <span
            className="dandelion"
            key={index}
            style={{ '--x': dandelion.x, '--y': dandelion.y, '--scale': dandelion.scale, '--tilt': dandelion.tilt, '--delay': dandelion.delay }}
          >
            <span className="dandelion-head" />
            <span className="dandelion-stem" />
          </span>
        ))}
      </div>
      <main className="page-shell">
        <section className="intro" aria-labelledby="page-title">
          <p className="eyebrow">A little birthday surprise</p>
          <h1 id="page-title">For the girl who makes<br /><em>every day brighter.</em></h1>
          <p className="intro-copy">There’s a tiny celebration waiting inside.<br />Go on, open it.</p>
        </section>

        <section className="envelope-stage" aria-label="Birthday envelope">
          <div className="halo halo-one" />
          <div className="halo halo-two" />
          <button
            ref={envelopeRef}
            className="envelope-button"
            type="button"
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Birthday message opened' : 'Open the birthday envelope'}
            onClick={openEnvelope}
          >
            <span className="envelope-shadow" />
            <span className="envelope" aria-hidden="true">
              <span className="envelope-back" />
              <span className="envelope-paper" />
              <span className="envelope-pocket" />
              <span className="envelope-flap" />
              <span className="seal">♡</span>
            </span>
            <span className="open-label"><span className="cursor-icon">↗</span> {isOpen ? 'opened with love' : 'tap to open'}</span>
          </button>
          <p className="stage-note">{isOpen ? 'a very important message has arrived' : 'made with a ridiculous amount of love'}</p>
        </section>

        {isOpen && (
          <section className="birthday-note" id="birthdayNote" aria-live="polite">
            <div
              className={`note-card${isNoteUnfolded ? ' note-unfolded' : ''}`}
              role="button"
              tabIndex={isNoteUnfolded ? -1 : 0}
              aria-label={isNoteUnfolded ? 'Birthday message' : 'Unfold the birthday message'}
              onClick={unfoldNote}
              onKeyDown={handleNoteKeyDown}
            >
              <div className="note-topline"><span>HAPPY BIRTHDAY</span><span>♡</span></div>
              <div className="fold-hint"><span>tap to unfold</span><strong>↘</strong></div>
              <div className="note-content">
                <p className="note-kicker">Today is all about you</p>
                <h2>Happy birthday,<br /><em>beautiful.</em></h2>
                <p className="message">Dear love,</p>
                <p className="message">Thank you for always being with me through all the sleepless nights and the things we have been through, the rough patches we have been through, the times we spent walking and holding hands, the peace I felt after you held me. No one can ever match that and no one ever will.</p>
                <p className="message">Dear love, I only love you and this birthday, I know you didn't want to celebrate it, but baby, I wish you all the happiness in my life. Thank you for always being with me, baby. Mauhhhhhh.</p>
                <p className="signature">always yours <span>♡</span></p>
              </div>
              <div className="note-stamp">YOU<br />ARE<br />LOVED</div>
            </div>
            <button className="again-button" type="button" onClick={replay}>Replay the magic <span>↗</span></button>
            {isNoteUnfolded && <button className="song-button" type="button" onClick={toggleSong} aria-label={isSongPlaying ? 'Pause birthday song' : 'Play birthday song'}><span>{isSongPlaying ? 'Ⅱ' : '▶'}</span> {isSongPlaying ? 'pause the little song' : 'play the little song'}</button>}
            {isNoteUnfolded && <button className="love-button" type="button" onClick={sendLove}><span>♡</span> send a little love</button>}
          </section>
        )}

        <footer>for my favorite person in the whole universe</footer>
      </main>

      <div className="confetti-container" aria-hidden="true">
        {confetti.map((piece) => <span className="confetti" key={piece.id} style={{ left: piece.left, backgroundColor: piece.color, borderRadius: piece.radius, transform: `rotate(${piece.rotation})`, '--drift': piece.drift, '--fall-time': piece.fallTime, animationDelay: piece.delay }} />)}
      </div>
      <div className="love-bubbles" aria-hidden="true">
        {loveBubbles.map((bubble) => <span className="love-bubble" key={bubble.id} style={{ left: bubble.left, color: bubble.color, '--drift': bubble.drift, animationDelay: bubble.delay }}>♡</span>)}
      </div>
      <audio ref={songAudioRef} src="/dandelions.mp3" preload="metadata" onEnded={() => setIsSongPlaying(false)} aria-label="Dandelions birthday song" />
      <div className={`toast${showToast ? ' show' : ''}`} role="status">Birthday magic unlocked ✦</div>
    </div>
  );
}

export default App;
