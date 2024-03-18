import { useStore } from '@nanostores/react'
import { counter } from '../stores/counter'

export default function Counter() {
	const $counter = useStore(counter)
	return <button onClick={() => counter.set($counter + 1)}>{$counter}</button>
}
