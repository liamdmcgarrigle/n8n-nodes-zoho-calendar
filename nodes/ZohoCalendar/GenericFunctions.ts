import { INode, NodeOperationError } from "n8n-workflow";


export interface attendeeObject {
	"email":string,
	"permission"?: number,
	"attendence"?:number,
	"zid"?:string
 }
export interface createEventRequest {
	'dateandtime': {
		'timezone': string,
		'start': string,
		'end': string,
	},
	"attendees"?: attendeeObject,
	'title':string,
	'isallday':boolean,
	'isprivate'?:boolean,
	'location'?:string,
	'description'?:string
	'color'?: string,
	'transparency'?: number,
	'url'?: string,

};



/**
 * Checks to ensure timezone exists and is formatted to match `America/New_York` (just checks is there is a `/` in the string.)
 *
 * Pass in `this.getNode()` for the `node` parameter
 */
export function checkTimeZone (node: INode,  timeZone: string, itemIndex: number ) {
	if (timeZone.indexOf('/') === -1) {
		const description = `The timezone '${timeZone || ' '}' in the 'Time Zone' field isn't valid. Hint: Format your timezone like 'America/New_York', format a DateTime using '.format('z')', or use the expression '{{ $now.format('z') }}' to get the current workflows default time zone in the correct format.`;
		throw new NodeOperationError(node, 'Invalid time zone', {
			description,
			itemIndex,
		});
	}

	return
}

/**
 * Checks to ensure the start time happens before the end time
 *
 * Pass in `this.getNode()` for the `node` parameter
 */
export function checkStartBeforeEnd (node: INode,  startTime: moment.Moment, endTime: moment.Moment, itemIndex: number ) {
	if (startTime.isAfter(endTime)) {
		const description = `The start time '${startTime.format('MMM DD YYYY HH:MM:SS') || ' '}' happends after end end time '${endTime.format('MMM DD YYYY HH:MM:SS') || ' '}'.`;
		throw new NodeOperationError(node, 'Start time is after the end time', {
			description,
			itemIndex,
		});
	}

	return
}

/**
 * Checks to ensure the start and end time exist
 *
 * Pass in the field values before they are converted to DateTime so this is what throws the error
 *
 * Pass in `this.getNode()` for the `node` parameter
 */
export function checkTimesExist (node: INode,  startTime: string, endTime: string, itemIndex: number ) {
	if (startTime === '' || startTime === undefined || endTime === '' || endTime === undefined) {
		const description = `The start time and end time are required`;
		throw new NodeOperationError(node, 'Start time and/or end time is missing', {
			description,
			itemIndex,
		});
	}

	return
}



