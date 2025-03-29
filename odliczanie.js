document.addEventListener("DOMContentLoaded", () => {
	const countdownElement = document.getElementById("countdown");
	const stageElement = document.getElementById("stage");
	const startButton = document.getElementById("startButton");
	const stopButton = document.getElementById("stopButton");

	let interval = null;
	let countUpTime = 5;
	let stageNumber = 1;
	let stopped = false;
	const maxTime = 40;

	function clearExistingInterval() {
		if (interval) {
			clearInterval(interval);
			interval = null;
		}
	}

	function startCountdown(seconds, onComplete) {
		let milliseconds = 0;
		clearExistingInterval();
		stopped = false;

		interval = setInterval(() => {
			if (stopped) {
				clearExistingInterval();
				return;
			}

			countdownElement.textContent = `${seconds}.${milliseconds
				.toString()
				.padStart(3, "0")}`;
			stageElement.textContent = "Przerwa";

			if (seconds === 0 && milliseconds === 0) {
				clearExistingInterval();
				onComplete();
			} else {
				if (milliseconds === 0) {
					seconds--;
					milliseconds = 990;
				} else {
					milliseconds -= 10;
				}
			}
		}, 10);
	}

	function countUp(targetSeconds, onComplete) {
		let seconds = 0;
		let milliseconds = 0;
		clearExistingInterval();
		stopped = false;

		stageElement.textContent = `Stage ${stageNumber}`;

		interval = setInterval(() => {
			if (stopped) {
				clearExistingInterval();
				return;
			}

			countdownElement.textContent = `${seconds}.${milliseconds
				.toString()
				.padStart(3, "0")}`;

			if (seconds === targetSeconds) {
				clearExistingInterval();
				onComplete();
			} else {
				if (milliseconds === 990) {
					seconds++;
					milliseconds = 0;
				} else {
					milliseconds += 10;
				}
			}
		}, 10);
	}

	function startSequence() {
		startButton.disabled = true;
		stopButton.disabled = false;
		stageElement.textContent = "Przygotuj się...";
		stopped = false;
		countUpTime = 5;
		stageNumber = 1;

		setTimeout(() => {
			startCountdown(5, () => {
				function nextStep() {
					if (stopped || countUpTime > maxTime) {
						stageElement.textContent = "Koniec!";
						startButton.disabled = false;
						stopButton.disabled = true;
						return;
					}

					countUp(countUpTime, () => {
						if (stopped) return;

						startCountdown(15, () => {
							countUpTime += 5;
							stageNumber++;
							nextStep();
						});
					});
				}

				nextStep();
			});
		}, 1000);
	}

	function stopSequence() {
		stopped = true;
		clearExistingInterval();
		countdownElement.textContent = "0.000";
		stageElement.textContent = "Zatrzymano!";
		startButton.disabled = false;
		stopButton.disabled = true;
	}

	startButton.addEventListener("click", startSequence);
	stopButton.addEventListener("click", stopSequence);
});
