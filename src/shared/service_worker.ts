const excludedUrls = ['https://www.google.com'];

chrome.runtime.onInstalled.addListener(() => {});

chrome.sidePanel
	.setPanelBehavior({ openPanelOnActionClick: true })
	.catch((error) => console.error(error));

chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
	if (!tab.url) return;
	const url = new URL(tab.url);
	// Enables the side panel on google.com
	if (excludedUrls.includes(url.origin)) {
		await chrome.sidePanel
			.setOptions({
				tabId,
				enabled: false,
			})
			.catch((error) => console.error(error));
	} else {
		// Disables the side panel on all other sites
		await chrome.sidePanel
			.setOptions({
				tabId,
				path: '../src/sidepanel/sidepanel.html',
				enabled: true,
			})
			.catch((error) => console.error(error));
	}
});

// //Move everything to oninstalled for prod
// chrome.sidePanel
//   .setPanelBehavior({ openPanelOnActionClick: true })
//   .catch((error) => console.error(error));
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   // db.styls.where("match_fragments")..startsWithIgnoreCase("v").toArray(function (a) {
//   // 	alert("Found " + a.length + " emails containing a word starting with 'v'");
//   // });

//   if (message !== 'requestStyls') return;

//   db.styls
//     .filter((s: { url_match: string }) =>
//       new RegExp(s.url_match).test(sender.url ?? '')
//     )
//     .toArray()
//     .then((styls: styl[]) =>
//       sendResponse({
//         styls: styls
//           .map((s) => s.css_content)
//           .join(' ')
//           .replace(/\n/g, ' '),
//       })
//     );
// });
// chrome.runtime.onInstalled.addListener(() => {});

// function saveStyle() {
//   //   s.url_match.replace(/\\\*/g, '.*');
// }
