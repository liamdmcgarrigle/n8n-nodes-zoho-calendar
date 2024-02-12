![Banner image](https://user-images.githubusercontent.com/10284570/173569848-c624317f-42b1-45a6-ab09-f0ea3c247648.png)


# Table of Contents
- [Table of Contents](#table-of-contents)
- [Overview of Community Zoho Calendar n8n Node](#overview-of-community-zoho-calendar-n8n-node)
- [If you want a custom node](#if-you-want-a-custom-node)
- [Documentation](#documentation)
	- [How to install](#how-to-install)
	- [Create a New Credential in n8n](#create-a-new-credential-in-n8n)
- [Bugs/Contributing/Feature Request](#bugscontributingfeature-request)

# Overview of Community Zoho Calendar n8n Node
I created this node because an organization I am affiliated with uses Zoho software and I would like to make it easier for our users to automate with n8n.  \
Also, many of my clients use Zoho products, so making a suit of Zoho nodes will help get them aboard the n8n train! Choo chooooo 🚂


I will focus more on the documentation and readme after I am finished making the functionality of the actual node.

# If you want a custom node
Please reach out to me using the info on [my GitHub page](https://github.com/liamdmcgarrigle).  \
Nodes can be built for the community as well as privately just for one organization.

# Documentation

## How to install
Currently, this node is under development and only possible to run in a development environment.

I will update this when it is published on npm and ready to use!

## Create a New Credential in n8n 

1. Go to create a new credential in n8n
It is named "Zoho Calendar OAuth2 API"

2. Set up your Zoho OAuth Client
   
Go [here](https://api-console.zoho.com/) and create a "Server-based Application"  \
In the homepage url field add your n8n instances url.

In the Authorized Redirect URIs field, add the redirect URI from the n8n credential page as well as `https://calendar.zoho.com/`

Then press the "Create" button

3. Copy and Paste your client and secret ID into n8n's credential page
   
4. Press the Connect My Account button and agree to the popup

# Bugs/Contributing/Feature Request

If you have a bug to report or a feature request, please [submit a GitHub issue](https://github.com/liamdmcgarrigle/n8n-nodes-zoho-calendar/issues/new) with as much detail as you're able to give.

Feel free to submit PRs, but please get in touch with me first to make sure I am willing to add the feature before you spend the time on it.

