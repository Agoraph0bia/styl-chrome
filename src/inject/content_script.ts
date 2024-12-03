import { v4 } from 'uuid';
import { Points } from './elementpicker.js';

let iframe: HTMLIFrameElement;
let iframePort: MessagePort;
let messageSecret = v4();
let lastPoints: Points;

// chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
//   if (msg.ext !== 'Styl') return;

//   if (msg.type === 'elementpicker') {
//     switch (msg.action) {
//       case 'start': window === top ? createIframe
//         ().then(() => {
//           if (window == top) {
//             document.addEventListener('mousemove', sendPoints, {
//               capture: true,
//             });
//             document.addEventListener('keypress', (key) =>
//               key.key === 'escape' ? stopElementPicker : null
//             );
//           }
//         });
//     }
//   }

//   return true;
// });

async function createIframe() {
  iframe = document.createElement('iframe');
  document.documentElement.append(iframe);
  iframe.onload = () => {
    const { port1, port2 } = new MessageChannel();
    port2.onmessage = (ev) => {
      if (ev.data !== 'start') return;

      document.addEventListener('mousemove', sendPoints, { capture: true });
      document.addEventListener('keypress', (key) =>
        key.key === 'escape' ? stopElementPicker : null
      );
    };
    iframePort.onmessageerror = () => {
      stopElementPicker();
    };
    iframe.contentWindow?.postMessage(
      { action: 'start', secret: messageSecret },
      `src/inject/elementpicker.html`,
      [port1]
    );
  };
  if (iframe.contentWindow)
    iframe.contentWindow.location = `src/inject/elementpicker.html`;
}

function stopElementPicker() {
  if (iframePort) {
    iframePort.onmessage = null;
    iframePort.onmessageerror = null;
    iframePort.close();
  }
  if (iframe) {
    iframe.onload = null;
    iframe.remove();
  }

  document.removeEventListener('mousemove', sendPoints, { capture: true });
}

async function sendPoints(e: MouseEvent) {
  const elements = document.elementsFromPoint(e.pageX, e.pageY);
  const points = await getPoints(elements);
  if (points !== lastPoints) {
    console.log(points);
    iframePort?.postMessage({
      points: points,
    });
  }
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
