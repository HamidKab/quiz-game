import Image from 'next/image'
import Link from 'next/link'

import { AiFillCloseCircle, AiFillCheckCircle } from 'react-icons/ai'
import { useCallback, useEffect, useRef, useState } from 'react'
import { IoCloseSharp } from 'react-icons/io5'
import { BiArrowBack } from 'react-icons/bi'
import trophyIcon from '@/assets/trophy.svg'

import playSound from '@/helpers/playSound'
import ReactCanvasConfetti from 'react-canvas-confetti'
import { useBoundStore } from '@/store/useBoundStore'

const canvasStyles = {
	position: 'fixed',
	pointerEvents: 'none',
	width: '100%',
	height: '100%',
	top: 0,
	left: 0,
	zIndex: 100
}

let timeTaken = null // to hold time taken value for submission

export default function GameOver () {
	const [playerName, setPlayerName] = useState("")
	const [submitted, setSubmitted] = useState(false)
	const [inputValue, setInputValue] = useState("")
	const [placeholder, setPlaceholder] = useState("Enter your name (optional)")
	const { queries, score, win } = useBoundStore(state => state)
	const { startTime } = useBoundStore(state => state)
	const refAnimationInstance = useRef(null)

	const getInstance = useCallback((instance) => {
		refAnimationInstance.current = instance
	}, [])

	const makeShot = useCallback((particleRatio, opts) => {
		refAnimationInstance.current &&
			refAnimationInstance.current({
				...opts,
				origin: { y: 0.7 },
				particleCount: Math.floor(200 * particleRatio)
			})
	}, [])

	const fire = useCallback(() => {
		makeShot(0.25, {
			spread: 26,
			startVelocity: 55
		})

		makeShot(0.2, {
			spread: 60
		})

		makeShot(0.35, {
			spread: 100,
			decay: 0.91,
			scalar: 0.8
		})

		makeShot(0.1, {
			spread: 120,
			startVelocity: 25,
			decay: 0.92,
			scalar: 1.2
		})

		makeShot(0.1, {
			spread: 120,
			startVelocity: 45
		})
	}, [makeShot])

	useEffect(() => {
		if (win === true) {
			fire()
			playSound('win', 0.2)
		}

		if (win !== undefined && queries.timemode) {
			// compute time_taken in seconds from recorded startTime
			if (startTime) {
				timeTaken = (Date.now() - startTime) / 1000
			}

			console.log("difficulty", queries.difficulty)
			console.log("timeTaken", timeTaken)
		}
	}, [win])

	//placeholder message
	function placeholderMessage() {
		if (win === true) {
			return `Good job ${inputValue}!`
		}
		else {
			return `Nice try ${inputValue}!`
		}
	}
	//submit function for player name
	function handleSubmit(e) {
		e.preventDefault()
		const submittedName = inputValue.trim();
		if (!submittedName) return;

		// existing UI updates
		setPlayerName(submittedName);
		setPlaceholder(placeholderMessage());   // or placeholderMessage(submittedName) if you change it
		setInputValue("");
		setSubmitted(true);
		console.log("Submitted name:", submittedName);

		// build payload for backend 

		const payload = {
			correct_answers: score || 0,
			total_questions: queries.infinitymode ? null : Number(queries.questions) || null,
			time_taken: timeTaken,
			difficulty: queries.difficulty || 'medium',
			categories_list: queries.categories || [],
			mode: queries.timemode ? 'timed' : 'practice',
			player_name: submittedName
		};

		console.log("payload", payload);
		// Send to backend — default to localhost:8000 for development, for production an env variable NEXT_PUBLIC_BACKEND_URL will have to be set pointing to the production backend url
		const base =
			typeof window !== "undefined" && process.env.NEXT_PUBLIC_BACKEND_URL
			? process.env.NEXT_PUBLIC_BACKEND_URL
			: "http://localhost:8000";

		const url = `${base}/api/games/`;

		fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		})
			.then((res) => {
			if (!res.ok) {
				return res
				.text()
				.then((t) => Promise.reject(new Error(t || res.statusText)));
			}
			return res.json().catch(() => null);
			})
			.then((data) => {
			console.debug("Leaderboard data saved", data);
			})
			.catch((err) => {
			console.error("Failed to save leaderboard data", err);
			});
	}
	function closeDialog () {
		playSound('pop', 0.2)
		document.getElementById('gameoverdialog').close()
		document.getElementById('gameoverbg').style.display = 'none'
	}

	function finalImage () {
		if (queries.infinitymode) return <Image src={trophyIcon} width={100} height={200} alt='Trophy' />
		if (win === true) return <AiFillCheckCircle className='text-8xl text-green-500' />
		return <AiFillCloseCircle className='text-8xl text-red-500' />
	}
	function finalTitle () {
		if (queries.infinitymode) return 'Congratulations!'
		if (win === true) return 'You Win!'
		return 'You Lose!'
	}

	function finalText () {
		if (queries.infinitymode) return `You answered well ${score} questions!`
		if (win === true) return 'Congratulations! \nQuiz completed successfully.'
		return 'Better luck next time! \nYou can try again.'
	}

	return (
		<>
			<div onClick={closeDialog} id="gameoverbg" className='transition-all fixed z-30 w-screen h-screen backdrop-blur-sm top-0 left-0'></div>

			<ReactCanvasConfetti refConfetti={getInstance} style={canvasStyles} />

			<dialog id='gameoverdialog' open={true} className='fixed m-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 max-w-md px-6 py-12 rounded-md bg-white text-slate-900 z-40'>
				<button className='absolute top-2 right-2 text-3xl hover:scale-105' onClick={closeDialog}>
					<IoCloseSharp />
				</button>

				<div className='flex flex-col items-center gap-4'>
					{finalImage()}
					<h2 className='text-2xl font-bold'>{finalTitle()}</h2>
					<p className='text-center mb-3 whitespace-pre-line'>
						{finalText()}
					</p>
					<form onSubmit={handleSubmit} className='flex flex-col items-center w-full'>
						<div className='w-full max-w-xs flex gap-2'>
							<input
								type='text'
								className='mb-3 px-3 py-2 border border-gray-300 rounded-md w-full text-center'
								placeholder={placeholder}
								value={inputValue}
								onChange={(e) => setInputValue(e.target.value)}
								onKeyDown={e => { if (e.key === 'Enter') handleSubmit(e) }}
							/>
							<button type='submit' className='mb-3 px-4 py-2 bg-green-500 text-white rounded-md hover:opacity-90'>
								Submit
							</button>
						</div>
					</form>
					<div className='flex gap-6 items-center'>
						<Link href="/" className='px-5 md:px-10 hover:opacity-75 bg-slate-200 py-3 rounded-md transition-colors'>
							<BiArrowBack color='#0f172a' className='text-xl mr-1 inline-block' title='' />
							Go back
						</Link>
						<button onClick={() => document.getElementById('newGameDialog').showModal()} className='btn-primary px-5 md:px-10 py-3 uppercase tracking-widest rounded-md bg-blue-500 text-white'>
							{queries.infinitymode || win !== false ? 'Play Again' : 'Try Again'}
						</button>
					</div>
				</div>
			</dialog>
		</>
	)}
