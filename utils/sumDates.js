const addDays = (date, numOfDays) => {
	const dateCopy = new Date(date.getTime());

	dateCopy.setDate(dateCopy.getDate() + numOfDays);

	return dateCopy;
};

module.exports = { addDays };
