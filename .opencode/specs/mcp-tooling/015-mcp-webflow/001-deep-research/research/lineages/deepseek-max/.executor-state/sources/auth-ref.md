> For clean Markdown of any page, append .md to the page URL.
> For a complete documentation index, see https://developers.webflow.com/llms.txt.
> For AI client integration (Claude Code, Cursor, etc.), connect to the MCP server at https://developers.webflow.com/_mcp/server.

# Authentication

This guide covers the options for authenticating requests to the Webflow API, including the different methods available and how to choose the best approach for your needs.

## Getting a token

To access the Webflow API, you need to authenticate your requests using a bearer token, which must be included in the authorization header of each API request. There are types of bearer tokens you can create: [Site Tokens](/data/reference/site-token) and [OAuth tokens](/data/reference/oauth-app). Each method is suited to different use cases, and choosing the right one depends on your specific needs.

#### [Site Token](/data/reference/site-token)

Site Tokens provide a simple way to authenticate API requests for a specific Webflow site.

<br />

**When to use**<br />
Best suited for internal tools and single-site integrations where you control the environment.

<br />

<a href="/data/reference/site-token">
  <button class="button cc-secondary">Get a Site Token</button>
</a>

#### [Workspace Token](/data/reference/workspace-token)

Workspace Tokens provide access for all sites in a Webflow Workspace.

<br />

**When to use**<br />
Best suited for read-only uses, such as monitoring and auditing multiple sites.

<br />

<a href="/data/reference/workspace-token">
  <button class="button cc-secondary">Get a Workspace Token</button>
</a>

#### [OAuth](/data/reference/oauth-app)

OAuth Tokens are used for complex integrations that span multiple sites or require user-specific access.

<br />

**When to use**<br />
Ideal for public integrations, Apps in the Webflow Marketplace, or any scenario requiring secure, user-specific access.

<br />

<a href="/data/reference/oauth-app">
  <button class="button cc-secondary">Get OAuth Token</button>
</a>

#### Quickstart Tip

If you're eager to explore the API without setting up full authentication, use our API playground available in the [API reference. ](/data/reference/sites/list)Authenticate once and make requests directly from the documentation.

## Sending a request

Sending a request to the Webflow API v2 is straightforward. Include your bearer token in the Authorization header:

```curl cURL
curl --request GET \
     --url https://api.webflow.com/v2/sites \
     --header 'accept: application/json' \
     --header 'authorization: Bearer YOUR_TOKEN'
```

Replace `YOUR_TOKEN` with your actual API token. This setup authenticates your request, allowing access to Webflow resources.

## Revoking a token

To maintain the security of your integration, it's important to revoke access tokens when they're no longer needed or if you suspect they have been compromised. Revoking a token immediately invalidates it, ensuring that it can no longer be used to access the Webflow API.

You can revoke tokens programmatically through the Webflow API or manage them directly within the Webflow dashboard.

#### Site Token

Webflow users can remove Site Tokens from the Site Settings. This ensures that unused tokens are securely revoked.

<img src="https://fdr-prod-docs-files-public.s3.us-east-1.amazonaws.com/https%3A//webflow.docs.buildwithfern.com/4b37c5fcf7a8b5678a6908078260d3ac50402765a6dd0935149d0c2ac9ad16c9/assets/images/2457dbd-Screenshot_2024-07-31_at_6.13.34_PM.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA6KXJSKKNFOCF7G4B%2F20260802%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260802T162909Z&X-Amz-Expires=604800&X-Amz-Signature=ba1446ae50865008e5feca8b3ec35ddc334b72681677a82f7ccf3c4651f8aa19&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject" alt="Site Token Removal" />

#### OAuth Token

You can programmatically revoke an access token obtained through the OAuth 2.0 flow by making a call to the API. For detailed instructions, see our OAuth Authorization Docs.

<br />

<br />

<button class="button cc-primary" onclick="window.location.href='https://developers.webflow.com/data/reference/oauth-app#revoke-an-access-token'">
  View OAuth docs
</button>

## Securing and storing your API tokens

When working with the Webflow API, safeguarding your API tokens is critical to maintaining the security and integrity of your application. API tokens are like passwords for your application—they provide access to sensitive data and actions. Protecting them is essential to prevent unauthorized use and potential security breaches.

### Best practices for token security

1. **Use environment variables**
   Store API tokens in environment variables rather than in your source code. This reduces the risk of accidentally exposing tokens, especially if your code is shared or made public.
2. **Regular token rotation and revocation**
   Regularly rotate your API tokens to minimize risk. If you suspect a token has been compromised, revoke it immediately and generate a new one.

## Troubleshooting

Despite best efforts, issues with API tokens can still occur. Here are common pitfalls and tips to resolve them:

#### Expired or invalid tokens

* Implement a system to refresh tokens automatically before they expire, or prompt users to re-authenticate.
* Check token validity and handle expired tokens gracefully in your application.

#### Scope and permission errors

* Ensure your tokens include the correct scopes for the actions you intend to perform. Review the Webflow API documentation for an API endpoint  to verify required scopes.

#### Debugging tips

* Log and review error messages to identify where the authentication process is breaking down.
* Start with minimal scopes to test and gradually increase permissions as needed.
* Verify that your requests include the authorization header with the token.