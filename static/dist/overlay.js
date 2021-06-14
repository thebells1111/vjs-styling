const Plugin = videojs.getPlugin('plugin');

/**
 * A videojs plugin to display a logo image on the player.
 */
class Title extends Plugin {
  
  constructor(player, options) {
    super(player);   
    this.div = null;
    this.titleDiv = null;
    this.subtitleDiv = null;
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
    this.updateTitle = (text)=>{this.titleDiv.textContent = text}
    this.updateSubtitle = (text)=>{this.subtitleDiv.textContent = text}
   
  }

  /**
   * Start the plugin after the player is ready.
   *
   * @private
   */
  _onPlayerReady() {
    this.player.addClass('vjs-title');
    if (!this.options.title) {
      return;
    }
    this._setup();   
  }

 
  _setup() {
    const video = this.player.el();

    // Create div element
    const div = document.createElement('div');
    this.div = div;

    div.classList.add('vjs-title-content');
   
    
  
    const title = document.createElement('p'); 
    title.textContent = this.options.title
    title.classList.add('vjs-title-text');
    div.appendChild(title);
    this.titleDiv = title

    if(this.options.subtitle){
    const subtitle = document.createElement('p'); 
    subtitle.textContent = this.options.subtitle
    subtitle.classList.add('vjs-subtitle-text');
    div.appendChild(subtitle);
    this.subtitleDiv = subtitle
    }   
    video.insertBefore(div, video.childNodes[0]);
  
  }
 

  _updateTitle(titleText){
    console.log(this)

  }
}


videojs.registerPlugin('title', Title);