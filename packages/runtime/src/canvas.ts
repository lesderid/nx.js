import type { Switch } from './switch';
import { INTERNAL_SYMBOL } from './switch';
import { LibImageData } from './types';

export class Canvas {
	[INTERNAL_SYMBOL]: Switch;
	width: number;
	height: number;

	constructor(s: Switch, width: number, height: number) {
		this[INTERNAL_SYMBOL] = s;
		this.width = width;
		this.height = height;
	}

	getContext(contextId: '2d'): CanvasRenderingContext2D {
		if (contextId !== '2d') {
			throw new TypeError(
				`"${contextId}" is not supported. Must be "2d".`
			);
		}
		return new CanvasRenderingContext2D(this);
	}
}

export class ImageData implements LibImageData {
	readonly colorSpace: PredefinedColorSpace;
	readonly data: Uint8ClampedArray;
	readonly height: number;
	readonly width: number;

	constructor(sw: number, sh: number, settings?: ImageDataSettings);
	constructor(
		data: Uint8ClampedArray,
		sw: number,
		sh?: number,
		settings?: ImageDataSettings
	);
	constructor(
		swOrData: number | Uint8ClampedArray,
		shOrSw: number,
		settingsOrSh?: ImageDataSettings | number,
		settings?: ImageDataSettings
	) {
		let imageDataSettings: ImageDataSettings | undefined;
		if (typeof swOrData === 'number') {
			this.width = swOrData;
			this.height = shOrSw;
			if (typeof settingsOrSh !== 'number') {
				imageDataSettings = settingsOrSh;
			}
			this.data = new Uint8ClampedArray(this.width * this.height * 4);
		} else {
			this.data = swOrData;
			this.width = shOrSw;
			if (typeof settingsOrSh === 'number') {
				this.height = settingsOrSh;
			} else {
				this.height = (this.data.length / this.width) | 0;
			}
			imageDataSettings = settings;
		}
		this.colorSpace = imageDataSettings?.colorSpace || 'srgb';
	}
}

export class CanvasRenderingContext2D implements CanvasImageData {
	readonly canvas: Canvas;
	[INTERNAL_SYMBOL]: Uint8ClampedArray;

	constructor(canvas: Canvas) {
		this.canvas = canvas;
		this[INTERNAL_SYMBOL] = new Uint8ClampedArray(
			canvas.width * canvas.height * 4
		);
	}
	createImageData(
		sw: number,
		sh: number,
		settings?: ImageDataSettings
	): ImageData;
	createImageData(imagedata: ImageData): ImageData;
	createImageData(
		sw: number | ImageData,
		sh?: number,
		settings?: ImageDataSettings
	): ImageData {
		let width: number;
		let height: number;
		if (typeof sw === 'number') {
			if (typeof sh !== 'number') {
				throw new TypeError(
					'CanvasRenderingContext2D.createImageData: Argument 1 is not an object.'
				);
			}
			width = sw;
			height = sh;
		} else {
			width = sw.width;
			height = sw.height;
		}
		if (width <= 0 || height <= 0) {
			throw new TypeError(
				'CanvasRenderingContext2D.createImageData: Invalid width or height'
			);
		}
		return new ImageData(width, height, settings);
	}

	getImageData(
		sx: number,
		sy: number,
		sw: number,
		sh: number,
		settings?: ImageDataSettings | undefined
	): ImageData {
		const { native } = this.canvas[INTERNAL_SYMBOL];
		const buffer = native.canvasGetImageData(
			this[INTERNAL_SYMBOL].buffer,
			sx,
			sy,
			sw,
			sh,
			this.canvas.width
		);
		const data = new Uint8ClampedArray(buffer);
		return new ImageData(data, sw, sh, settings);
	}

	putImageData(
		imagedata: ImageData,
		dx: number,
		dy: number,
		dirtyX = 0,
		dirtyY = 0,
		dirtyWidth = imagedata.width,
		dirtyHeight = imagedata.height
	): void {
		const { native } = this.canvas[INTERNAL_SYMBOL];
		native.canvasPutImageData(
			imagedata.data.buffer,
			this[INTERNAL_SYMBOL].buffer,
			dx,
			dy,
			dirtyX,
			dirtyY,
			dirtyWidth,
			dirtyHeight,
			this.canvas.width
		);
	}
}
