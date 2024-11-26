let extensionId: string;

document.addEventListener('mousemove', sendRect, { capture: true });

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
	if (msg?.ext !== 'Styl') return;

	if (msg.type === 'elementpicker') {
		switch (msg.action) {
			case 'urlchange':
				extensionId = msg.extensionid;
		}
	}

	return true;
});

async function sendRect(e: MouseEvent) {
	const elements = document.elementsFromPoint(e.pageX, e.pageY);
	const rect = await getElementRect(elements);
	await chrome.runtime.sendMessage(extensionId, {
		ext: 'Styl',
		type: 'elementpicker',
		action: 'mousemove',
		rect: rect,
	});
	return true;
}

function getElementRect(elements: any[]) {
	for (const e of elements) {
		let rect: DOMRect = e.getBoundingClientRect();

		if (rect.width !== 0 && rect.height !== 0) {
			return rect;
		}

		if (e.shadowRoot instanceof DocumentFragment) {
			return getElementRect(e.shadowRoot);
		}

		getElementRect(Array.from(e.children));

		return rect; //Return empty rect to remove existing border
	}
	return undefined;
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
