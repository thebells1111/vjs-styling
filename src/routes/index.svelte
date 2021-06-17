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
				loadScript('/dist/videojs-contrib-quality-levels.js'),
				loadScript('/dist/test.js'),
				loadScript('/dist/topbar.js'),
				loadScript('/dist/title-overlay.js'),
				loadScript('/dist/subtitle-overlay.js'),
				loadScript('/dist/progressBar.js')
			]);
		})();

		loadStyle('/videojs.css');
		loadStyle('/test.css');

		await scriptPromise;

		//https://nikushx.com/blog/2019/05/21/creating-custom-components-with-video-js/

		$player = videojs('video', {
			playbackRates: ['0.50', '0.75', '1.00', '1.25', '1.50', '2.00', '2.50', '3.00'],
			controlBar: {
				children: [
					{
						name: 'CurrentTimeDisplay'
					},

					{
						name: 'DurationDisplay'
					},

					{
						name: 'PlaybackRateMenuButton'
					},

					{
						name: 'playToggle'
					}
				]
			}
		});

		$player.addChild(new ProgressControlBar($player, {}));
		let topBar = $player.addChild(new TopBar($player, {}));
		let title = new Title($player, {
			text: 'Title',
			parent: topBar
		});
		let subtitle = new Subtitle($player, {
			text: 'Subtitle',
			parent: topBar
		});
		topBar.addChild('SubsCapsButton');
		topBar.addChild(title);

		topBar.addChild(subtitle);
		topBar.addChild('FullscreenToggle');

		$player.maxQualitySelector({
			displayMode: 1,
			index: 5
		});

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
			// title.updateTitle('New Title');
			title.updateText('Super Long and a really long long long New Title');
			subtitle.updateText('Super Long and a really long long long New Subtitle');
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
