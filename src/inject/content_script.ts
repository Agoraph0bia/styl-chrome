chrome.runtime.sendMessage('requestStyls', (response: any) => {
  if (response.styls) ApplyStyles(response.styls);

  //
  // document.addEventListener('DOMContentLoaded', function () {
  //   ApplyIframes();
  //   iframeObserver.start();
  // });
});

async function ApplyStyles(styls: string) {
  let styleSheet = new CSSStyleSheet();
  styleSheet.replaceSync(styls);
  document.adoptedStyleSheets.push(styleSheet);
}

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {});
