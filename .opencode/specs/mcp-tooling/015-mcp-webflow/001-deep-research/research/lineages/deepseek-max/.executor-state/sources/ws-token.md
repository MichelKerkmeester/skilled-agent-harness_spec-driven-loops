> For clean Markdown of any page, append .md to the page URL.
> For a complete documentation index, see https://developers.webflow.com/llms.txt.
> For AI client integration (Claude Code, Cursor, etc.), connect to the MCP server at https://developers.webflow.com/_mcp/server.

# Workspace Token

> Create an API token to access workspace-specific resources via the Webflow Data API.

Workspace tokens provide access to workspace-specific resources via the Webflow Data API.

These tokens are useful for workspace administrators that need access to workspace-level information and [audit logs](/data/reference/enterprise/workspace-audit-logs/get). For access to site data, use a [site token](/data/reference/site-token) instead.

#### Enterprise only

Workspace tokens are only available for Enterprise workspaces.

<br />

## Scopes and endpoints

Create workspace tokens with the following scopes and endpoints.

| Scope                      | Endpoints                                                                         |
| -------------------------- | --------------------------------------------------------------------------------- |
| `workspace_activity: read` | [`GET` Workspace Audit Logs](/data/reference/enterprise/workspace-audit-logs/get) |

Workspace tokens use separate [scopes](/data/reference/scopes) and [resources](/data/reference/structure-1) than site tokens. For example, workspace tokens don't have access to the `site` scope, therefore they can't access site-specific endpoints like [Get Site Information](/data/reference/sites/get). To ensure you're using the correct token for your use case, please refer to the [scopes](/data/reference/scopes) and [resources](/data/reference/structure-1) documentation.

<br />

## Creating a workspace token

#### Workspace administrator access required

Only workspace administrators can create a workspace token.

1. In the left sidebar of your Workspace, select **Apps & integrations** > **Manage**. Scroll to the bottom of the page to the **Workspace API access** section.
   <img src="https://fdr-prod-docs-files-public.s3.us-east-1.amazonaws.com/https%3A//webflow.docs.buildwithfern.com/a71332126e298a724fb4b0058bcb5ebcdc80f7a89fcdbe5b9445e1228538e3c3/products/data/pages/Data%20API/rest-introduction/authentication/assets/workspace-api-access.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA6KXJSKKNFOCF7G4B%2F20260802%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260802T162444Z&X-Amz-Expires=604800&X-Amz-Signature=53700167482126332bb266e7161fe7f3de743676ba5618640c327cb2deba89fb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject" alt="Workspace API access" />

2. Click "Generate API token".

3. Enter a name for your API token.

4. Choose the permissions you want the API token to have for each [scope](/data/reference/scopes).
   (e.g., no access or read-only).
   <img src="https://fdr-prod-docs-files-public.s3.us-east-1.amazonaws.com/https%3A//webflow.docs.buildwithfern.com/b27ab24ded563dfa6b306e6ac97f9d58439f2637fddeab4a235775705b226d81/products/data/pages/Data%20API/rest-introduction/authentication/assets/create-token-2.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA6KXJSKKNFOCF7G4B%2F20260802%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260802T162444Z&X-Amz-Expires=604800&X-Amz-Signature=e0292dad7540c2d41bb0601a3d22e42dcc2b03c32f4407b637dcbee26ebd1a3e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject" alt="Create token" />

5. Click Generate token.

6. Copy the generated token to your clipboard and save it in a secure location.

<br />

### Limitations

* **Enterprise only.** Workspace tokens are only available for Enterprise workspaces.
* **API tokens expire after 365 consecutive days of inactivity.** Any API call made with the token before expiry will reset the inactivity period.
* **Each workspace can have up to 5 tokens.** This limit ensures manageable token access and security.
* **Limited endpoints.** Workspace tokens are designed with different scopes than site tokens. For example, workspace tokens don't have access to the `site` scope, therefore they can't be used to access site-specific endpoints. Please refer to the [scopes](/data/reference/scopes) documentation for more information.

<br />

## Using a workspace token

Now that you have your workspace token, you can start making requests to the Webflow Data APIs that require a workspace token.

#### cURL

The simplest way to make a request is by using cURL

**Example**

```bash request
curl --request GET \
  --url https://api.webflow.com/v2/workspaces/:workspace_id_or_slug/audit_logs \
  --header 'accept: application/json' \
  --header 'authorization: Bearer YOUR_API_TOKEN'
```

This command retrieves a list of activity across your workspace. Replace `YOUR_API_TOKEN` with the workspace token you generated.

#### JavaScript

If you prefer working with JavaScript, you can use the Webflow JavaScript SDK. The SDK simplifies interacting with the Webflow API and handling requests.

First, install the Webflow SDK using npm:

```shell
npm install webflow-api
```

**Example**

```javascript request
import { WebflowClient } from 'webflow-api';

const token = 'YOUR_API_TOKEN';
const webflow = new WebflowClient({ accessToken: token });

(async () => {
try {
   const auditLogs = await webflow.workspaces.auditLogs.getWorkspaceAuditLogs('workspace_id_or_slug', {
      from: "2024-04-22T16:00:31Z",
      to: "2024-04-22T16:00:31Z"
   });
   console.log(auditLogs);
} catch (error) {
   console.error('Error fetching audit logs:', error);
}
})();
```

This command retrieves a list of activity across your workspace. Replace `YOUR_API_TOKEN` with the workspace token you generated.

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

# Fetch the list of activity across your workspace
client.workspaces.audit_logs.get_workspace_audit_logs(
 workspace_id_or_slug="hitchhikers-workspace",
 from_=datetime.datetime.fromisoformat(
     "2024-04-22 16:00:31+00:00",
 ),
 to=datetime.datetime.fromisoformat(
     "2024-04-22 16:00:31+00:00",
 ),
)

# Print the audit logs
print(audit_logs)
```

This command retrieves a list of activity across your workspace. Replace `YOUR_API_TOKEN` with the workspace token you generated.

### Example API response

Here's an example of what a response from the Webflow API might look like:

{/* <!-- vale off --> */}

```json Response
  {
  "items": [
      {
      "eventType": "user_access",
      "eventSubType": "login",
      "payload": {
          "method": "dashboard",
          "location": "Ashburn US",
          "ipAddress": "54.165.18.93"
      }
      },
      {
      "eventType": "user_access",
      "eventSubType": "login",
      "payload": {
          "method": "sso"
      }
      },
      {
      "eventType": "user_access",
      "eventSubType": "login",
      "payload": {
          "method": "dashboard"
      }
      }
  ],
  "pagination": {
      "limit": 10,
      "offset": 0,
      "total": 3
  }
  }
```

<br />

### Best practices

* **Mint tokens for each use case**: Instead of reusing tokens, generate a new token for each specific use case to maintain better security and control.
* **Rotate tokens periodically**: Regularly update and revoke old tokens to maintain security.
* **Be Descriptive**: Name your tokens something descriptive and meaningful to easily identify their purpose.
* **Minimal Scopes**: Generate tokens with the minimal scopes needed for your use case. Mint a new one if you need to add new scopes. This limits the potential impact if a token is compromised.

<br />

<br />

## Revoking a workspace token

To revoke a workspace token:

1. In the left sidebar of your Workspace, select **Apps & integrations** > **Manage**. Scroll to the bottom of the page to the **Workspace API access** section.
2. Find your workspace token
3. Click the "Revoke" button

<img src="https://fdr-prod-docs-files-public.s3.us-east-1.amazonaws.com/https%3A//webflow.docs.buildwithfern.com/3071b481425bdd6601d5263a53b358716840d3f4a10f929dd0c80f0360bea4d0/products/data/pages/Data%20API/rest-introduction/authentication/assets/revoke-token.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA6KXJSKKNFOCF7G4B%2F20260802%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260802T162444Z&X-Amz-Expires=604800&X-Amz-Signature=cf72a6cf5f0ef2969813edf794689c32efcbecaf529bb5f8b7c1d32e26634d13&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject" alt="Revoke token" />

Revoking a site token is an additional security measure for your Webflow site. This process disables the token, preventing any further access or use. You should consider revoking a site token in the following situations:

* **Security Concerns:** If there's a potential security issue, revoke the token immediately.
* **Administrator Changes:** If an administrator leaves or their role changes, revoke their token to maintain security.
* **Token Management:** Regularly review and revoke tokens that are no longer needed.

<br />

## Troubleshooting and FAQs

#### How long is a workspace token valid?

Workspace tokens are valid until they're manually revoked or after 365 days of inactivity.

#### Can I regenerate a workspace token?

You can not regenerate an existing token. However you can generate a new token at any time from the API access section in your workspace settings.

#### What happens if I lose my workspace token?

You will need to generate a new workspace token and update any integrations using the old token.