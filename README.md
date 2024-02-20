![Banner image](/ReadMeFiles/zohoCalNodeBanner.png)


# Table of Contents
- [Table of Contents](#table-of-contents)
- [Overview of Community Zoho Calendar n8n Node](#overview-of-community-zoho-calendar-n8n-node)
- [If you want a custom node](#if-you-want-a-custom-node)
- [Bugs/Contributing/Feature Request](#bugscontributingfeature-request)
- [Roadmap](#roadmap)
- [Documentation](#documentation)
	- [How to install](#how-to-install)
	- [Set Up Credentials](#set-up-credentials)
	- [General](#general)
		- [Get Calendar UID](#get-calendar-uid)
		- [Get Event UID](#get-event-uid)
	- [Event Actions](#event-actions)
		- [Create an event](#create-an-event)
			- [Create an event with an unknown number of attendees](#create-an-event-with-an-unknown-number-of-attendees)
		- [Move Event](#move-event)
		- [Delete Event](#delete-event)
		- [Update Event](#update-event)
		- [Get Events List](#get-events-list)
		- [Get Events Details](#get-events-details)
		- [Download Attachment](#download-attachment)

# Overview of Community Zoho Calendar n8n Node
I created this node because an organization I am affiliated with uses Zoho software and I would like to make it easier for our users to automate with n8n.  \
Also, many of my clients use Zoho products, so making a suite of Zoho nodes will help get them aboard the n8n train! Choo chooooo 🚂


I will focus more on the documentation and readme after I am finished making the functionality of the actual node.

# If you want a custom node
Please reach out to me using the info on [my GitHub page](https://github.com/liamdmcgarrigle).  \
Nodes can be built for the community as well as privately just for one organization.

# Bugs/Contributing/Feature Request

If you have a bug to report or a feature request, please [submit a GitHub issue](https://github.com/liamdmcgarrigle/n8n-nodes-zoho-calendar/issues/new) with as much detail as you're able to give.

Feel free to submit PRs, but please get in touch with me first to make sure I am willing to add the feature before you spend the time on it.

# Roadmap
Here are some things I am working on bringing to this node:

1. Ability to upload attachments with create and update operation
2. Ability to delete attachments with update operation
3. Create Calendar operations (such as list calendars and get calendar details)
4. Clean up code and project files

# Documentation

## How to install
This can only be installed if you are self-hosted. 

1. In n8n, go to the settings
2. On the bottom of the left sidebar, press "Community nodes"
3. Press the Install button and add the package name `n8n-nodes-zoho-calendar`
4. Check the box and press install. It should now be available for you to use in workflows

## Set Up Credentials

1. Go to create a new credential in n8n
It is named "Zoho Calendar OAuth2 API"

2. Set up your Zoho OAuth Client
   
Go [here](https://api-console.zoho.com/) and create a "Server-based Application"  \
In the homepage url field add your n8n instances url.

In the Authorized Redirect URIs field, add the redirect URI from the n8n credential page as well as `https://calendar.zoho.com/`

Then press the "Create" button

3. Copy and Paste your client and secret ID into n8n's credential page
   
4. Press the Connect My Account button and agree to the popup


## General

### Get Calendar UID
1. Go to your [Zoho Calendar homepage](https://calendar.zoho.com/) and go to settings (the gear icon)
   
2. Click on "My Calendars" on the right sidebar
   
3. Click on your desired calendar and scroll to the bottom. Your UID will be the last field on the page

### Get Event UID

There is no obvious way to get an event's uid in Zoho's interface. 

You can get it using the node the following ways:
- Get it from the response when creating a new event
- Get it from the response of get events list node with a search

## Event Actions

### Create an event

#### Create an event with an unknown number of attendees
Add a link here to a template showing how to do this using a custom loop

### Move Event

### Delete Event

### Update Event

### Get Events List
**Search Results Ordering:**  \
Search results are ordered chronologically, with earlier events appearing first (e.g., the event at index 0 precedes the event at index 1).

Date Range Limitation:
The search range must not exceed 31 days to ensure efficient query performance and manageable result sizes.

**Time Zone Handling:**  \
Default Time Zone: In the absence of a specified time zone, all times will default to Coordinated Universal Time (UTC).
Impact on Searches: The specified time zone affects both the search criteria and the formatting of times in the search results. The times displayed in the results will align with the time zone used in the search query.

**Event Inclusion Criteria:**  \
An event is included in the search results if it occurs at any point within the specified search period, with one exception related to exact end times:

Events Ending at the Search Start Time: An event that concludes precisely at the search period's start time will not be included in the results. For example, an event ending at 4:00pm will not appear in the results if the search begins at 4:00pm. However, adjusting the search start to even a second earlier (e.g., 3:59:59pm) will include the event in the results.


### Get Events Details


### Download Attachment
