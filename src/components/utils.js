export const capitalise = (str) => {
	return str.charAt(0).toUpperCase() + str.slice(1)
}

export const capitaliseAll = (str) => {
	return str
		.split(' ')
		.map((word) => capitalise(word))
		.join(' ')
}
