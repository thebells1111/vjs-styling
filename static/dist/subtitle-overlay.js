/**
 * A videojs plugin to display a logo image on the player.
 */
class Subtitle extends videojs.getComponent('Component') {
	constructor(player, options) {
		super(player);
		this.div = null;
		this.subtitleDiv = null;
		this.player = player;
		this.options = videojs.mergeOptions(options);
		this.player.ready(() => this._onPlayerReady());
		this.player.on('useractive', () => {
			this.div.classList.add('vjs-user-active');
			this.div.classList.remove('vjs-user-inactive');
		});
		this.player.on('userinactive', () => {
			if (!player.paused()) {
				this.div.classList.add('vjs-user-inactive');
				this.div.classList.remove('vjs-user-active');
			}
		});
		this.updateText = (text) => {
			this.subtitleDiv.textContent = text;
		};
	}

	/**
	 * Start the plugin after the player is ready.
	 *
	 * @private
	 */
	_onPlayerReady() {
		if (!this.options.text) {
			return;
		}
		this._setup();
	}

	_setup() {
		const parent = this.player.el();

		// Create div element
		const div = document.createElement('div');
		this.div = div;

		div.classList.add('vjs-subtitle');

		const subtitle = document.createElement('p');
		subtitle.textContent = this.options.text;
		subtitle.classList.add('vjs-subtitle-text');
		div.appendChild(subtitle);
		this.subtitleDiv = subtitle;

		parent.appendChild(div);
	}

	_updateTitle(titleText) {
		console.log(this);
	}
}

// videojs.registerPlugin('title', Title);
