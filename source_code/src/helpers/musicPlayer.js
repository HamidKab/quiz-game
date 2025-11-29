// src/helpers/musicPlayer.js
let musicAudio = null

export function initMusic (name = 'bg-music', { volume = 0.25, loop = true } = {}) {
  if (!musicAudio) {
    musicAudio = new Audio(`/sounds/${name}.wav`)
    musicAudio.volume = volume
    musicAudio.loop = loop
    musicAudio.preload = 'auto'
  }
}

export function playMusic () {
  if (!musicAudio) initMusic()
  if (localStorage.getItem('sound') === 'true') {
    musicAudio.play().catch(() => { /* autoplay might be blocked */ })
  }
}

export function pauseMusic () {
  if (musicAudio) musicAudio.pause()
}

export function stopMusic () {
  if (musicAudio) {
    musicAudio.pause()
    musicAudio.currentTime = 0
  }
}

export function setMusicVolume (v) {
  if (musicAudio) musicAudio.volume = v
}

export function isMusicPlaying () {
  return musicAudio && !musicAudio.paused
}