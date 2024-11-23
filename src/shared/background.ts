chrome.runtime.onInstalled.addListener(() => {
	chrome.action.onClicked.addListener((tab) => {
		chrome.debugger.attach(
			{ tabId: tab.id },
			'1.0',
			onAttach.bind(null, tab.id)
		);
	});
});

function onAttach(tabId?: number) {
	if (chrome.runtime.lastError) {
		alert(chrome.runtime.lastError.message);
		return;
	}

	if (tabId)
		chrome.windows.create({
			url: 'headers.html?' + tabId,
			type: 'popup',
			width: 800,
			height: 600,
		});
}

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
