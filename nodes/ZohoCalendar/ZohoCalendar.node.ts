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
import { checkStartBeforeEnd, checkTimeZone, checkTimesExist, createEventRequest } from './GenericFunctions';
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
		let calendarId: string;
		let timeZone: string;
		let eventTitle: string;



		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				item = items[itemIndex];

				if( this.getNodeParameter('resource', 0) === 'event' ) {


					if( this.getNodeParameter('method', 0) === 'createNewEvent' ) {
						checkTimesExist(this.getNode(), this.getNodeParameter(
							'startTime', itemIndex, '') as string,
							this.getNodeParameter('endTime',
							itemIndex, '') as string,
							itemIndex,
							)

						calendarId = this.getNodeParameter('calendarId', itemIndex, '') as string;
						// below comments are how to add fields from options
						const additionalFields = this.getNodeParameter('additionalFields', itemIndex) as IDataObject; // gets values under additionalFields
						const isPrivate = additionalFields.isPrivate as boolean;
						timeZone = this.getNodeParameter('timeZone',itemIndex, '') as string;
						eventTitle = this.getNodeParameter('eventTitle',itemIndex, '') as string;
						let isAllDayEvent = this.getNodeParameter('isAllDayEvent',itemIndex, false) as boolean;
						let startTime = moment.tz(this.getNodeParameter('startTime', itemIndex, '') as string, timeZone || 'Etc/GMT' );
						let endTime = moment.tz(this.getNodeParameter('endTime', itemIndex, '') as string, timeZone || 'Etc/GMT' );



						checkTimeZone(this.getNode(), timeZone, itemIndex);
						checkStartBeforeEnd(this.getNode(), startTime, endTime, itemIndex);


						let qsData: createEventRequest = {
								'dateandtime': {
									'timezone': timeZone,
									'start': startTime.utc().format("YYYYMMDDTHHmmss") + 'Z',
									'end': endTime.utc().format("YYYYMMDDTHHmmss") + 'Z',
								},
								'title':eventTitle,
								'isallday':isAllDayEvent,
							};

						if(isPrivate) {
							qsData['isprivate'] = true;
						}

						const body = {'eventdata': JSON.stringify(qsData)};

						// const query = new URLSearchParams({'eventdata': JSON.stringify(bodyData)}); // converts body to query params

						const options: IHttpRequestOptions = {
							url: 'https://calendar.zoho.com/api/v1/calendars/' + calendarId + '/events?',
							method: 'POST',
							// body: URLSearchParams,
							qs: body,
							// arrayFormat: 'comma',
							// encoding: 'json',
							// json: true,
							// returnFullResponse: true,
						};

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'zohoCalendarOAuth2Api',
							options,
				);

				item.json['success'] = true;
				item.json['eventId'] = response.events[0].id;


					}

				if( this.getNodeParameter('method', 0) === 'moveEvent' ) {
					item.json['otherThing'] = true; // this runs code for moveEvent
				}


				if( this.getNodeParameter('method', 0) === 'getEventsList' ) {
					// this runs code for getEventsList
					// IMPORTANT: Throw error is range is over 31 days
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
