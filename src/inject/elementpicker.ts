let port1: MessagePort, port2: MessagePort, lastPos: { x: number; y: number };

export type Points = {
	x1: number;
	y1: number;
	x2: number;
	y2: number;
};

document.addEventListener('DOMContentLoaded', (event) => {
	let channel = new MessageChannel();
	port1 = channel.port1;
	port2 = channel.port2;

	addListeners().then(sendStart);
});

async function addListeners() {
	port2.onmessage = (ev: MessageEvent) => drawRect(ev.data);
	window.addEventListener('mousemove', sendMousePos, {
		capture: true,
	});
	window.addEventListener('keyup', (key) =>
		key.key == 'Escape' ? sendStop() : null
	);
}

async function sendMousePos(e: MouseEvent) {
	if (lastPos.x !== e.pageX || lastPos.y !== e.pageY)
		port1.postMessage({
			type: 'mouseMove',
			x: e.pageX,
			y: e.pageY,
		});
}

async function sendStart() {
	port1.postMessage({
		type: 'start',
	});
}

async function sendStop() {}

async function drawRect(points: Points) {
	console.log(points);
}

// function updatePage(url: URL) {
//   if (!iframe?.contentWindow) return;

//   iframe.contentWindow.location = url.href;
//   iframe.contentWindow.addEventListener(
//     'message',
//     (event) => {
//       console.log(event.data);
//     },
//     false
//   );
// }

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
