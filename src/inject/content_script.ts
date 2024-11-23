//https://stackoverflow.com/questions/53024819/sendresponse-not-waiting-for-async-function-or-promises-resolve/53024910#53024910
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
	if (msg.message !== 'element_picker') {
		console.log('failed');
		return;
	}

	attachDebugger(msg.tabId).then(sendResponse);
	return true; // keep the messaging channel open for sendResponse
});

async function attachDebugger(tabId: number) {
	await chrome.debugger.attach({ tabId }, '1.2');
	return true;
}

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
