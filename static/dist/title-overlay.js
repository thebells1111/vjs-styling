/**
 * A videojs plugin to display a logo image on the player.
 */
class Title extends videojs.getComponent('Component') {
  
  constructor(player, options) {
    super(player);   
    this.div = null;
    this.titleDiv = null;
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
    this.updateText = (text)=>{this.titleDiv.textContent = text}
   
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
    const parent = this.options.parent.el() || this.player.el();

    // Create div element
    const div = document.createElement('div');
    this.div = div;

    div.classList.add('vjs-title');    
  
    const title = document.createElement('p'); 
    title.textContent = this.options.text
    title.classList.add('vjs-title-text');
    div.appendChild(title);
    this.titleDiv = title

    parent.appendChild(div);
  
  }
 
}


// videojs.registerPlugin('title', Title);