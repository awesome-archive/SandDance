export interface ITelemetryData {
	from?: string;
	target?: string;
	[key: string]: any;
}

export interface ITelemetryLog {
  (eventName: string, data?: ITelemetryData): any;
}