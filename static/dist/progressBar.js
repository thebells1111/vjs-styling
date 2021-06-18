class ProgressControlBar extends videojs.getComponent('ProgressControl') {
	constructor(player, options = {}) {
		super(player, options);
		this.addClass('progress-control-bar');
		this.addChild('CurrentTimeDisplay');
		this.addChild('DurationDisplay');
		player.on('play', () => {
			this.addClass('has-started');
			// this.addClass('vjs-user-inactive');
			// this.removeClass('vjs-user-active');
		});
		player.on('pause', () => {
			// this.addClass('vjs-user-active');
			// this.removeClass('vjs-user-inactive');
		});
		player.on('useractive', () => {
			this.addClass('vjs-user-active');
			this.removeClass('vjs-user-inactive');
		});
		player.on('userinactive', () => {
			if (!player.paused()) {
				this.addClass('vjs-user-inactive');
				this.removeClass('vjs-user-active');
			}
		});
	}
}
