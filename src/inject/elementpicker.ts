import { randomUUID } from 'crypto';

const css = [
	'background: transparent',
	'border: 0',
	'border-radius: 0',
	'box-shadow: none',
	'color-scheme: light dark',
	'display: block',
	'filter: none',
	'height: 100vh',
	'height: 100svh',
	'left: 0',
	'margin: 0',
	'max-height: none',
	'max-width: none',
	'min-height: unset',
	'min-width: unset',
	'opacity: 1',
	'outline: 0',
	'padding: 0',
	'pointer-events: auto',
	'position: fixed',
	'top: 0',
	'transform: none',
	'visibility: hidden',
	'width: 100%',
	'z-index: 2147483647',
	'',
].join(' !important;\n');

let elementPicker: any;
const uuid = randomUUID();

export const injectPickerScript = async (urlString: string) => {
	const url = new URL(urlString);

	return new Promise((resolve) => {
		const iframe = document.createElement('iframe');
		iframe.setAttribute(uuid, '');

		iframe.addEventListener(
			'load',
			() => {
				iframe.setAttribute(`${uuid}-loaded`, '');
				// const channel = new MessageChannel();
				// pickerFramePort = channel.port1;
				// pickerFramePort.onmessage = (ev) => {
				// 	onDialogMessage(ev.data || {});
				// };
				// pickerFramePort.onmessageerror = () => {
				// 	quitPicker();
				// };
				// iframe.contentWindow.postMessage({ what: 'epickerStart' }, url.href, [
				// 	channel.port2,
				// ]);
				resolve(iframe);
			},
			{ once: true }
		);
		document.documentElement.append(iframe);
		if (iframe.contentWindow) iframe.contentWindow.location = url.href;
	});
};

const getElementRect = function (elem: any) {
	let rect =
		typeof elem.getBoundingClientRect === 'function'
			? elem.getBoundingClientRect()
			: { height: 0, left: 0, top: 0, width: 0 };

	if (rect.width !== 0 && rect.height !== 0) {
		return rect;
	}
	if (elem.shadowRoot instanceof DocumentFragment) {
		return getElementRect(elem.shadowRoot);
	}

	let left = rect.left,
		right = left + rect.width,
		top = rect.top,
		bottom = top + rect.height;

	for (const child of elem.children) {
		rect = getElementRect(child);
		if (rect.width === 0 || rect.height === 0) {
			continue;
		}
		if (rect.left < left) {
			left = rect.left;
		}
		if (rect.right > right) {
			right = rect.right;
		}
		if (rect.top < top) {
			top = rect.top;
		}
		if (rect.bottom > bottom) {
			bottom = rect.bottom;
		}
	}

	return {
		bottom,
		height: bottom - top,
		left,
		right,
		top,
		width: right - left,
	};
};

const highlightElements = function (elems, force) {
	// To make mouse move handler more efficient
	if (
		force !== true &&
		elems.length === targetElements.length &&
		(elems.length === 0 || elems[0] === targetElements[0])
	) {
		return;
	}
	targetElements = [];

	const ow = self.innerWidth;
	const oh = self.innerHeight;
	const islands = [];

	for (const elem of elems) {
		if (elem === picker) {
			continue;
		}
		const rect = getElementRect(elem);
		// Ignore offscreen areas
		if (
			rect.left > ow ||
			rect.top > oh ||
			rect.left + rect.width < 0 ||
			rect.top + rect.height < 0
		) {
			continue;
		}
		islands.push(
			`M${rect.left} ${rect.top}h${rect.width}v${rect.height}h-${rect.width}z`
		);
	}

	pickerFramePort.postMessage({
		what: 'svgPaths',
		ocean: `M0 0h${ow}v${oh}h-${ow}z`,
		islands: islands.join(''),
	});
};

elementPicker = await injectPickerScript(document.URL);
