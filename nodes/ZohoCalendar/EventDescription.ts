import { INodeProperties } from "n8n-workflow";

export const eventOperations: INodeProperties[] = [

	// 					METHOD SELECTOR
	// --------------------------------------
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
		options: [
			{
				name: 'Create Event',
				value: 'createNewEvent',
				action: 'Create new event',
				description: 'Add an event to calendar',

			},
			{
				name: 'Move Event',
				value: 'moveEvent',
				action: 'Move event',
				description: 'Move an event To another calendar',
			},
			{
				name: 'Delete Event',
				value: 'deleteEvent',
				action: 'Delete event',
			},
			{
				name: 'Update Event',
				value: 'updateEvent',
				action: 'Update event',
			},
			{
				name: 'Get Events List',
				value: 'getEventsList',
				action: 'Get events',
				description: 'Gets list of events within specified range',
			},
			{
				name: 'Get Events Details',
				value: 'getEventsDetails',
				action: 'Get event details',
				description: 'Get details for one specific event',
			},
			{
				name: 'Download Attachment',
				value: 'downloadAttachment',
				action: 'Download attachment',
			},
		],
		default: 'createNewEvent',
		displayOptions: {
			show: {
				resource: ['event',]
			},
		},
	},
]

export const eventFields: INodeProperties[] = [
	// 					SIMILAR FIELDS
	// --------------------------------------
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
				operation: [
					'createNewEvent',
					'moveEvent',
					'deleteEvent',
					'updateEvent',
					'getEventsList',
					'getEventsDetails',
					'downloadAttachment',
					'getAttendeesDetails',
				]
			},
		},
	},
	// Event uid for get event details
	{
		displayName: 'Event UID',
		name: 'eventId',
		required: true,
		type: 'string',
		default: '',
		placeholder: '08cfc73476024a75a957c0524691a250@zoho.com',
		description: 'The UID of the calendar you want',
		displayOptions: {
			show: {
				operation: [
					'moveEvent',
					'deleteEvent',
					'updateEvent',
					'getEventsDetails',
					'downloadAttachment',
					'getAttendeesDetails',
				]
			},
		},
	},
	// new calendar id
	{
		displayName: 'New Calendar UID',
		name: 'newCalendarId',
		required: true,
		type: 'string',
		default: '',
		placeholder: '79dc7305aede44d8e7874351d00f9641',
		description: 'The UID of the calendar you want to move the event to',
		displayOptions: {
			show: {
				operation: [
					'moveEvent',
				]
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
				operation: [
					'createNewEvent',
				]
			},
		},
	},
	{
		displayName: 'Update Event Title',
		name: 'updateEventTitle',
		type: 'string',
		default: '',
		placeholder: 'My Really Cool Event',
		description: 'Update title of event. Leave blank to keep original name.',
		displayOptions: {
			show: {
				operation: [
					'updateEvent',
				]
			},
		},
	},
	{
		displayName: 'Start Time',
		name: 'startTime',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: {
				operation: [
					'createNewEvent',
				]
			},
		},
	},
	{
		displayName: 'End Time',
		name: 'endTime',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: {
				operation: [
					'createNewEvent',

				]
			},
		},
	},
	{
		displayName: 'Change Start Time',
		name: 'startTime',
		type: 'dateTime',
		default: '',
		description: 'Leave blank to keep the same start time',
		displayOptions: {
			show: {
				operation: [
					'updateEvent',
				]
			},
		},
	},
	{
		displayName: 'Change End Time',
		name: 'endTime',
		type: 'dateTime',
		default: '',
		description: 'Leave blank to keep the same end time',
		displayOptions: {
			show: {
				operation: [
					'updateEvent',

				]
			},
		},
	},
	// Range for get events search
	{
		displayName: 'Start Of Search Range',
		name: 'startOfSearchRangeTime',
		type: 'dateTime',
		required: true,
		description: 'Start DateTime for range to get calendar events from. Range must be under 31 days.',
		default: '',
		displayOptions: {
			show: {
				operation: [
					'getEventsList',
				]
			},
		},
	},
	{
		displayName: 'End Of Search Range',
		name: 'endOfSearchRangeTime',
		type: 'dateTime',
		required: true,
		description: 'End DateTime for range to get calendar events from. Range must be under 31 days.',
		default: '',
		displayOptions: {
			show: {
				operation: [
					'getEventsList',
				]
			},
		},
	},
	{
		displayName: 'Time Zone',
		name: 'timeZone',
		type: 'string',
		default: '={{ $now.format(\'z\') }}',
		required: true,
		description: 'The time zone of the event',
		displayOptions: {
			show: {
				operation: [
					'createNewEvent',
					'getEventsList',
				]
			},
		},
	},
	{
		displayName: 'Time Zone',
		name: 'timeZone',
		type: 'string',
		default: '',
		description: 'The updated time zone of the event. Leave blank to keep the same. If changed without new time input, it will convert the currect event time to the new time zone.',
		displayOptions: {
			show: {
				operation: [
					'updateEvent',
				]
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
		description: 'Use a the html line break tag for line breaks',
		placeholder: 'Liam\'s birthday party. <br>Don\'t forget a gift.',
		displayOptions: {
			show: {
				operation: [
					'createNewEvent',
					'updateEvent',
				]
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
				operation: [
					'createNewEvent',
					'updateEvent',
				]
			},
		},
		options: [
			{
				displayName: 'Is All Day Event?',
				name: 'isAllDayEvent',
				type: 'boolean',
				default: false,
				description: 'Whether it is an all day event. If updating, an event can not be changed from a all day event to a nonall day event without specifying times, it will throw an error.',
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
				displayName: 'Color',
				name: 'color',
				type: 'color',
				default: '',
				placeholder: '',
				description: 'The events color',
			},
			{
				displayName: 'Show On Free/Busy Schedule',
				name: 'freeBusy',
				type: 'number',
				typeOptions: {
					maxValue: 1,
					minValue: 0,
					numberStepSize: 1,
				},
				default: '',
				description: 'Whether the event gets added to the free/busy schedule. 0 = adds it | 1 = does not add it.',
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
						],
					},

				],
			},


		],
	},
	// attachment id for get attachment details
	{
		displayName: 'File ID',
		name: 'attachmentId',
		required: true,
		type: 'string',
		default: '',
		placeholder: '08cfc73476024a75a957c0524691a250@zoho.com',
		description: 'The ID of the attachement you want. Find the ID by using a \'Get Event Details\' node first.',
		displayOptions: {
			show: {
				operation: [
					'downloadAttachment',
				]
			},
		},
	},
]
