export default function Menu({ resetGame }) {
	return (
		<div className="flex items-end md:-mt-3.5 md:mb-3">
			<button
				className="rounded-[--border-radius] border-[3px] border-solid border-light-red bg-white p-2 font-bold text-light-red hover:cursor-pointer hover:bg-light-red hover:text-white md:p-1.5"
				onClick={resetGame}
			>
				Reset Game
			</button>
			<a
				href="/projects/games"
				class="ml-auto inline-block rounded-[--border-radius] border-[3px] border-solid border-light-red bg-white p-2 font-bold text-light-red hover:cursor-pointer hover:bg-light-red hover:text-white md:p-1.5"
			>
				Other Games
			</a>
		</div>
	)
}
