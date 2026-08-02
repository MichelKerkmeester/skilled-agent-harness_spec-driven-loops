> For clean Markdown of any page, append .md to the page URL.
> For a complete documentation index, see https://developers.webflow.com/llms.txt.
> For AI client integration (Claude Code, Cursor, etc.), connect to the MCP server at https://developers.webflow.com/_mcp/server.

# Site Token

> Create an API token to access site-specific resources via the Webflow Data API.

Site tokens provide access to site-specific [resources](/data/reference/structure-1) via the Webflow Data API.

Site tokens are required to authenticate requests to the Webflow Data API. Each token acts as a unique identifier and password, allowing Webflow to verify:

* **Who** is making the request
* **What** they're allowed to do through [scopes and permissions](https://developers.webflow.com/data/reference/scopes)
* **Which** sites and workspaces they're accessing

You'll need to include your site token in the "Authorization" header of every API request. You'll see how to do this in the examples below.

<br />

## Creating a site token

#### Site administrator access required

Only site administrators are authorized to create a site token. If you're not a site administrator, please contact one to create the token for you.

1. In your workspace, find the site you want to create a token for and click the <img src="https://dhygzobemt712.cloudfront.net/Icons/Light/24px/Settings.svg" /> gear icon to open the site settings.

2. In the left sidebar of your site's settings, select **Apps & integrations**. Scroll to the bottom of the page to the **API access** section.

   ![](https://fdr-prod-docs-files-public.s3.us-east-1.amazonaws.com/https%3A//webflow.docs.buildwithfern.com/8aac678edff413faac25dca4875c2f5b55af9b9a76b9354794191c95e15c5573/assets/images/d504f6c-image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA6KXJSKKNFOCF7G4B%2F20260802%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260802T155348Z&X-Amz-Expires=604800&X-Amz-Signature=9920653b162f70bb13fced655baeeb863c3cb2a880db6b0a9033a15c2180e67b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

3. Click Generate API token.

4. Enter a name for your token, and choose the [scopes](/data/reference/scopes) needed for your use case.

   ![](https://fdr-prod-docs-files-public.s3.us-east-1.amazonaws.com/https%3A//webflow.docs.buildwithfern.com/4214985a35cb0f9fa2cc64b81aad2086bb4138a0312c47a1cb2cd9f242281969/assets/images/67976fe-image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA6KXJSKKNFOCF7G4B%2F20260802%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260802T155348Z&X-Amz-Expires=604800&X-Amz-Signature=c6a3e9b86b5012fe312fdd3b74752f3be89c0ba065582b08c63ba6a69709ca49&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

5. Click "Generate token."

6. Copy the generated token to your clipboard and save it in a secure location.

<br />

### Limitations

* **API tokens expire after 365 consecutive days of inactivity.** Any API call made with the token before expiry will reset the inactivity period.
* **Site tokens are created per site.** If you're looking to build an integration that works across multiple sites, [consider creating a Webflow App.](/data/docs/getting-started-apps)
* **Each site can have up to 5 tokens.** This limit ensures manageable token access and security.
* **Site tokens don't grant access to the following endpoints:**
  <br />
  * Authorization endpoints
  * Custom code endpoints
  * Workspace Activity log endpoints

<br />

## Using a site token

Now that you have your site token, you can start making requests to the Webflow Data APIs.

#### cURL

**Example**

```bash request
curl --request GET \
  --url https://api.webflow.com/v2/sites \
  --header 'accept: application/json' \
  --header 'authorization: Bearer YOUR_API_TOKEN'
```

This command retrieves a list of sites associated with your Webflow account. Replace `YOUR_API_TOKEN` with the site token you generated.

#### JavaScript

If you prefer working with JavaScript, you can use the Webflow JavaScript SDK. The SDK simplifies interacting with the Webflow API and handling requests.

First, install the Webflow SDK using npm:

```bash
npm install webflow-api
```

**Example**

```javascript request
import { WebflowClient } from 'webflow-api';

const token = 'YOUR_API_TOKEN';
const webflow = new WebflowClient({ accessToken: token });

(async () => {
try {
   const sites = await webflow.sites.list();
   console.log(sites);
} catch (error) {
   console.error('Error fetching sites:', error);
}
})();
```

This command retrieves a list of sites associated with your Webflow account. Replace `YOUR_API_TOKEN` with the site token you generated.

#### Python

To make requests to the Webflow API using Python, you'll need to install the Webflow package and use it to interact with the API.

First, install the Webflow package using pip:

```bash
pip install webflow
```

**Example**

```python request
from webflow.client import Webflow

# Initialize the Webflow client with your access token
client = Webflow(access_token="YOUR_ACCESS_TOKEN")

# Fetch the list of sites
sites = client.sites.list()

# Print the list of sites
print(sites)
```

This command retrieves a list of sites associated with your Webflow account. Replace `YOUR_API_TOKEN` with the site token you generated.

### Example API response

Here's an example of what a response from the Webflow API might look like:

{/* <!-- vale off --> */}

```json Response
{
   "id": "42e98c9a982ac9b8b742",
   "workspaceId": "42e63e98c9a982ac9b8b742",
   "displayName": "The Hitchhiker's Guide to the Galaxy",
   "shortName": "hitchhikers-guide",
   "previewUrl": "https://screenshots.webflow.com/sites/6258612d1ee792848f805dcf/20231219211811_d5990556c743f33b7071300a03bf67e6.png",
   "timeZone": "Magrathea/FactoryFloor",
   "createdOn": "1979-10-12T12:00:00.000Z",
   "lastUpdated": "2023-04-02T12:42:00.000Z",
   "lastPublished": "2023-04-02T12:42:00.000Z",
   "parentFolderId": "1as2d3f4g5h6j7k8l9z0x1c2v3b4n5m6",
   "customDomains": [
      {
         "id": "589a331aa51e760df7ccb89d",
         "url": "hitchhikersguide.galaxy"
      },
      {
         "id": "589a331aa51e760df7ccb89e",
         "url": "heartofgold.spaceship"
      }
   ],
   "locales": {
      "value": {
         "primary": {
            "id": "653fd9af6a07fc9cfd7a5e57",
            "cmsLocaleId": "653ad57de882f528b32e810e",
            "enabled": false,
            "displayName": "English (United States)",
            "displayImageId": null,
            "redirect": true,
            "subdirectory": "",
            "tag": "en-US"
         },
         "secondary": [
            {
               "id": "653fd9af6a07fc9cfd7a5e56",
               "cmsLocaleId": "653fd9af6a07fc9cfd7a5e5d",
               "enabled": true,
               "displayName": "French (France)",
               "displayImageId": null,
               "subdirectory": "fr-fr",
               "tag": "fr-FR"
            },
            {
               "id": "654112a3a525b2739d97664c",
               "cmsLocaleId": "654112a3a525b2739d97664f",
               "enabled": true,
               "displayName": "Spanish (Mexico)",
               "displayImageId": null,
               "subdirectory": "es-mx",
               "tag": "es-MX"
            }
         ]
      }
   }
}
```

<br />

## Revoking a site token

To revoke a site token:

1. Go to Site settings > Apps & integrations > API access.
2. Find your site token
3. Select the "revoke" button

<img src="https://fdr-prod-docs-files-public.s3.us-east-1.amazonaws.com/https%3A//webflow.docs.buildwithfern.com/59b3df60ea1946f9b4c1b9832cc5e6a5ce21d578374cc94b83a0665edaa3d8cf/assets/images/4d03d0a-image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA6KXJSKKNFOCF7G4B%2F20260802%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260802T155348Z&X-Amz-Expires=604800&X-Amz-Signature=07142de5ea780a360709d56240bc0891ab9bb90c2b77386161f03cb066c64d0a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject" alt="Revoke site token" />

Revoking a site token is an additional security measure for your Webflow site. This process disables the token, preventing any further access or use. You should consider revoking a site token in the following situations:

* **Security Concerns:** If there's a potential security issue, revoke the token immediately.
* **Administrator Changes:** If an administrator leaves or their role changes, revoke their token to maintain security.
* **Token Management:** Regularly review and revoke tokens that are no longer needed.

<br />

### Best practices

* **Mint tokens for each use case**: Instead of reusing tokens, generate a new token for each specific use case to maintain better security and control.
* **Rotate tokens periodically**: Regularly update and revoke old tokens to maintain security.
* **Be Descriptive**: Name your tokens something descriptive and meaningful to easily identify their purpose.
* **Minimal Scopes**: Generate tokens with the minimal scopes needed for your use case. Mint a new one if you need to add new scopes. This limits the potential impact if a token is compromised.

<br />

## Troubleshooting and FAQs

#### How long is a site token valid?

Site tokens are valid until they're manually revoked or after 365 days of inactivity.

#### Can I regenerate a site token?

Yes, you can generate a new token at any time from the API access section in your site settings.

#### What happens if I lose my site token?

You will need to generate a new one and update any integrations using the old token.