import Image from 'next/image'
import playSound from '@/helpers/playSound'
import soundOn from '../assets/sound-on.svg'
import soundOff from '../assets/sound-off.svg'
import { useEffect, useState } from 'react'
import { MdInfo } from 'react-icons/md'
import { GoAlert } from 'react-icons/go'
import { BsFillStarFill } from 'react-icons/bs'
import { FiSun, FiMoon } from 'react-icons/fi'
import { initMusic, playMusic, pauseMusic } from '@/helpers/musicPlayer'

export default function Footer ({ alert = false }) {
	const [sound, setSound] = useState(false)
	const [theme, setTheme] = useState('light')
	const [showInfo, setShowInfo] = useState(false)

	// initialize music and load saved preference
	useEffect(() => {
		initMusic()
		const stored = localStorage.getItem('sound')
		if (stored === null) {
			localStorage.setItem('sound', 'false')
			setSound(false)
		} else {
			setSound(stored === 'true')
		}

		// initialize theme from preference or system
		try {
			const storedTheme = localStorage.getItem('theme')
			if (storedTheme) {
				setTheme(storedTheme)
			} else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
				setTheme('dark')
			}
		} catch (e) {
			// ignore
		}
	}, [])

	// when `sound` changes, persist preference and play/pause music
	useEffect(() => {
		localStorage.setItem('sound', sound)
		if (sound) {
			playMusic()
			// play a confirmation SFX (allowed because user just interacted)
			playSound('switch-on')
		} else {
			pauseMusic()
			// play switch-off sound directly so it's heard even after pref is false
			const off = new Audio('/sounds/switch-off.mp3')
			off.volume = 0.25
			off.play().catch(() => {})
		}
	}, [sound])

	// apply theme changes to document root and persist
	useEffect(() => {
		try {
			document.documentElement.classList.toggle('theme-dark', theme === 'dark')
			localStorage.setItem('theme', theme)
		} catch (e) {
			// server-side or other errors - ignore
		}
	}, [theme])

	function handleClick (info = false) {
		if (info) return setShowInfo(s => !s)
		setSound(s => !s)
	}

	function toggleTheme () {
		setTheme(t => (t === 'dark' ? 'light' : 'dark'))
	}

	return (
		<footer className='fixed right-4 bottom-3 z-20'>
			<nav>
				<ul className='flex gap-4'>
					<li className='relative'>
						<button title='Show info' className={`align-middle relative z-20 hover:scale-105 p-1.5 bg-white rounded-md ${showInfo ? 'scale-110' : ''}`} onClick={() => handleClick(true)}>
							{
								alert
									? <GoAlert className='text-[25px] mx-auto' color='#0f172a' />
									: <MdInfo className='text-[25px]' style={{ color: '#1c233a' }} />
							}
						</button>
						<p className={`absolute bottom-full -right-14 sm:bottom-auto sm:top-[2px] whitespace-pre sm:whitespace-nowrap text-sm md:text-base bg-white text-slate-900 rounded-md py-1 px-4 text-left transition-all ${showInfo ? 'opacity-100 -right-14  sm:!right-7 ' : 'opacity-0 right-0 pointer-events-none'}`}>
							{
								alert
									? 'The questions made by AI may have errors. \nOnly some questions are made by IA'
									: <span><a href="https://github.com/cosmoart/quiz-game" target="_blank" rel="noopener noreferrer" className={`bg-slate-200 px-1 rounded ${showInfo ? '' : 'hidden'}`}><BsFillStarFill className='inline-block mb-1' color='#e3b341' /> Star</a> - Made with ❤️ by <a href="https://github.com/cosmoart" target="_blank" rel="noreferrer" className={`underline ${showInfo ? '' : 'hidden'}`}>Cosmo</a></span>
							}
						</p>
					</li>

						<li>
							<button title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'} className='align-middle hover:scale-105 p-1.5 bg-white rounded-md' onClick={toggleTheme} aria-pressed={theme === 'dark'} aria-label={theme === 'dark' ? 'Activate light theme' : 'Activate dark theme'}>
								{
									theme === 'dark'
										? <FiSun className='text-[20px]' style={{ color: '#ffffff' }} />
										: <FiMoon className='text-[20px]' style={{ color: '#000000' }} />
								}
							</button>
							</li>

							<li>
							<button title={sound ? 'Mute' : 'Play music'} className='align-middle hover:scale-105 p-1.5 bg-white rounded-md' onClick={() => handleClick(false)} aria-pressed={sound} aria-label={sound ? 'Mute audio' : 'Play audio'}>
								{
									sound
										? <Image src={soundOn} alt="Sound enabled" width={25} height={25} />
										: <Image src={soundOff} alt="Sound disabled" width={25} height={25} />
								}
							</button>
						</li>
				</ul>
			</nav>
		</footer>
	)
}
