let creating: any;
let offscreenUrl = '../src/inject/elementpicker.html';

document
	.getElementById('element-picker-button')
	?.addEventListener('click', async () =>
		closeExistingContext().then(createElementPicker).then(closeSidePanel)
	);

async function createElementPicker() {
	if (!creating) {
		creating = chrome.offscreen.createDocument({
			url: offscreenUrl,
			reasons: [
				chrome.offscreen.Reason.IFRAME_SCRIPTING,
				chrome.offscreen.Reason.DOM_SCRAPING,
			],
			justification:
				'Overlay semi-transparent document on top of current document and capture mouse events',
		});
		await creating;
		creating = null;
	}
}

async function closeExistingContext() {
	const existingContexts = await chrome.runtime.getContexts({
		contextTypes: [chrome.runtime.ContextType.OFFSCREEN_DOCUMENT],
		documentUrls: [offscreenUrl],
	});

	existingContexts?.forEach((c) => chrome.offscreen.closeDocument());
}

async function closeSidePanel() {
	window.close();
}
