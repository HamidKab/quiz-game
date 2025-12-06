import getQuestions from '@/helpers/getQuestions'

export const useQuestionsStore = (set, get) => ({
	questions: [],
	startTime: null,
	loading: false,
	loadingInfinity: false,
	error: [false, ''],
	currentQuestion: 1,
	score: 1,
	win: undefined,
	getQuestions: (topics, number, infinity, difficulty) => {
		infinity ? set({ loadingInfinity: true }) : set({ loading: true })
		getQuestions(topics, number, difficulty)
			.then(data => set({ questions: data }))
			.catch(err => set({ error: [true, err] }))
			.finally(() => infinity ? set({ loadingInfinity: false }) : set({ loading: false }))
	},

	setStartTime: (ts) => set({ startTime: ts }),

	setCurrentQuestion: (number) => set({ currentQuestion: number }),
	setUserAnswer: (question, answer) => {
		if (get().queries.infinitymode) return
		set(state => {
			const questions = [...state.questions]
			questions[question].userAnswer = answer
			return { questions }
		})
	},
	cleanQuestions: () => set({ questions: [], score: 1, currentQuestion: 1, win: undefined }),
	setScore: (score) => set({ score }),
	setWin: (win) => set({ win })
})
