// import { v4 } from 'uuid';

export type Points = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

let iframe: HTMLIFrameElement;
// let iframeId = v4();
let port1: MessagePort, port2: MessagePort;
let lastPoints: Points | undefined;

document.addEventListener('DOMContentLoaded', (event) => {
  if (window !== top) return;

  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    console.log('recieved');
    if (msg.type === 'elementpicker') {
      switch (msg.action) {
        case 'start':
          createIframe(msg.extId);
      }
    }

    return true;
  });
});

async function createIframe(extId: string) {
  return new Promise((resolve) => {
    iframe = document.createElement('iframe');
    iframe.id = 'styl-elementpicker';
    document.documentElement.append(iframe);

    iframe.onload = () => {
      let channel = new MessageChannel();
      port1 = channel.port1;
      port2 = channel.port2;

      port2.onmessage((ev: MessageEvent) => {
        switch (ev.data.action) {
          case 'start':
            addListener;
        }
      });

      port1.onmessageerror = () => {
        stopElementPicker();
      };
      port2.onmessageerror = () => {
        stopElementPicker();
      };
      // iframe.contentWindow?.postMessage(
      // 	{ type: 'elementpicker', action: 'start', secret: 'sdf' },
      // 	`chrome-extension://${extId}/src/inject/elementpicker.html`,
      // 	[iframePort]
      // );

      resolve(iframe);
    };
    iframe.src = `chrome-extension://${extId}/src/inject/elementpicker.html`;
  });
}

// async function addIframeCSS() {
// 	const css = [
// 		'background: transparent',
// 		'border: 0',
// 		'border-radius: 0',
// 		'box-shadow: none',
// 		'color-scheme: light dark',
// 		'display: block',
// 		'filter: none',
// 		'height: 100vh',
// 		'    height: 100svh',
// 		'left: 0',
// 		'margin: 0',
// 		'max-height: none',
// 		'max-width: none',
// 		'min-height: unset',
// 		'min-width: unset',
// 		'opacity: 1',
// 		'outline: 0',
// 		'padding: 0',
// 		'pointer-events: auto',
// 		'position: fixed',
// 		'top: 0',
// 		'transform: none',
// 		'visibility: hidden',
// 		'width: 100%',
// 		'z-index: 2147483647',
// 		''
// 	].join(' !important;\n');

// 	var sheet = document.styleSheets[0].add;
// 	sheet?.insertRule('strong { color: red; }', sheet.cssRules.length);
// }

function stopElementPicker() {
  if (port1) {
    port1.onmessage = null;
    port1.onmessageerror = null;
    port1.close();
  }
  if (port2) {
    port2.onmessage = null;
    port2.onmessageerror = null;
    port2.close();
  }
  if (iframe) {
    iframe.onload = null;
    iframe.remove();
  }
}

async function sendPoints(e: MouseEvent) {
  const elements = document.elementsFromPoint(e.pageX, e.pageY);
  const points = await getPoints(elements);
  if (
    points?.x1 === lastPoints?.x1 &&
    points?.x2 === lastPoints?.x2 &&
    points?.y1 === lastPoints?.y1 &&
    points?.y2 === lastPoints?.y2
  )
    return;
  lastPoints = points;
  port2.postMessage({
    points: points,
  });
}

function getPoints(elements: any[]) {
  for (const e of elements) {
    let rect: DOMRect = e.getBoundingClientRect();

    if (rect.width > 0 && rect.height > 0) {
      return {
        x1: rect.x,
        y1: rect.y,
        x2: rect.x + rect.width,
        y2: rect.y + rect.height,
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
