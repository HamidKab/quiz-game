import queryValidator, { defaultQuery, difficulties } from '../gameConfig'

describe('gameConfig', () => {
  describe('queryValidator', () => {
    it('should return default values for empty query', () => {
      const result = queryValidator({})
      expect(result.questions).toBe(5)
      expect(result.time).toBe(20)
      expect(result.difficulty).toBe('medium')
      expect(result.infinitymode).toBe(false)
      expect(result.timemode).toBe(false)
    })

    it('should validate difficulty levels', () => {
      expect(queryValidator({ difficulty: 'easy' }).difficulty).toBe('easy')
      expect(queryValidator({ difficulty: 'medium' }).difficulty).toBe('medium')
      expect(queryValidator({ difficulty: 'hard' }).difficulty).toBe('hard')
      expect(queryValidator({ difficulty: 'invalid' }).difficulty).toBe('medium')
    })

    it('should clamp questions to min/max range', () => {
      expect(queryValidator({ questions: 2 }).questions).toBe(4)
      expect(queryValidator({ questions: 15 }).questions).toBe(10)
      expect(queryValidator({ questions: 7 }).questions).toBe(7)
    })

    it('should clamp time to valid range', () => {
      expect(queryValidator({ time: 5 }).time).toBe(10)
      expect(queryValidator({ time: 100 }).time).toBe(60)
      expect(queryValidator({ time: 30 }).time).toBe(30)
    })

    it('should handle boolean mode flags', () => {
      expect(queryValidator({ infinitymode: 'true' }).infinitymode).toBe(true)
      expect(queryValidator({ timemode: true }).timemode).toBe(true)
      expect(queryValidator({ infinitymode: 'false' }).infinitymode).toBe(false)
    })
  })

  describe('difficulties', () => {
    it('should export difficulty levels', () => {
      expect(difficulties).toEqual(['easy', 'medium', 'hard'])
    })
  })

  describe('defaultQuery', () => {
    it('should have correct default values', () => {
      expect(defaultQuery.questions).toBe(5)
      expect(defaultQuery.time).toBe(20)
      expect(defaultQuery.difficulty).toBe('medium')
      expect(defaultQuery.infinitymode).toBe(false)
      expect(defaultQuery.timemode).toBe(false)
      expect(Array.isArray(defaultQuery.categories)).toBe(true)
    })
  })
})
