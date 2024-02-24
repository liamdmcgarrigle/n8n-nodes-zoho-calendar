import * as moment from 'moment-timezone';
import {
	IBinaryKeyData,
	IDataObject,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';
import {
	attendeeObject,
	checkLessThan31Days,
	checkRequiredField,
	checkStartBeforeEnd,
	checkTimeZone,
	checkTimesExist,
	checkTimesOnDisableAllDay,
	createEventRequest,
	updateEventRequest,
} from './GenericFunctions';
import { eventOperations, eventFields } from './EventDescription';

export class ZohoCalendar implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Zoho Calendar',
		name: 'zohoCalendar',
		icon: 'file:zohoCalendarLogo.svg',
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
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
					// {
					// 	name: 'Calendar',
					// 	value: 'calendar',
					// },
				],
				default: 'event',
			},
			...eventOperations,
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
					if( this.getNodeParameter('operation', 0) === 'createNewEvent' ) {
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

						// item.json['success'] = true;
						item.json['zohoResponse'] = response;


					}

				//
				// ---------- MOVE EVENT ----------
				//
				if( this.getNodeParameter('operation', 0) === 'moveEvent' ) {
					const calendarId = this.getNodeParameter('calendarId', itemIndex, '') as string;
					const eventId = this.getNodeParameter('eventId', itemIndex, '') as string;
					const newCalendarId = this.getNodeParameter('newCalendarId', itemIndex,) as string;

					// http call options
					const options: IHttpRequestOptions = {
						url: `https://calendar.zoho.com/api/v1/calendars/${calendarId}/events/${eventId}?destinationcaluid=${newCalendarId}`,
						method: 'POST',
					};

					// actuall http call
					const response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'zohoCalendarOAuth2Api',
						options,
					);

					// item.json['success'] = true;
					item.json['zohoResponse'] = response;

				}

				//
				// ---------- DELETE EVENT ----------
				//
				if( this.getNodeParameter('operation', 0) === 'deleteEvent' ) {
					const calendarId = this.getNodeParameter('calendarId', itemIndex, '') as string;
					const eventId = this.getNodeParameter('eventId', itemIndex, '') as string;

					const existingCallOptions: IHttpRequestOptions = {
							url: `https://calendar.zoho.com/api/v1/calendars/${calendarId}/events/${eventId}`,
							method: 'GET',
						};
					const existingEvent = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'zohoCalendarOAuth2Api',
							existingCallOptions,
						);

					const etag = existingEvent.events[0].etag;

					// http call options
					const options: IHttpRequestOptions = {
						url: `https://calendar.zoho.com/api/v1/calendars/${calendarId}/events/${eventId}`,
						method: 'DELETE',
						headers: {'etag': etag}
					};

					// actuall http call
					const response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'zohoCalendarOAuth2Api',
						options,
					);

					// Return Data
					// item.json['success'] = true;
					item.json['zohoResponse'] = response;

				}

				//
				// ---------- UPDATE EVENT ----------
				//
				if( this.getNodeParameter('operation', 0) === 'updateEvent' ) {
					const calendarId = this.getNodeParameter('calendarId', itemIndex, '') as string;
					const additionalFields = this.getNodeParameter('additionalFields', itemIndex) as IDataObject; // gets values under additionalFields
					const eventId = this.getNodeParameter('eventId', itemIndex, '') as string;

					// Get existing info
					const existingCallOptions: IHttpRequestOptions = {
						url: `https://calendar.zoho.com/api/v1/calendars/${calendarId}/events/${eventId}`,
						method: 'GET',
					};
					const existingEvent = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'zohoCalendarOAuth2Api',
						existingCallOptions,
					);

					const existingTimeZone = existingEvent.events[0].dateandtime.timezone;



					const isPrivate = additionalFields.isPrivate as boolean;
					const color = additionalFields.color as string;
					let isAllDayEvent = additionalFields.isAllDayEvent as boolean;
					const location = additionalFields.location as string;
					const freeBusy = additionalFields.freeBusy as number;
					const attendees = additionalFields.attendees as IDataObject;
					const attendeesValues = attendees?.attendeesValues as attendeeObject | undefined;
					const url = additionalFields.url as string;
					const timeZone = this.getNodeParameter('timeZone',itemIndex, '') as string;
					const eventTitle = this.getNodeParameter('updateEventTitle',itemIndex, '') as string;
					const startTimeRaw = this.getNodeParameter('startTime', itemIndex, '') as string;
					const endTimeRaw = this.getNodeParameter('endTime', itemIndex, '') as string;
					const startTime = startTimeRaw ? moment.tz(startTimeRaw, timeZone ? timeZone : existingTimeZone) : "";
					const endTime = endTimeRaw ? moment.tz(endTimeRaw, timeZone ? timeZone : existingTimeZone) : "";
					const description = this.getNodeParameter('eventDescription',itemIndex, '') as string;

					const existingIsAllDay: boolean = existingEvent.events[0].isallday;

					let existingStartTime;
					let existingEndTime;
					if(existingIsAllDay){

						existingStartTime = moment.tz(existingEvent.events[0].dateandtime.start, timeZone ? timeZone : existingTimeZone );
						existingEndTime = moment.tz(existingEvent.events[0].dateandtime.end, timeZone ? timeZone : existingTimeZone );
					} else {
						existingStartTime = moment.tz(existingEvent.events[0].dateandtime.start.slice(0, -5), timeZone ? timeZone : existingTimeZone );
						existingEndTime = moment.tz(existingEvent.events[0].dateandtime.end.slice(0, -5), timeZone ? timeZone : existingTimeZone );
					}






					// Checks to make sure no start times happen before end times, even for the old values
					if(startTime && endTime) {
						checkStartBeforeEnd(this.getNode(), startTime, endTime, itemIndex);
					}
					if(startTime && !endTime) {
						checkStartBeforeEnd(this.getNode(), startTime, existingEndTime, itemIndex);
					}
					if(!startTime && endTime) {
						checkStartBeforeEnd(this.getNode(), existingStartTime, endTime, itemIndex);
					}

					checkTimesOnDisableAllDay(this.getNode(), existingIsAllDay, isAllDayEvent, startTimeRaw, endTimeRaw, itemIndex )

					isAllDayEvent = isAllDayEvent !== undefined ? isAllDayEvent : existingIsAllDay;




					let qsData: updateEventRequest = {
						dateandtime: {}
					};

					if(startTime || endTime || timeZone) {
						qsData.dateandtime.timezone = timeZone ? timeZone : existingTimeZone;

					}
					if(startTime) {
						qsData.dateandtime.start = isAllDayEvent ?
							startTime.utc().format("YYYYMMDD") :
							startTime.utc().format("YYYYMMDDTHHmmss") + 'Z';
					} else {
						qsData.dateandtime.start = isAllDayEvent ?
							existingStartTime.utc().format("YYYYMMDD") :
							existingStartTime.utc().format("YYYYMMDDTHHmmss") + 'Z';
					}

					if(endTime) {
						qsData.dateandtime.end = isAllDayEvent ?
							endTime.utc().format("YYYYMMDD") :
							endTime.utc().format("YYYYMMDDTHHmmss") + 'Z';
					} else {
						qsData.dateandtime.end = isAllDayEvent ?
							existingEndTime.utc().format("YYYYMMDD") :
							existingEndTime.utc().format("YYYYMMDDTHHmmss") + 'Z';
					}

					if(eventTitle) {
						qsData['title'] = eventTitle;
					}

					if(isAllDayEvent) {
						qsData['isallday'] = isAllDayEvent;
					}

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
						url: `https://calendar.zoho.com/api/v1/calendars/${calendarId}/events/${eventId}`,
						method: 'POST',
						qs: body,
					};

						const response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'zohoCalendarOAuth2Api',
						options,
					);

					// item.json['success'] = true;
					item.json['zohoResponse'] = response;


				}

				//
				// ---------- GET EVENTS LIST ----------
				//
				if( this.getNodeParameter('operation', 0) === 'getEventsList' ) {
					const calendarId = this.getNodeParameter('calendarId', itemIndex, '') as string;
					let timeZone = this.getNodeParameter('timeZone', itemIndex, '') as string;
					const rawStartTime = this.getNodeParameter('startOfSearchRangeTime', itemIndex, '') as string;
					const rawEndTime = this.getNodeParameter('endOfSearchRangeTime', itemIndex, '') as string;

					checkRequiredField(this.getNode(), rawStartTime, "Start Of Search Range", itemIndex);
					checkRequiredField(this.getNode(), rawEndTime, "End Of Search Range", itemIndex);

					const startTime = moment.tz(rawStartTime, timeZone ? timeZone : 'Etc/GMT' );
					const endTime = moment.tz(rawEndTime, timeZone ? timeZone : 'Etc/GMT' );

					checkRequiredField(this.getNode(), startTime, "Start Of Search Range", itemIndex);
					checkRequiredField(this.getNode(), endTime, "End Of Search Range", itemIndex);
					checkLessThan31Days(this.getNode(), startTime, endTime, itemIndex);

					timeZone ? timeZone : timeZone = 'Etc/GMT';

					const qsData = {
						"start": startTime.utc().format("YYYYMMDDTHHmmss") + 'Z',
						"end": endTime.utc().format("YYYYMMDDTHHmmss") + 'Z'
					}


					const body = {'range': JSON.stringify(qsData), 'timezone':timeZone};


					const options: IHttpRequestOptions = {
						url: `https://calendar.zoho.com/api/v1/calendars/${calendarId}/events`,
						method: 'GET',
						qs: body,
					};

						const response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'zohoCalendarOAuth2Api',
						options,
					);

					// item.json['success'] = true;
					item.json['zohoResponse'] = response;


				}

				//
				// ---------- GET EVENT DETAILS ----------
				//
				if( this.getNodeParameter('operation', 0) === 'getEventsDetails' ) {
					const eventId = this.getNodeParameter('eventId', itemIndex, '') as string;
					const calendarId = this.getNodeParameter('calendarId', itemIndex, '') as string;

					const options: IHttpRequestOptions = {
						url: `https://calendar.zoho.com/api/v1/calendars/${calendarId}/events/${eventId}`,
						method: 'GET',
					};

						const response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'zohoCalendarOAuth2Api',
						options,
					);

					// item.json['success'] = true;
					item.json['zohoResponse'] = response;


				}

				//
				// ---------- DOWNLOAD ATTACHMENT ----------
				//
				if( this.getNodeParameter('operation', 0) === 'downloadAttachment' ) {
					const calendarId = this.getNodeParameter('calendarId', itemIndex, '') as string;
					const eventId = this.getNodeParameter('eventId', itemIndex, '') as string;
					const fileid = this.getNodeParameter('attachmentId', itemIndex, '') as string;

					checkRequiredField(this.getNode(), fileid, "File ID", itemIndex);
					checkRequiredField(this.getNode(), eventId, "Event UID", itemIndex);
					checkRequiredField(this.getNode(), calendarId, "Calendar UID", itemIndex);


					const options: IHttpRequestOptions = {
						url: `https://calendar.zoho.com/api/v1/calendars/${calendarId}/events/${eventId}/attachment/${fileid}?apimode=download`,
						method: 'GET',
						encoding: 'arraybuffer',
					};

						const response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'zohoCalendarOAuth2Api',
						options,
					);

					const binaryData =  Buffer.from(response);

					const binary: IBinaryKeyData = {};
        			binary!['data'] = await this.helpers.prepareBinaryData(
						binaryData,
        			);

					item.binary = binary;


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
