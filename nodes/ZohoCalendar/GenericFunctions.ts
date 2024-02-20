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

export interface moveEventRequest {
	'destinationcaluid': string,
};



export interface updateEventRequest {
	'dateandtime': {
		'timezone'?: string,
		'start'?: string,
		'end'?: string,
	},
	"attendees"?: attendeeObject,
	'title'?:string,
	'isallday'?:boolean,
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

/**
 * Checks to ensure there is a time set is all day event is disabled
 *
 * When the all day event is set to false and no time is given, zoho returns an error since there is only date info and no time info.
 *
 * Pass in `this.getNode()` for the `node` parameter
 */
export function checkTimesOnDisableAllDay (node: INode, existingAllDayEvent: boolean, newAllDayEvent: boolean, startTime: string, endTime: string, itemIndex: number ) {
	if (existingAllDayEvent && !newAllDayEvent && !startTime && !endTime) {
		const description = `Zoho needs a time to set the start and end date. Since it is coming from an all day event, there is no time information.`;
		throw new NodeOperationError(node, 'Must specify start and end time if changing from all day event to non-all day event.', {
			description,
			itemIndex,
		});
	}

	return
}

/**
 * Checks to ensure there is not more than 31 days in the range
 *
 * Pass in `this.getNode()` for the `node` parameter
 */
export function checkLessThan31Days (node: INode, startTime: moment.Moment, endTime: moment.Moment, itemIndex: number ) {
	if (endTime.diff(startTime, "days", true) > 31 ) {
		const description = `Change the dates to make the range less than 31 days.`;
		throw new NodeOperationError(node, 'The time range must be under 31 days.', {
			description,
			itemIndex,
		});
	}

	return
}

/**
 * Checks to ensure a required field is defined
 *
 * Pass in `this.getNode()` for the `node` parameter
 *
 * `field` is the field to check
 *
 * `fieldTitle` is the label to use in the error
 */
export function checkRequiredField (node: INode, field: any, fieldTitle: string, itemIndex: number ) {
	if (field === '' || field === undefined) {
		const description = `The field "${fieldTitle}" is required.`;
		throw new NodeOperationError(node, 'Missing Required Field.', {
			description,
			itemIndex,
		});
	}

	return
}
