let port1: MessagePort, svg: SVGRectElement;
// , port2: MessagePort, lastPos: { x: number; y: number };

export type Points = {
	x1: number;
	y1: number;
	x2: number;
	y2: number;
};

window.addEventListener(
	'message',
	(e) => {
		if (e.ports?.length !== 1 || e.data?.type !== 'start') return;

		port1 = e.ports[0];

		port1.onmessage = (ev: any) => {
			switch (ev.data.type) {
				case 'drawrect':
					drawRect(ev.data.points);
			}
		};

		port1.postMessage({ type: 'created' });
	},
	{ once: true }
);

// async function sendMousePos(e: MouseEvent) {
//   console.log('Test');
//   if (lastPos?.x !== e.pageX && lastPos?.y !== e.pageY) {
//     lastPos = { x: e.pageX, y: e.pageY };
//     port1.postMessage({
//       type: 'mousemove',
//       x: e.pageX,
//       y: e.pageY,
//     });
//   }
// }

// async function sendStart() {
// 	port1.postMessage({
// 		type: 'start',
// 	});
// }

// async function sendStop() {
//   if (port1) {
//     port1.postMessage({
//       type: 'stop',
//     });
//     port1.onmessage = null;
//     port1.onmessageerror = null;
//   }
//   if (port2) {
//     port2.onmessage = null;
//     port2.onmessageerror = null;
//   }
// }

function drawRect(points: any) {}

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
