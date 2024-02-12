// import { Moment } from 'moment-timezone';
import {
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

export class ZohoCalendar implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Zoho Calendar',
		name: 'zohoCalendar',
		icon: 'file:zohoCalendarLogo.svg',
		group: ['input'],
		version: 1,
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
						name: 'Calendar',
						value: 'calendar',
					},
					{
						name: 'Event',
						value: 'event',
					},
				],
				default: 'event',
			},
			{
				displayName: 'Method',
				name: 'method',
				type: 'options',
				noDataExpression: true,
				// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
				options: [
					{
						name: 'Create New Event',
						value: 'createNewEvent',
					},
					{
						name: 'Move Event',
						value: 'moveEvent',
					},
					{
						name: 'Delete Event',
						value: 'deleteEvent',
					},
					{
						name: 'Update Event',
						value: 'updateEvent',
					},
					{
						name: 'Get Events List',
						value: 'getEventsList',
					},
					{
						name: 'Get Events Details',
						value: 'getEventsDetails',
					},
					{
						name: 'Get Attachment Details',
						value: 'getAttachmentDetails',
					},
					{
						name: 'Delete Attachment',
						value: 'deleteAttachment',
					},
					{
						name: 'Get Attendees Details',
						value: 'getAttendeesDetails',
					},
				],
				default: 'createNewEvent',

			},
			{
				displayName: 'Calendar ID',
				name: 'calendarId',
				required: true,
				type: 'string',
				default: '',
				placeholder: '8793u09048534kjhdb34t5334',
				description: 'The ID of the calendar you want to add to. If static, get this from settings -> My Calendars then copy the ID from the share URLs on the bottom of the screen. If dynamic, add a search step before this node.',
				displayOptions: {
					show: {
						method: ['createNewEvent',]
					},
				},
			},
			{
				displayName: 'Event Title',
				name: 'eventTitle',
				required: true,
				type: 'string',
				default: '',
				placeholder: 'My Really Cool Event',
				description: 'Title of the event to be added',
				displayOptions: {
					show: {
						method: ['createNewEvent',]
					},
				},
			},
			{
				displayName: 'Start Time',
				name: 'startTime',
				type: 'dateTime',
				required: true,
				default: '',
				displayOptions: {
					show: {
						method: ['createNewEvent',]
					},
				},
			},
			{
				displayName: 'End Time',
				name: 'endTime',
				type: 'dateTime',
				required: true,
				default: '',
				displayOptions: {
					show: {
						method: ['createNewEvent',]
					},
				},
			},
			{
				displayName: 'Event Description',
				name: 'eventDescription',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				placeholder: 'Liam\'s birthday party. Don\'t forget a gift.',
				displayOptions: {
					show: {
						method: ['createNewEvent',]
					},
				},
			},

			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				default: {},
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						method: ['createNewEvent',]
					},
				},
				options: [
					{
						displayName: 'Time Zone',
						name: 'timeZone',
						type: 'string',
						default: '={{ $now.format(\'z\') }}',
						description: 'Whether it is an all day event',
				  },
					{
						displayName: 'All Day Event?',
						name: 'isAllDayEvent',
						type: 'boolean',
						default: false,
						description: 'Whether it is an all day event',
				  },
					{
						displayName: 'URL To Attached',
						name: 'url',
						type: 'string',
						default: '',
						placeholder: 'https://meet.zoho.com/example',
						description: 'A URL that will be attached to the calendar event',
					},
					{
						displayName: 'Location',
						name: 'location',
						type: 'string',
						default: '',
						placeholder: '2600 Benjamin Franklin Pkwy, Philadelphia, PA 19130',
						description: 'Location of the event. Addresses and coordinates work.',
					},
					{
						displayName: 'Attendees',
						name: 'attendees',
						placeholder: 'Add attendees',
						type: 'fixedCollection',
						default: {},
						typeOptions: {
							multipleValues: true,
						},
						description: 'Who is invited',
						options: [
							{
								name: 'attendeesValues',
								displayName: 'Attendee',
								values: [
									{
										displayName: 'Email',
										name: 'email',
										type: 'string',
										default: '',
										placeholder: 'name@email.com',
										required: true,

									},
									{
										displayName: 'Permission Level',
										name: 'value',
										type: 'number',
										typeOptions: {
											maxValue: 3,
											minValue: 0,
											numberStepSize: '',
										},
										default: 1,
										description: 'The attendee\'s permission level. 0 = Guest | 1 = View | 2 = Invite | 3 = Edit.',
									},
									{
										displayName: 'Attendence',
										name: 'attendence',
										type: 'number',
										typeOptions: {
											maxValue: 2,
											minValue: 0,
											numberStepSize: 1,
										},
										default: '',
										description: 'The attendee\'s attendence. 0 = Non participant | 1 = Required participant | 2 = Optional participant.',
									},
									{
										displayName: 'Zoho User ID',
										name: 'zid',
										type: 'string',
										default: '',
										placeholder: '6sdg654615dfgh8dfg61h5',
										description: 'The ID of a Zoho User',
									},
								],
							},
				],
			},
				],
			}
		]
	};

	// The function below is responsible for actually doing whatever this node
	// is supposed to do. In this case, we're just appending the `myString` property
	// with whatever the user has entered.
	// You can make async calls and use `await`.
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		let item: INodeExecutionData;
		let calendarId: string;
		let timeZone: string;
		let eventTitle: string;
		let startTime: string;
		let endTime: string;


		// Iterates over all input items and add the key "myString" with the
		// value the parameter "myString" resolves to.
		// (This could be a different value for each item in case it contains an expression)
		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				calendarId = this.getNodeParameter('calendarId', itemIndex, '') as string;
				timeZone = this.getNodeParameter('timeZone', itemIndex, 'America/New_York') as string;
				eventTitle = this.getNodeParameter('eventTitle', itemIndex, '') as string;
				startTime = this.getNodeParameter('startTime', itemIndex, '') as string;
				endTime = this.getNodeParameter('endTime', itemIndex, '') as string;

				// let startTimeNumber =  Date.parse(startTime);
				// let startTimeConverted = new Date(startTimeNumber)
				// let startTimeGMT = startTimeConverted.toUTCString()

				// Then, require it in your script
				const moment = require('moment-timezone');

				// Parse the startTime considering it's in the specified timeZone
				let timeInTimeZone = moment.tz(startTime, timeZone); //this is utc now

				// let timeInUTC = timeInTimeZone.clone().utc();


				item = items[itemIndex];


				const body =
				{
					'eventdata': `{'dateandtime': {'timezone': '${timeZone}','start': '20240214T180000Z','end': '20240214T183000Z'},'title':'${eventTitle}',}`
				};


			const query = new URLSearchParams(body);


			// just to remind myself.....
			// this just finially started working
			// But there has to be a better way


				const options: IHttpRequestOptions = {
					url: 'https://calendar.zoho.com/api/v1/calendars/' + calendarId + '/events?' + query,
					method: 'POST',
					// body: URLSearchParams,
					// qs: body,
					// arrayFormat: 'comma',
					// encoding: 'json',
					// json: true,
					// returnFullResponse: true,
				};

				// const response = await this.helpers.httpRequest(options);

				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'zohoCalendarOAuth2Api',
					options,
				);



				item.json['success'] = true;
				item.json['eventId'] = response.events[0].id;
				item.json['startTime'] = startTime;

				item.json['startTimeGMT'] = timeInTimeZone;
				// item.json['startTimeNumber'] = startTimeNumber;

				item.json['endTime'] = endTime;



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
