let iframe: HTMLIFrameElement;
let iframePort: MessagePort | undefined;

document.addEventListener('mousemove', sendRect, { capture: true });

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
	if (msg?.ext !== 'Styl') return;

	if (msg.type === 'elementpicker') {
		switch (msg.action) {
			case 'start':
				injectIframe(msg.uniqueid);
		}
	}

	return true;
});

async function injectIframe(uniqueid: string) {
	iframe = document.createElement('iframe');
	document.documentElement.append(iframe);
	iframe.addEventListener(
		'load',
		() => {
			iframe.id = uniqueid;
			const channel = new MessageChannel();
			iframePort = channel.port1;
			// iframePort.onmessage = (ev) => {
			// 	onDialogMessage(ev.data || {});
			// };
			iframePort.onmessageerror = () => {
				stopElementPicker();
			};
			// iframe.contentWindow?.postMessage(
			// 	{ what: 'epickerStart' },
			// 	url.href,
			// 	[ channel.port2 ]
			// );
		},
		{ once: true }
	);
	if (iframe.contentWindow)
		iframe.contentWindow.location = window.location.href + '/elementpicker/';
}

function stopElementPicker() {
	if (iframePort) {
		iframePort.close();
		iframePort = undefined;
	}
}

async function sendRect(e: MouseEvent) {
	const elements = document.elementsFromPoint(e.pageX, e.pageY);
	const points = await getPoints(elements);

	iframePort?.postMessage({
		points: points,
	});
}

function getPoints(elements: any[]) {
	for (const e of elements) {
		let rect: DOMRect = e.getBoundingClientRect();

		if (rect.width !== 0 && rect.height !== 0) {
			return {
				x1: rect.x,
				y1: rect.y,
				x2: rect.x + rect.width,
				y2: rect.y + rect.height + 0,
			};
		}

		if (e.shadowRoot instanceof DocumentFragment) {
			return getPoints(e.shadowRoot);
		}

		getPoints(Array.from(e.children));
	}
	return undefined; //Return empty rect to remove existing border
}

// import { startElementPicker } from 'dist/elementPicker.js';

// // //https://stackoverflow.com/questions/53024819/sendresponse-not-waiting-for-async-function-or-promises-resolve/53024910#53024910
// chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
// 	if (msg.ext !== 'Styl') return;

// 	switch (msg.action) {
// 		case 'elementpicker':
// 			startElementPicker();
// 	}

// 	return true; // keep the messaging channel open for sendResponse
// });

// chrome.runtime.sendMessage('requestStyls', (response: any) => {
//   if (response.styls) ApplyStyles(response.styls);

//   //
//   // document.addEventListener('DOMContentLoaded', function () {
//   //   ApplyIframes();
//   //   iframeObserver.start();
//   // });
// });

// async function ApplyStyles(styls: string) {
//   let styleSheet = new CSSStyleSheet();
//   styleSheet.replaceSync(styls);
//   document.adoptedStyleSheets.push(styleSheet);
// }

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {});
