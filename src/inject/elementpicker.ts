let iframe: HTMLIFrameElement;

document.addEventListener('DOMContentLoaded', (event) => {
	iframe = document.createElement('iframe');
	document.documentElement.append(iframe);
});

chrome.runtime.onMessageExternal.addListener((msg, sender, sendResponse) => {
	console.log(msg);
	if (msg?.ext + '' !== 'Styl') return;

	if (msg.type === 'elementpicker') {
		switch (msg.action) {
			case 'mousemove':
				drawRect(msg.rect);
			case 'urlchange':
				updatePage(new URL(msg.url));
		}
	}

	return true;
});

function drawRect(rect: DOMRect) {}

function updatePage(url: URL) {
	if (!iframe?.contentWindow) return;

	iframe.contentWindow.location = url.href;
	iframe.contentWindow.addEventListener(
		'message',
		(event) => {
			console.log(event.data);
		},
		false
	);
}

// export const injectPickerScript = async (urlString: string) => {
// 	const url = new URL(urlString);

// 	return new Promise((resolve) => {
// 		iframe = document.createElement('iframe');
// 		const uuid = v4();

// 		iframe.addEventListener(
// 			'load',
// 			() => {
// 				iframe.id = uuid;
// 				// const channel = new MessageChannel();
// 				// pickerFramePort = channel.port1;
// 				// pickerFramePort.onmessage = (ev) => {
// 				// 	onDialogMessage(ev.data || {});
// 				// };
// 				// pickerFramePort.onmessageerror = () => {
// 				// 	quitPicker();
// 				// };
// 				// iframe.contentWindow.postMessage({ what: 'epickerStart' }, url.href, [
// 				// 	channel.port2,
// 				// ]);
// 				resolve(iframe);
// 			},
// 			{ once: true }
// 		);
// 		document.documentElement.append(iframe);
// 		if (iframe.contentWindow) iframe.contentWindow.location = url.href;
// 	});
// };

// const highlightElements = function (elems, force) {
// 	// To make mouse move handler more efficient
// 	if (
// 		force !== true &&
// 		elems.length === targetElements.length &&
// 		(elems.length === 0 || elems[0] === targetElements[0])
// 	) {
// 		return;
// 	}
// 	targetElements = [];

// 	const ow = self.innerWidth;
// 	const oh = self.innerHeight;
// 	const islands = [];

// 	for (const elem of elems) {
// 		if (elem === picker) {
// 			continue;
// 		}
// 		const rect = getElementRect(elem);
// 		// Ignore offscreen areas
// 		if (
// 			rect.left > ow ||
// 			rect.top > oh ||
// 			rect.left + rect.width < 0 ||
// 			rect.top + rect.height < 0
// 		) {
// 			continue;
// 		}
// 		islands.push(
// 			`M${rect.left} ${rect.top}h${rect.width}v${rect.height}h-${rect.width}z`
// 		);
// 	}

// 	pickerFramePort.postMessage({
// 		what: 'svgPaths',
// 		ocean: `M0 0h${ow}v${oh}h-${ow}z`,
// 		islands: islands.join(''),
// 	});
// };

// injectPickerScript(document.URL);
