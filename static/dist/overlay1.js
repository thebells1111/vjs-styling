class ToggleCaptionsButton extends videojs.getComponent('Button') {
    constructor(player, options = {}) {
        super(player, options);
        this.addClass('vjs-captions-toggle');

        // captions are "on" by default
        this.addClass('vjs-captions-on');
    }

    /**
     * Toggle the subtitle track on and off upon click
     */
    handleClick(_e) {
        const textTracks = this.player.textTracks();

        for (let i = 0; i < textTracks.length; i++) {
            if (textTracks[i].kind !== 'subtitles') {
                continue;
            }

            // toggle showing the captions
            if (textTracks[i].mode === 'showing') {
                textTracks[i].mode = 'hidden';
                this.removeClass('vjs-captions-on');
            } else {
                textTracks[i].mode = 'showing';
                this.addClass('vjs-captions-on');
            }
        }
    }
}