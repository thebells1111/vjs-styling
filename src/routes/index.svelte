<script>
	import { writable } from 'svelte/store';
	const player = writable(null);

	initVideoJsHlsJsPlugin();

	let width;

	async function initVideoJsHlsJsPlugin() {
		function waitForGlobalObject(objectName, objectNextName) {
			return new Promise((resolve) => {
				function check() {
					if (
						window[objectName] !== undefined &&
						(objectNextName === undefined || window[objectName][objectNextName] !== undefined)
					) {
						resolve();
					} else {
						setTimeout(check, 200);
					}
				}

				check();
			});
		}

		function loadScript(src) {
			return new Promise((resolve, reject) => {
				const script = document.createElement('script');
				script.type = 'text/javascript';
				script.onload = () => {
					resolve();
				};
				script.onerror = () => {
					console.log('Failed to load script', src);
					reject();
				};
				script.src = src;
				document.head.appendChild(script);
			});
		}

		function loadStyle(src) {
			return new Promise((resolve, reject) => {
				const link = document.createElement('link');
				link.rel = 'stylesheet';
				link.type = 'text/css';
				link.onload = () => {
					resolve();
				};
				link.onerror = () => {
					console.log('Failed to load CSS', src);
					reject();
				};
				link.href = src;
				document.head.appendChild(link);
			});
		}

		const scriptPromise = await (async () => {
			await loadScript('https://vjs.zencdn.net/7.6.0/video.js');
			await Promise.all([
				loadScript(
					'https://cdn.streamroot.io/videojs-hlsjs-plugin/1/stable/videojs-hlsjs-plugin.js'
				),
				loadScript(
					'https://cdn.jsdelivr.net/npm/videojs-contrib-quality-levels@latest/dist/videojs-contrib-quality-levels.min.js'
				),
				loadScript(
					'https://cdn.jsdelivr.net/npm/videojs-http-source-selector@latest/dist/videojs-http-source-selector.js'
				),
				loadScript('/dist/overlay.js')
			]);
		})();

		loadStyle('https://vjs.zencdn.net/7.6.0/video-js.css');
		loadStyle('/test.css');

		await scriptPromise;

		//https://nikushx.com/blog/2019/05/21/creating-custom-components-with-video-js/

		class ProgressControlBar extends videojs.getComponent('ProgressControl') {
			constructor(player, options = {}) {
				super(player, options);
				this.addClass('progress-control-bar');
				console.log(this);
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

		$player = videojs('video', {
			playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3],
			controlBar: {
				children: [
					{
						name: 'CurrentTimeDisplay'
					},

					{
						name: 'DurationDisplay'
					},
					{
						name: 'CustomControlSpacer'
					},

					{
						name: 'playToggle'
					},

					{
						name: 'SubsCapsButton'
					},

					{
						name: 'PlaybackRateMenuButton'
					},

					{
						name: 'fullscreenToggle'
					}
				]
			}
		});

		$player.addChild(new ProgressControlBar($player));

		let title = $player.title({
			title: 'Title',
			subtitle: 'Subtitle'
		});

		$player.httpSourceSelector();

		$player.src({
			src:
				'https://noagendatube.com/static/streaming-playlists/hls/7f80cf89-ac4e-4869-95b8-bcf8f7ca23b7/master.m3u8',
			type: 'application/x-mpegURL'
		});

		$player.addRemoteTextTrack(
			{
				src:
					'https://noagendatube.com/lazy-static/video-captions/59409f78-b820-413f-a330-647b40825eac-en.vtt',
				label: 'Caption'
			},
			false
		);

		$player.ready(function () {
			$player.volume(0.01); // 1%
			title.updateTitle('New Title');
		});
	}
</script>

<main>
	<div
		class="container embed-responsive embed-responsive-16by9"
		bind:clientWidth={width}
		style="--player-height: {width}px"
	>
		<!-- svelte-ignore a11y-media-has-caption-->
		<video
			id="video"
			class="video-js vjs-default-skin vjs-big-play-centered "
			preload="none"
			controls
			poster="https://noagendatube.com/lazy-static/avatars/06a8b6b1-08ce-4d40-912a-a5a8345c49dd.png"
		/>
	</div>
</main>

<style>
	main {
		width: 100%;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #ddd;
	}

	.container {
		width: 900px;
		height: 600px;
		border-radius: 12px;
	}

	:global(.video-js) {
		height: 100%;
		width: 100%;
		border-radius: 12px;
	}

	/* :global(.vjs-big-play-centered:before) {
		font-size: 1.5em;
	}

	:global(button.video-js.vjs-big-play-button) {
		font-size: 6em;
		line-height: 2em;
		height: 1.63332em;
		width: 2em;
		height: 2em;
		display: block;
		position: absolute;
		top: 10px;
		left: 10px;
		padding: 0;
		cursor: pointer;
		opacity: 1;
		background-color: #2b333f;
		background-color: rgba(43, 51, 63, 0.7);
		border-radius: 9.3em;
		transition: all 0.4s;
	}

	:global(.video-js .vjs-picture-in-picture-control) {
		cursor: pointer;
		flex: none;
		display: none;
	}

	:global(.vjs-poster) {
		border-radius: 12px;
	}
	:global(.video-js .vjs-progress-control) {
		position: absolute;
		width: 100%;
		bottom: 3em;
	}
	:global(.video-js .vjs-control-bar) {
		height: 6em;
	} */
</style>
