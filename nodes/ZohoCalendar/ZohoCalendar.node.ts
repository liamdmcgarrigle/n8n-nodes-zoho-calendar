import * as moment from 'moment-timezone';
import {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';
import {  attendeeObject, checkStartBeforeEnd, checkTimeZone, checkTimesExist, createEventRequest } from './GenericFunctions';
import { eventFields } from './EventDescription';

export class ZohoCalendar implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Zoho Calendar',
		name: 'zohoCalendar',
		icon: 'file:zohoCalendarLogo.svg',
		group: ['input'],
		version: 1,
		subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
		description: 'Basic Node',
		defaults: {
			name: 'Zoho Calendar',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'zohoCalendarOAuth2Api',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Event',
						value: 'event',
					},
					{
						name: 'Calendar',
						value: 'calendar',
					},
				],
				default: 'event',
			},
			...eventFields
			]
		};


	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		let item: INodeExecutionData;


		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				item = items[itemIndex];

				if( this.getNodeParameter('resource', 0) === 'event' ) {

					//
					// ---------- CREATE NEW EVENT ----------
					//
					if( this.getNodeParameter('method', 0) === 'createNewEvent' ) {
						checkTimesExist(this.getNode(), this.getNodeParameter(
							'startTime', itemIndex, '') as string,
							this.getNodeParameter('endTime',
							itemIndex, '') as string,
							itemIndex,
							)

						const calendarId = this.getNodeParameter('calendarId', itemIndex, '') as string;
						const additionalFields = this.getNodeParameter('additionalFields', itemIndex) as IDataObject; // gets values under additionalFields
						const isPrivate = additionalFields.isPrivate as boolean;
						const color = additionalFields.color as string;
						const isAllDayEvent = additionalFields.isAllDayEvent as boolean;
						const location = additionalFields.location as string;
						const freeBusy = additionalFields.freeBusy as number;
						const attendees = additionalFields.attendees as IDataObject;
						const attendeesValues = attendees?.attendeesValues as attendeeObject | undefined;
						const url = additionalFields.url as string;
						const timeZone = this.getNodeParameter('timeZone',itemIndex, '') as string;
						const eventTitle = this.getNodeParameter('eventTitle',itemIndex, '') as string;
						const startTime = moment.tz(this.getNodeParameter('startTime', itemIndex, '') as string, timeZone );
						const endTime = moment.tz(this.getNodeParameter('endTime', itemIndex, '') as string, timeZone );
						const description = this.getNodeParameter('eventDescription',itemIndex, '') as string;



						checkTimeZone(this.getNode(), timeZone, itemIndex);
						checkStartBeforeEnd(this.getNode(), startTime, endTime, itemIndex);


						let qsData: createEventRequest = {
								'dateandtime': {
									'timezone': timeZone,
									'start': isAllDayEvent ?
										startTime.utc().format("YYYYMMDD") :
									 	startTime.utc().format("YYYYMMDDTHHmmss") + 'Z',
									'end': isAllDayEvent ?
										endTime.utc().format("YYYYMMDD") :
										endTime.utc().format("YYYYMMDDTHHmmss") + 'Z',
								},
								'title':eventTitle,
								'isallday':isAllDayEvent,
							};

						if(description) {
							qsData['description'] = description;
						}

						if(isPrivate) {
							qsData['isprivate'] = true;
						}

						if(location) {
							qsData['location'] = location;
						}

						if(color) {
							qsData['color'] = color;
						}

						if(freeBusy) {
							qsData['transparency'] = freeBusy;
						}

						if(attendeesValues !== undefined) {
							qsData['attendees'] = attendeesValues;
						}

						if(url) {
							qsData['url'] = url;
						}

						const body = {'eventdata': JSON.stringify(qsData)};


						const options: IHttpRequestOptions = {
							url: 'https://calendar.zoho.com/api/v1/calendars/' + calendarId + '/events?',
							method: 'POST',
							qs: body,
						};

						 const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'zohoCalendarOAuth2Api',
							options,
						);

						item.json['success'] = true;
						item.json['zohoResponse'] = response;

					}

				//
				// ---------- MOVE EVENT ----------
				//
				if( this.getNodeParameter('method', 0) === 'moveEvent' ) {
					const calendarId = this.getNodeParameter('calendarId', itemIndex, '') as string;

					// define query body
					// let qsData: createEventRequest = {
					// 	'thing':'thing'
					// };

					// define optional params
					if('description') {
						// qsData['description'] = description;
					}

					// pack body into required QS format
					// const body = {'eventdata': JSON.stringify(qsData)};

					// http call options
					const options: IHttpRequestOptions = {
						url: 'https://calendar.zoho.com/api/v1/calendars/' + calendarId + '/events?',
						method: 'POST',
						// qs: body,
					};

					// actuall http call
					const response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'zohoCalendarOAuth2Api',
						options,
					);

					// Return Data
					item.json['success'] = true;
					item.json['zohoResponse'] = response;

				}

				//
				// ---------- DELETE EVENT ----------
				//
				if( this.getNodeParameter('method', 0) === 'deleteEvent' ) {
					const calendarId = this.getNodeParameter('calendarId', itemIndex, '') as string;

					// define query body
					// let qsData: createEventRequest = {
						// 'thing':'thing'
					// };

					// define optional params
					if('description') {
						// qsData['description'] = description;
					}

					// pack body into required QS format
					// const body = {'eventdata': JSON.stringify(qsData)};

					// // http call options
					// const options: IHttpRequestOptions = {
					// 	url: 'https://calendar.zoho.com/api/v1/calendars/' + calendarId + '/events?',
					// 	method: 'POST',
					// 	qs: body,
					// };

					// actuall http call
					// const response = await this.helpers.httpRequestWithAuthentication.call(
					// 	this,
					// 	'zohoCalendarOAuth2Api',
					// 	options,
					// );

					// Return Data
					item.json['success'] = true;
					// item.json['zohoResponse'] = response;


				}

				//
				// ---------- UPDATE EVENT ----------
				//
				if( this.getNodeParameter('method', 0) === 'updateEvent' ) {
					const calendarId = this.getNodeParameter('calendarId', itemIndex, '') as string;


				}

				//
				// ---------- GET EVENTS LIST ----------
				//
				if( this.getNodeParameter('method', 0) === 'getEventsList' ) {
					const calendarId = this.getNodeParameter('calendarId', itemIndex, '') as string;


					// this runs code for getEventsList
					// IMPORTANT: Throw error is range is over 31 days
				}

				//
				// ---------- GET EVENT DETAILS ----------
				//
				if( this.getNodeParameter('method', 0) === 'getEventsDetails' ) {
					const calendarId = this.getNodeParameter('calendarId', itemIndex, '') as string;


				}

				//
				// ---------- GET ATTACHMENT DETAILS ----------
				//
				if( this.getNodeParameter('method', 0) === 'getAttachmentDetails' ) {
					const calendarId = this.getNodeParameter('calendarId', itemIndex, '') as string;


				}

				//
				// ---------- DELETE ATTACHMENT ----------
				//
				if( this.getNodeParameter('method', 0) === 'deleteAttachment' ) {
					const calendarId = this.getNodeParameter('calendarId', itemIndex, '') as string;


				}

				//
				// ---------- GET ATTENDEES DETAILS ----------
				//
				if( this.getNodeParameter('method', 0) === 'getAttendeesDetails' ) {
					const calendarId = this.getNodeParameter('calendarId', itemIndex, '') as string;


				}


			}


			} catch (error) {

				// This node should never fail but we want to showcase how
				// to handle errors.
				if (this.continueOnFail()) {
					items.push({ json: this.getInputData(itemIndex)[0].json, error, pairedItem: itemIndex });
				} else {
					// Adding `itemIndex` allows other workflows to handle this error
					if (error.context) {
						// If the error thrown already contains the context property,
						// only append the itemIndex
						error.context.itemIndex = itemIndex;
						throw error;
					}
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex,
					});
				}
			}
		}

		return this.prepareOutputData(items);
	}
}
