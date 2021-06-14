 (function(factory) {
  if (typeof define === 'function' && define['amd']) {
    define('videojs-titleoverlay',['video.js'], function(videojs){ factory(window, document, videojs) });
  } else if (typeof exports === 'object' && typeof module === 'object') {
    var vjs = require('video.js');
    factory(window, document, vjs);
  } else {
    factory(window, document, videojs);
  }
})(function(window, document, videojs) {
  "use strict";

  // support es6 style import
  videojs = videojs.default || videojs;
  

  /**
   * Initialize plugin
   * @param {object} - Player supported options (debug, title, floatPosition, margin, fontSize)
   */
  var init = function(options) {
      this.titleoverlay = new TitleOverlayPlugin(this, options);
  }

  var TitleOverlayPlugin = function(player, options) {    
      
      this.player = player;
      
      this.controlPrefix = player.id() + '-';
      
      /**
       * Assign title for player
       * @param {string} - Player clip title 
       */
      this.updateTitle = function(titleText) {
          updateTitle_(titleText);
      };

      /**
       * Show the title overlay
       */
      this.showOverlay = function() {
          showOverlay_();
      };

      /**
       * Hide the title overlay
       */
      this.hideOverlay = function() {
          hideOverlay_();
      }

      /**
       * Assigns the unique id and class names to the given element as well as the style class
       * @param {HTMLElement} - Element to attach to
       * @param {string} - Name of the control
       * @private
       */
      var assignControlAttributes_ = function(element, controlName) {
          element.id = this.controlPrefix + controlName;
          element.className = this.controlPrefix + controlName + ' ' + controlName;
      }.bind(this);

      var createOverlayContainer_ = function() {
          this.playerEl = player.el();
          this.titleOverlayContainer = this.playerEl.appendChild(document.createElement('div'));
          assignControlAttributes_(this.titleOverlayContainer, 'title-overlay-container');

          this.titleOverlayTextContainer = this.titleOverlayContainer.appendChild(document.createElement('div'));                
          this.titleOverlayTextContainer.textContent = options.title || title_defaults.title;
         
         

          this.subtitleOverlayTextContainer = this.titleOverlayContainer.appendChild(document.createElement('div'));         
          this.subtitleOverlayTextContainer.textContent = options.subtitle || '';
          
          showOverlay_();
      }.bind(this);

      var updateTitle_ = function(titleText) {         
          this.titleOverlayTextContainer.textContent = titleText;
      }.bind(this);

      var showOverlay_ = function() {
          this.titleOverlayContainer.style.visibility = 'visible';
          this.titleOverlayContainer.style.opacity = '1';
          this.titleOverlayContainer.style.transition = 'opacity 0.5s linear';
      }.bind(this);

      var hideOverlay_ = function() {
          this.titleOverlayContainer.style.visibility = 'hidden';
          this.titleOverlayContainer.style.opacity = '0';
          this.titleOverlayContainer.style.transition = 'visibility 0s 0.5s, opacity 0.5s linear';
      }.bind(this);

      createOverlayContainer_();

      this.player.on('pause', function() {
          showOverlay_();
      });

      this.player.on('play', function() {
          hideOverlay_();
      });

      this.player.on('ended', function() {
          hideOverlay_();
      })

      
  }

  // Cross-compatibility for Video.js 5 and 6.
  var registerPlugin = videojs.registerPlugin || videojs.plugin;
  registerPlugin('titleoverlay', init);
});