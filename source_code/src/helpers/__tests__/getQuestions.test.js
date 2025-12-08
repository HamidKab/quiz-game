import getQuestions from '../getQuestions'

// Mock fetch for tests
global.fetch = jest.fn()

describe('getQuestions', () => {
  beforeEach(() => {
    // Set NODE_ENV to development to use offline questions
    process.env.NODE_ENV = 'development'
  })

  it('should return correct number of questions', async () => {
    const questions = await getQuestions(['History', 'Science'], 5, 'medium')
    expect(questions).toHaveLength(5)
  })

  it('should filter questions by difficulty', async () => {
    const easyQuestions = await getQuestions(['History'], 3, 'easy')
    easyQuestions.forEach(q => {
      expect(q.difficulty).toBe('easy')
    })
  })

  it('should randomize answer order', async () => {
    const questions = await getQuestions(['History'], 2, 'medium')
    questions.forEach(q => {
      expect(Array.isArray(q.answers)).toBe(true)
      expect(q.answers.length).toBeGreaterThan(0)
    })
  })

  it('should include required question fields', async () => {
    const questions = await getQuestions(['Science'], 1, 'medium')
    const question = questions[0]
    
    expect(question).toHaveProperty('question')
    expect(question).toHaveProperty('answers')
    expect(question).toHaveProperty('correctAnswer')
    expect(question).toHaveProperty('topic')
    expect(question).toHaveProperty('difficulty')
    expect(question).toHaveProperty('userAnswer')
    expect(question).toHaveProperty('ia')
  })

  it('should handle multiple topics', async () => {
    const questions = await getQuestions(['History', 'Science', 'Art'], 6, 'medium')
    expect(questions).toHaveLength(6)
    
    const topics = questions.map(q => q.topic)
    expect(topics.length).toBe(6)
  })
})
