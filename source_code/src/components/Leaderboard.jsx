import { useEffect, useState } from 'react'

export default function Leaderboard () {
    const [performances, setPerformances] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const base = (typeof window !== 'undefined' && process?.env?.NEXT_PUBLIC_BACKEND_URL)
                    ? process.env.NEXT_PUBLIC_BACKEND_URL
                    : 'http://localhost:8000'
                const url = `${base}/api/games/leaderboard/medium/?limit=10&ordering=-correct_answers`

                const res = await fetch(url)
                if (!res.ok) throw new Error(`Failed to fetch leaderboard: ${res.statusText}`)

                const data = await res.json()
                setPerformances(data.results || data || [])
                setError(null)
            } catch (err) {
                console.error('Error fetching leaderboard:', err)
                setError(err.message)
                setPerformances([])
            } finally {
                setLoading(false)
            }
        }

        fetchLeaderboard()
    }, [])

    if (loading) return <div className='text-center py-8'>Loading leaderboard...</div>

    if (error) return <div className='text-center py-8 text-red-500'>Error: {error}</div>

    return (
        <div className='w-full max-w-2xl mx-auto p-6'>
            <h2 className='text-3xl font-bold text-center mb-8'>Top 10 Performances</h2>

            {performances.length === 0 ? (
                <p className='text-center text-gray-500'>No performances yet. Play a game to get on the leaderboard!</p>
            ) : (
                <div className='overflow-x-auto'>
                    <table className='w-full border-collapse'>
                        <thead>
                            <tr className='bg-blue-500 text-white'>
                                <th className='border border-gray-300 px-4 py-2 text-left'>Rank</th>
                                <th className='border border-gray-300 px-4 py-2 text-left'>Player Name</th>
                                <th className='border border-gray-300 px-4 py-2 text-center'>Score</th>
                                <th className='border border-gray-300 px-4 py-2 text-center'>Time (s)</th>
                                <th className='border border-gray-300 px-4 py-2 text-left'>Difficulty</th>
                            </tr>
                        </thead>
                        <tbody>
                            {performances.map((perf, idx) => (
                                <tr key={perf.id || idx} className={idx % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                                    <td className='border border-gray-300 px-4 py-2 font-bold text-blue-600'>{idx + 1}</td>
                                    <td className='border border-gray-300 px-4 py-2 text-blue-600'>{perf.player_name || 'Anonymous'}</td>
                                    <td className='border border-gray-300 px-4 py-2 text-center text-blue-600'>{perf.correct_to_total_ratio * 100}%</td>
                                    <td className='border border-gray-300 px-4 py-2 text-center text-blue-600'>{perf.time_taken ? perf.time_taken.toFixed(2) : 'N/A'}</td>
                                    <td className='border border-gray-300 px-4 py-2 capitalize text-blue-600'>{perf.difficulty || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}