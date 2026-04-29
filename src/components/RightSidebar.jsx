import React, { useState, useRef, useEffect } from 'react'
import { FiPlay, FiPause, FiSkipForward, FiSkipBack, FiVolume2, FiMusic } from 'react-icons/fi'

const playlist = [
  { title: 'Rainy Café Vibes', artist: 'Lo-Fi Girl', duration: '3:24' },
  { title: 'Cherry Blossom Dreams', artist: 'Anime OST', duration: '4:12' },
  { title: 'Midnight Study Session', artist: 'Chillhop', duration: '2:58' },
  { title: 'Tokyo Night Walk', artist: 'Nujabes', duration: '5:01' },
  { title: 'Cozy Blanket', artist: 'Kina', duration: '3:45' },
  { title: 'Sunflower Fields', artist: 'Lo-Fi Dreams', duration: '4:30' },
]

const RightSidebar = () => {
  const [currentTrack, setCurrentTrack] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let interval
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            nextTrack()
            return 0
          }
          return prev + 0.5
        })
      }, 100)
    }
    return () => clearInterval(interval)
  }, [isPlaying, currentTrack])

  const nextTrack = () => {
    setCurrentTrack(prev => (prev + 1) % playlist.length)
    setProgress(0)
  }

  const prevTrack = () => {
    setCurrentTrack(prev => (prev - 1 + playlist.length) % playlist.length)
    setProgress(0)
  }

  return (
    <aside className="right-sidebar">
      <div className="jukebox-widget">
        <h3><FiMusic /> Jukebox</h3>
        <div className="jukebox-cover">
          <div className={`vinyl-record ${isPlaying ? 'spinning' : ''}`}>
            <div className="vinyl-label">♪</div>
          </div>
        </div>
        <div className="jukebox-info">
          <p className="track-title">{playlist[currentTrack].title}</p>
          <p className="track-artist">{playlist[currentTrack].artist}</p>
        </div>
        <div className="jukebox-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="progress-time">
            <span>0:00</span>
            <span>{playlist[currentTrack].duration}</span>
          </div>
        </div>
        <div className="jukebox-controls">
          <button onClick={prevTrack} className="jukebox-btn"><FiSkipBack /></button>
          <button onClick={() => setIsPlaying(!isPlaying)} className="jukebox-btn play-btn">
            {isPlaying ? <FiPause /> : <FiPlay />}
          </button>
          <button onClick={nextTrack} className="jukebox-btn"><FiSkipForward /></button>
        </div>
        <div className="jukebox-playlist">
          <h4>Up Next</h4>
          {playlist.map((track, i) => (
            <div
              key={i}
              className={`playlist-item ${i === currentTrack ? 'active' : ''}`}
              onClick={() => { setCurrentTrack(i); setProgress(0) }}
            >
              <span className="playlist-num">{i + 1}</span>
              <div>
                <p className="playlist-title">{track.title}</p>
                <p className="playlist-artist">{track.artist}</p>
              </div>
              <span className="playlist-duration">{track.duration}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}

export default RightSidebar
