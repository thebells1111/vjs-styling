class TopBar extends videojs.getComponent('Component') {
	constructor(player, options = {}) {
		super(player, options);
		this.player = player;
		this.addClass('vjs-controls');
		this.addClass('vjs-top-bar');
		this.topbar = this.el();
		this.player.on('useractive', () => {
			this.el().classList.add('vjs-user-active');
			this.el().classList.remove('vjs-user-inactive');
		});
		this.player.on('userinactive', () => {
			if (!player.paused()) {
				this.el().classList.add('vjs-user-inactive');
				this.el().classList.remove('vjs-user-active');
			}
		});
	}
}
