import { INodeProperties } from "n8n-workflow";

export const eventOperations: INodeProperties[] = [

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
		displayOptions: {
			show: {
				resource: ['event',]
			},
		},
	},
	{
		displayName: 'Calendar UID',
		name: 'calendarId',
		required: true,
		type: 'string',
		default: '',
		placeholder: '79dc7305aede44d8e7874351d00f9641',
		description: 'The UID of the calendar you want',
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
		displayName: 'Time Zone',
		name: 'timeZone',
		type: 'string',
		default: '={{ $now.format(\'z\') }}',
		required: true,
		description: 'Whether it is an all day event',
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
				displayName: 'Is All Day Event?',
				name: 'isAllDayEvent',
				type: 'boolean',
				default: false,
				description: 'Whether it is an all day event',
			},
			{
				displayName: 'Is Private?',
				name: 'isPrivate',
				type: 'boolean',
				default: false,
				description: 'Whether the event details will not be shared even when the calendar is made public or shared with others with any permissions except delegate permission',
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
	},
]
