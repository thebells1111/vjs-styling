let latestTap;
let isLocked = false;
// Default options for the plugin.
let touchOverlayDefaults = {
	seekLeft: {
		handleClick: (player) => {
			const time = Number(player.currentTime()) - 10;

			player.currentTime(time);
		},
		doubleTap: true
	},
	play: {
		handleClick: (player) => {
			if (player.paused()) {
				player.play();
			} else {
				player.pause();
			}
		}
	},
	seekRight: {
		handleClick: (player) => {
			const time = Number(player.currentTime()) + 30;

			player.currentTime(time);
		},
		doubleTap: true
	},
	lockButton: false
};

const controlButtons = {
	previous: { icon: 'backward', className: 'previous-button' },
	seekLeft: { icon: 'history', className: 'seek-left' },
	play: { icon: 'play', className: 'play-button' },
	seekRight: {
		icon: 'history',
		className: 'seek-right',
		extra: 'fa-flip-horizontal'
	},
	next: {
		icon: 'forward',
		className: 'next-button'
	}
};

// Cross-compatibility for Video.js 5 and 6.

// const dom = videojs.dom || videojs;

/**
 * Function to invoke when the player is ready.
 *
 * This is a great place for your plugin to initialize itself. When this
 * function is called, the player will have its DOM and child components
 * in place.
 *
 * @function onPlayerReady
 * @param    {Player} player
 *           A Video.js player object.
 *
 * @param    {Object} [options={}]
 *           A plain object containing options for the plugin.
 */
const onPlayerReady = (player, options) => {
	player.addClass('vjs-touch-overlay');

	const overlay = createOverlay(player, options);

	player.el().append(overlay);

	eventsInitialize(player, overlay);
};

const eventsInitialize = (player, overlay) => {
	const overlayRow = document.querySelector('.overlay-row');

	player.on('play', () => {
		const playButtonWrapper = document.querySelector('.play-button .button-wrapper');

		playButtonWrapper.innerHTML = `<svg height="60px" viewBox="0 0 24 24" width="60px" fill="#fff"><path d="M0 0h24v24H0z" fill="none"/><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
	});

	player.on('pause', () => {
		const playButtonWrapper = document.querySelector('.play-button .button-wrapper');

		playButtonWrapper.innerHTML = `<svg height="60px" viewBox="0 0 24 24" width="60px" fill="#fff"><path d="M0 0h24v24H0z" fill="none"/><path d="M8 5v14l11-7z"/></svg>`;
	});

	player.on('userinactive', () => {
		if (!player.paused()) {
			overlay.classList.add('d-none');
			overlayRow.classList.add('d-none');
		}
	});

	player.on('useractive', () => {
		overlay.classList.remove('d-none');
		overlayRow.classList.remove('d-none');
	});

	overlay.addEventListener('click', function (e) {
		const controlBar = document.querySelector('.vjs-control-bar');
		const progressBar = document.querySelector('.progress-control-bar');
		const title = document.querySelector('div.vjs-title');
		const subtitle = document.querySelector('div.vjs-subtitle');

		// If clicked element is overlay button, then ignore this
		if (e.target.classList.contains('icon') || e.target instanceof SVGElement) {
			return;
		}
		if (!player.paused()) {
			if (!overlayRow.classList.contains('d-none')) {
				overlayRow.classList.add('d-none');
				controlBar.classList.add('d-none');
				progressBar.classList.add('d-none');
				title.classList.add('d-none');
				subtitle.classList.add('d-none');
			} else {
				overlayRow.classList.remove('d-none');

				if (!isLocked) {
					controlBar.classList.remove('d-none');
					progressBar.classList.remove('d-none');
					title.classList.remove('d-none');
					subtitle.classList.remove('d-none');
				}
			}
		}
	});
};

const createOverlay = (player, options) => {
	if (!options || !Object.keys(options).length) {
		options = Object.assign({}, touchOverlayDefaults);
	} else {
		options = mergeOptions(options, touchOverlayDefaults);
	}

	const overlay_div = document.createElement('div');
	const row = document.createElement('div');
	const controlOverlay = document.createElement('div');

	controlOverlay.className = 'overlay-col-12 mx-auto control-overlay-buttons';
	row.className = 'overlay-row';

	overlay_div.className = 'overlay-container-fluid vjs-overlay';

	// Filter out button options
	const btnOpts = Object.keys(options).filter((button) => controlButtons.hasOwnProperty(button));

	const buttons = btnOpts.map((button) => {
		const buttonProperties = controlButtons[button];

		const element = createButton(buttonProperties);

		return { options: options[button], element };
	});

	handleClick(buttons, player);
	handleTap(buttons, player);

	if (options.lockButton) {
		const lockOverlay = document.createElement('div');

		lockOverlay.className = 'overlay-col-1 lock-overlay';

		controlOverlay.classList.remove('overlay-col-12', 'mx-auto');
		controlOverlay.classList.add('overlay-col-11');

		const lockButtonProperties = {
			icon: 'lock',
			className: 'lock-button',
			size: '2x'
		};

		const lockButton = createButton(lockButtonProperties);

		handleLockClick(lockButton);

		lockOverlay.append(lockButton);

		row.append(lockOverlay);
	}

	buttons.forEach((button) => controlOverlay.append(button.element));

	row.append(controlOverlay);
	overlay_div.append(row);

	return overlay_div;
};

const handleLockClick = (lockBtn) => {
	const [wrapperElement] = lockBtn.children;
	const controlBar = document.querySelector('.vjs-control-bar');

	wrapperElement.addEventListener('click', () => {
		const controlButtonsWrapper = Array.from(
			document.querySelectorAll('.overlay-button:not(.lock-button)')
		);

		if (isLocked) {
			wrapperElement.innerHTML = '<i class="icon fa fa-2x fa-lock"></i>';

			controlButtonsWrapper.forEach((btn) => {
				btn.classList.remove('d-none');
			});

			controlBar.classList.remove('d-none');

			isLocked = false;

			return;
		}

		wrapperElement.innerHTML = '<i class="icon fa fa-2x fa-unlock"></i>';

		controlButtonsWrapper.forEach((btn) => {
			btn.classList.add('d-none');
		});

		controlBar.classList.add('d-none');

		isLocked = true;
	});
};

const handleTap = (buttons, player) => {
	buttons = buttons.filter((button) => button.options.doubleTap && button.options.handleClick);

	buttons.forEach((button) => {
		button.element.addEventListener('click', () => {
			isDoubleTap(() => {
				button.options.handleClick(player);
			});
		});
	});
};

const handleClick = (buttons, player) => {
	buttons = buttons.filter((btn) => btn.options.handleClick);

	buttons.forEach((button) => {
		const [wrapperElement] = button.element.children;

		wrapperElement.addEventListener('click', () => button.options.handleClick(player));
	});
};

const createButton = ({ icon, extra = '', className = '', size = '4x' }) => {
	const iconEl = document.createElement('icon');

	console.log(className);

	iconEl.className = `icon fa fa-${size} fa-${icon} ${extra}`;

	const wrapper = document.createElement('div');

	wrapper.className = 'button-wrapper';
	if (className === 'play-button') {
		wrapper.innerHTML = `<svg height="60px" viewBox="0 0 24 24" width="60px" fill="#fff"><path d="M0 0h24v24H0z" fill="none"/><path d="M8 5v14l11-7z"/></svg>`;
	} else if (className === 'seek-right') {
		wrapper.innerHTML = `<svg height="48px" viewBox="0 0 24 24" width="48px" fill="#fff"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M18 13c0 3.31-2.69 6-6 6s-6-2.69-6-6 2.69-6 6-6v4l5-5-5-5v4c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8h-2zm-7.46 2.22c-.06.05-.12.09-.2.12s-.17.04-.27.04c-.09 0-.17-.01-.25-.04s-.14-.06-.2-.11-.1-.1-.13-.17-.05-.14-.05-.22h-.85c0 .21.04.39.12.55s.19.28.33.38.29.18.46.23.35.07.53.07c.21 0 .41-.03.6-.08s.34-.14.48-.24.24-.24.32-.39.12-.33.12-.53c0-.23-.06-.44-.18-.61s-.3-.3-.54-.39c.1-.05.2-.1.28-.17s.15-.14.2-.22.1-.16.13-.25.04-.18.04-.27c0-.2-.04-.37-.11-.53s-.17-.28-.3-.38-.28-.18-.46-.23-.37-.08-.59-.08c-.19 0-.38.03-.54.08s-.32.13-.44.23-.23.22-.3.37-.11.3-.11.48h.85c0-.07.02-.14.05-.2s.07-.11.12-.15.11-.07.18-.1.14-.03.22-.03c.1 0 .18.01.25.04s.13.06.18.11.08.11.11.17.04.14.04.22c0 .18-.05.32-.16.43s-.26.16-.48.16h-.43v.66h.45c.11 0 .2.01.29.04s.16.06.22.11.11.12.14.2.05.18.05.29c0 .09-.01.17-.04.24s-.08.11-.13.17zm3.9-3.44c-.18-.07-.37-.1-.59-.1s-.41.03-.59.1-.33.18-.45.33-.23.34-.29.57-.1.5-.1.82v.74c0 .32.04.6.11.82s.17.42.3.57.28.26.46.33.37.1.59.1.41-.03.59-.1.33-.18.45-.33.22-.34.29-.57.1-.5.1-.82v-.74c0-.32-.04-.6-.11-.82s-.17-.42-.3-.57-.28-.26-.46-.33zm.01 2.57c0 .19-.01.35-.04.48s-.06.24-.11.32-.11.14-.19.17-.16.05-.25.05-.18-.02-.25-.05-.14-.09-.19-.17-.09-.19-.12-.32-.04-.29-.04-.48v-.97c0-.19.01-.35.04-.48s.06-.23.12-.31.11-.14.19-.17.16-.05.25-.05.18.02.25.05.14.09.19.17.09.18.12.31.04.29.04.48v.97z"/></svg>`;
	} else if (className === 'seek-left') {
		wrapper.innerHTML = `
		<svg height="48px" viewBox="0 0 24 24" width="48px" fill="#fff"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M11.99 5V1l-5 5 5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8zm-1.1 11h-.85v-3.26l-1.01.31v-.69l1.77-.63h.09V16zm4.28-1.76c0 .32-.03.6-.1.82s-.17.42-.29.57-.28.26-.45.33-.37.1-.59.1-.41-.03-.59-.1-.33-.18-.46-.33-.23-.34-.3-.57-.11-.5-.11-.82v-.74c0-.32.03-.6.1-.82s.17-.42.29-.57.28-.26.45-.33.37-.1.59-.1.41.03.59.1.33.18.46.33.23.34.3.57.11.5.11.82v.74zm-.85-.86c0-.19-.01-.35-.04-.48s-.07-.23-.12-.31-.11-.14-.19-.17-.16-.05-.25-.05-.18.02-.25.05-.14.09-.19.17-.09.18-.12.31-.04.29-.04.48v.97c0 .19.01.35.04.48s.07.24.12.32.11.14.19.17.16.05.25.05.18-.02.25-.05.14-.09.19-.17.09-.19.11-.32.04-.29.04-.48v-.97z"/></svg>`;
	} else {
		wrapper.append(iconEl);
	}

	const button = document.createElement('div');

	button.className = `overlay-button vjs-button ${className}`;

	button.append(wrapper);

	return button;
};

const isDoubleTap = (callback) => {
	const now = new Date().getTime();
	const timeSince = now - latestTap;

	if (timeSince < 400 && timeSince > 0) {
		callback();
	}

	latestTap = new Date().getTime();
};

const mergeOptions = (originalOpts, defaultOpts) => {
	for (const key in originalOpts) {
		const userOption = originalOpts[key];
		const defaultOption = defaultOpts[key];

		if (!defaultOption) {
			continue;
		}

		for (const option in defaultOption) {
			if (!userOption.hasOwnProperty(option) && defaultOption.hasOwnProperty(option)) {
				userOption[option] = defaultOption[option];
			}
		}
	}

	return originalOpts;
};

/**
 * A video.js plugin.
 *
 * In the plugin function, the value of `this` is a video.js `Player`
 * instance. You cannot rely on the player being in a "ready" state here,
 * depending on how the plugin is invoked. This may or may not be important
 * to you; if not, remove the wait for "ready"!
 *
 * @function touchOverlay
 * @param    {Object} [options={}]
 *           An object of options left to the plugin author to define.
 */
const touchOverlay = function (options) {
	// videojs.mergeOptions(touchOverlayDefaults, options)
	this.ready(() => {
		onPlayerReady(this, options);
	});
};

// Register the plugin with video.js.
videojs.registerPlugin('touchOverlay', touchOverlay);
