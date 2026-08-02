> For clean Markdown of any page, append .md to the page URL.
> For a complete documentation index, see https://developers.webflow.com/llms.txt.
> For AI client integration (Claude Code, Cursor, etc.), connect to the MCP server at https://developers.webflow.com/_mcp/server.

# Rate Limits

To ensure consistent performance and fair access to all users, Webflow enforces rate limits on its Data API. These limits vary based on your [site subscription plan](https://www.webflow.com/pricing) and are essential for maintaining the stability of the services.

Your Webflow site plan determines your rate limit:

| Plan                         | Request Per Minute |
| :--------------------------- | :----------------- |
| Starter and Basic            | 60                 |
| CMS, eCommerce, and Business | 120                |
| Enterprise                   | Custom             |

If you exceed your rate limit, Webflow’s API will return an HTTP `429` Too Many Requests error. Along with this response, the `Retry-After` header will tell you how long to wait before attempting new requests—typically, this reset time is 60 seconds.

If your App or integration requires a higher limit, consider [exploring the enterprise options](https://webflow.com/pricing) to request increased access.

<br />

### Endpoint-specific limits

While the general rate limits apply to most API requests, some endpoints have additional constraints. For example, [Site Publish](/data/reference/webhooks/events/site-publish) operations are limited to **one successful publish per minute.** Any endpoint-specific rate limits will be identified within the endpoint's documentation.

<br />

## Caching and rate limits

For cached requests to the [content delivery API](/data/docs/working-with-the-cms/content-delivery), there are effectively no rate limits. However, uncached requests to the origin server count against your plan's rate limits. To learn more about serving live CMS content from a CDN, see the [multi-channel content delivery documentation](/data/docs/working-with-the-cms/content-delivery).

## How rate limits apply to Webflow APIs

Rate limits are applied on a per API key basis. This means that each API key is subject to its own rate limit, independent of any other keys you may be using. Whether you’re running multiple applications or integrating various services, each API key’s usage is tracked.

<br />

## Tracking your API usage

To help you monitor and manage your API usage, Webflow provides three key HTTP response headers with every API request:

| HTTP Response Header  | Description                                                               |
| :-------------------- | :------------------------------------------------------------------------ |
| X-RateLimit-Remaining | Contains the number of available requests remaining in the current minute |
| X-RateLimit-Limit     | Contains your current overall rate limit per minute                       |
| Retry-After           | Contains the time to wait before attempting new requests                  |

<br />

### Example Request

To illustrate how these headers work, here's an example using cURL to make a request to the Webflow Data API:

```curl cURL Request
curl --request GET \
    --url https://api.webflow.com/v2/token/authorized_by \
    --header 'accept: application/json' \
    --header 'authorization: Bearer YOUR_API_TOKEN'
```

<br />

### Example response headers

```
HTTP/1.1 200 OK
Date: Sat, 14 May 2022 09:00:00 GMT
Status: 200 OK
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
Retry-After: 60
```

<br />

## Exceeding rate limits

If your application exceeds the rate limit and encounters a `429 Too Many Requests` error, it’s important to handle retries. [The Webflow SDK](https://developers.webflow.com/data/reference/sdks) includes built-in exponential backoff, automatically adjusting the wait time between retries to minimize further errors. If you’re not using the SDK, it's recommended to implement your own retry logic that respects the `Retry-After` header to keep your application running.

<br />

### Example error

```json
{
    "message": "Too Many Requests",
    "code": "too_many_requests",
    "externalReference": null,
    "details": []
}
```

If you are seeing these errors, you should ensure your application is built to limit the rate of requests it's performing. It could, for example, be triggered by polling aggressively when waiting for resources to be created or making a large number of highly concurrent API calls.

<br />

### Optimizing API usage with webhooks

Frequent polling of the API can lead to rate limit issues, especially if your application is waiting for specific changes or updates. To mitigate this, Webflow offers [Webhooks](https://developers.webflow.com/data/docs/working-with-webhooks), which allow your application to receive real-time updates without the need for continuous API calls. [Implementing webhooks](https://developers.webflow.com/data/docs/working-with-webhooks) is a highly effective way to stay within your rate limits while still maintaining responsive applications.