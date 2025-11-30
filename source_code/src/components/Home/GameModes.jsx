import { ImInfinite } from 'react-icons/im'
import { BiTimeFive } from 'react-icons/bi'
import { TbDeviceGamepad2 } from 'react-icons/tb'

const gameModes = [
	{
		icon: <TbDeviceGamepad2 className='text-3xl' />,
		title: 'Classic',
		description: 'Complete questions without fail to win! You have wildcards that can help you'
	},
	{
		icon: <BiTimeFive className='text-3xl' />,
		title: 'Time',
		description: 'Complete questions within the time limit to win! You can use wildcards'
	},
	{
		icon: <ImInfinite className='text-3xl' />,
		title: 'Infinite',
		description: 'Break your record by completing as many questions as you can! You can use wildcards'
	}
]

export default function GameModes () {
	return (
		<section className='gm-force-light lg:max-w-6xl mx-auto lg:col-start-1 lg:col-end-2 px-8 py-6 flex flex-col justify-center bg-[url("/bg-gamemodes.svg")] w-full'>
			<h2 className=' gm-force-light text-2xl mb-4 font-medium text-slate-900'>Game modes </h2>
			<nav>
				<ul className='flex flex-col sm:flex-row justify-center gap-5'>
					{gameModes.map((mode, index) => (
						<li key={index + mode.title} className='gm-card  max-w-sm md:max-w-none rounded p-5 hover:scale-[1.03] transition-all shadow-sm mx-auto'>
							{mode.icon}
							<h3 className=' gm-force-light text-xl font-medium my-1 text-slate-900'>{mode.title}</h3>
							<p className=' gm-force-light text-sm text-slate-900'>{mode.description}</p>
						</li>
					))}
				</ul>
			</nav>
		</section>
	)
}
