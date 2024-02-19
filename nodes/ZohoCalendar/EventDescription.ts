import { INodeProperties } from "n8n-workflow";

export const eventFields: INodeProperties[] = [

	// 					METHOD SELECTOR
	// --------------------------------------
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
				method: [
					'createNewEvent',
					'moveEvent',
					'deleteEvent',
					'updateEvent',
					'getEventsList',
					'getEventsDetails',
					'getAttachmentDetails',
					'deleteAttachment',
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
				method: [
					'moveEvent',
					'deleteEvent',
					'updateEvent',
					'getEventsDetails',
					'getAttachmentDetails',
					'deleteAttachment',
					'getAttendeesDetails',
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
				method: [
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
				method: [
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
				method: [
					'createNewEvent',
					'moveEvent',
					'updateEvent',
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
				method: [
					'createNewEvent',
					'moveEvent',
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
				method: [
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
				method: [
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
				method: [
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
		description: 'The updated time zone of the event. Leave blank to keep the same.',
		displayOptions: {
			show: {
				method: [
					'moveEvent',
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
		placeholder: 'Liam\'s birthday party. Don\'t forget a gift.',
		displayOptions: {
			show: {
				method: [
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
				method: [
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
		displayName: 'Attachment ID',
		name: 'attachmentId',
		required: true,
		type: 'string',
		default: '',
		placeholder: '08cfc73476024a75a957c0524691a250@zoho.com',
		description: 'The ID of the attachement you want. Find the ID by using a \'Get Event Details\' node first.',
		displayOptions: {
			show: {
				method: [
					'getEventsDetails',
				]
			},
		},
	},
	// get attachment details options
	{
		displayName: 'Attachment Options',
		name: 'attachmentId',
		required: true,
		displayOptions: {
			show: {
				method: [
					'getEventsDetails',
				]
			},
		},
		type: 'options',
		options: [
			{
				name: 'Download',
				value: 'download',
			},
			{
				name: 'View URL',
				value: 'viewUrl',
			},
		],
		default: 'download',
	},
]
