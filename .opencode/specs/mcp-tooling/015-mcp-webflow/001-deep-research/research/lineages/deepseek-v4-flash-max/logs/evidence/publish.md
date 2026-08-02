> For clean Markdown of any page, append .md to the page URL.
> For a complete documentation index, see https://developers.webflow.com/llms.txt.
> For AI client integration (Claude Code, Cursor, etc.), connect to the MCP server at https://developers.webflow.com/_mcp/server.

# Publish Site

POST https://api.webflow.com/v2/sites/{site_id}/publish
Content-Type: application/json

Publishes a site or an individual page to one or more domains.
If multiple individual pages are published to staging, publishing from staging to production publishes all staged changes.

To publish to a specific custom domain, use the domain IDs from the [Get Custom Domains](/data/reference/sites/get-custom-domain) endpoint.

You must include at least one of the `customDomains` or `publishToWebflowSubdomain` properties in the request body.

To publish an individual page instead of the entire site, provide the ID of the page in the `pageId` parameter.

<Note title="Rate limit: 1 publish per minute">This endpoint has a specific rate limit of one successful publish queue per minute.</Note>

Required scope | `sites:write`


Reference: https://developers.webflow.com/data/reference/sites/publish

## OpenAPI Specification

```yaml
openapi: 3.1.0
info:
  title: v2-data
  version: 1.0.0
paths:
  /sites/{site_id}/publish:
    post:
      operationId: publish
      summary: Publish Site
      description: >
        Publishes a site or an individual page to one or more domains.

        If multiple individual pages are published to staging, publishing from
        staging to production publishes all staged changes.


        To publish to a specific custom domain, use the domain IDs from the [Get
        Custom Domains](/data/reference/sites/get-custom-domain) endpoint.


        You must include at least one of the `customDomains` or
        `publishToWebflowSubdomain` properties in the request body.


        To publish an individual page instead of the entire site, provide the ID
        of the page in the `pageId` parameter.


        <Note title="Rate limit: 1 publish per minute">This endpoint has a
        specific rate limit of one successful publish queue per minute.</Note>


        Required scope | `sites:write`
      tags:
        - Sites
      parameters:
        - name: site_id
          in: path
          description: Unique identifier for a Site
          required: true
          schema:
            type: string
            format: objectid
        - name: Authorization
          in: header
          description: Bearer authentication
          required: true
          schema:
            type: string
      responses:
        '202':
          description: Request accepted
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/sites_publish_Response_202'
        '400':
          description: Bad Request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Site-publishRequestBadRequestError'
        '401':
          description: >-
            Provided access token is invalid or does not have access to
            requested resource
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Site-publishRequestUnauthorizedError'
        '403':
          description: Forbidden
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Site-publishRequestForbiddenError'
        '404':
          description: Requested resource not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Site-publishRequestNotFoundError'
        '429':
          description: >-
            The rate limit of the provided access_token has been reached. Please
            have your application respect the X-RateLimit-Remaining header we
            include on API responses.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Site-publishRequestTooManyRequestsError'
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                customDomains:
                  type: array
                  items:
                    type: string
                  description: Array of Custom Domain IDs to publish
                publishToWebflowSubdomain:
                  type: boolean
                  default: false
                  description: >-
                    Choice of whether to publish to the default Webflow
                    Subdomain
                pageId:
                  type: string
                  description: The ID of the page to publish
servers:
  - url: https://api.webflow.com/v2
    description: Data API
components:
  schemas:
    SitesSiteIdPublishPostResponsesContentApplicationJsonSchemaCustomDomainsItems:
      type: object
      properties:
        id:
          type: string
          format: objectid
          description: Unique identifier for the Domain
        url:
          type: string
          description: The registered Domain name
        lastPublished:
          type:
            - string
            - 'null'
          format: date-time
          description: The date the custom domain was last published to
      required:
        - id
      title: >-
        SitesSiteIdPublishPostResponsesContentApplicationJsonSchemaCustomDomainsItems
    SitesSiteIdPublishPostResponsesContentApplicationJsonSchemaPublishScope:
      type: string
      enum:
        - site
        - page
      description: Whether the site or an individual page was published
      title: SitesSiteIdPublishPostResponsesContentApplicationJsonSchemaPublishScope
    sites_publish_Response_202:
      type: object
      properties:
        customDomains:
          type: array
          items:
            $ref: >-
              #/components/schemas/SitesSiteIdPublishPostResponsesContentApplicationJsonSchemaCustomDomainsItems
          description: Array of domains objects
        publishToWebflowSubdomain:
          type: boolean
          default: false
          description: Flag for publishing to webflow.io subdomain
        publishScope:
          $ref: >-
            #/components/schemas/SitesSiteIdPublishPostResponsesContentApplicationJsonSchemaPublishScope
          description: Whether the site or an individual page was published
      title: sites_publish_Response_202
    Site-publishRequestBadRequestError:
      oneOf:
        - description: Any type
        - description: Any type
      title: Site-publishRequestBadRequestError
    SitesSiteIdPublishPostResponsesContentApplicationJsonSchemaCode:
      type: string
      enum:
        - analyze_filter_conflict
        - analyze_input_validation
        - analyze_unsupported_filter
        - bad_request
        - before_historical_floor
        - collection_not_found
        - conflict
        - duplicate_collection
        - duplicate_user_email
        - ecommerce_not_enabled
        - forbidden
        - forms_require_republish
        - incompatible_webhook_filter
        - internal_error
        - invalid_auth_version
        - invalid_credentials
        - invalid_domain
        - invalid_time_range
        - invalid_user_email
        - item_not_found
        - missing_scopes
        - no_domains
        - not_authorized
        - not_enterprise_plan_site
        - not_enterprise_plan_workspace
        - order_not_found
        - resource_not_found
        - service_unavailable
        - time_range_too_wide
        - too_many_requests
        - unsupported_version
        - unsupported_webhook_trigger_type
        - user_limit_reached
        - user_not_found
        - users_not_enabled
        - validation_error
      description: Error code
      title: SitesSiteIdPublishPostResponsesContentApplicationJsonSchemaCode
    SitesSiteIdPublishPostResponsesContentApplicationJsonSchemaDetailsItems:
      oneOf:
        - type: string
        - type: object
          additionalProperties:
            description: Any type
      title: SitesSiteIdPublishPostResponsesContentApplicationJsonSchemaDetailsItems
    Site-publishRequestUnauthorizedError:
      type: object
      properties:
        code:
          $ref: >-
            #/components/schemas/SitesSiteIdPublishPostResponsesContentApplicationJsonSchemaCode
          description: Error code
        message:
          type: string
          description: Error message
        externalReference:
          type: string
          description: Link to more information
        details:
          type: array
          items:
            $ref: >-
              #/components/schemas/SitesSiteIdPublishPostResponsesContentApplicationJsonSchemaDetailsItems
          description: Array of errors
      title: Site-publishRequestUnauthorizedError
    Site-publishRequestForbiddenError:
      type: object
      properties:
        code:
          $ref: >-
            #/components/schemas/SitesSiteIdPublishPostResponsesContentApplicationJsonSchemaCode
          description: Error code
        message:
          type: string
          description: Error message
        externalReference:
          type: string
          description: Link to more information
        details:
          type: array
          items:
            $ref: >-
              #/components/schemas/SitesSiteIdPublishPostResponsesContentApplicationJsonSchemaDetailsItems
          description: Array of errors
      title: Site-publishRequestForbiddenError
    Site-publishRequestNotFoundError:
      type: object
      properties:
        code:
          $ref: >-
            #/components/schemas/SitesSiteIdPublishPostResponsesContentApplicationJsonSchemaCode
          description: Error code
        message:
          type: string
          description: Error message
        externalReference:
          type: string
          description: Link to more information
        details:
          type: array
          items:
            $ref: >-
              #/components/schemas/SitesSiteIdPublishPostResponsesContentApplicationJsonSchemaDetailsItems
          description: Array of errors
      title: Site-publishRequestNotFoundError
    Site-publishRequestTooManyRequestsError:
      type: object
      properties:
        code:
          $ref: >-
            #/components/schemas/SitesSiteIdPublishPostResponsesContentApplicationJsonSchemaCode
          description: Error code
        message:
          type: string
          description: Error message
        externalReference:
          type: string
          description: Link to more information
        details:
          type: array
          items:
            $ref: >-
              #/components/schemas/SitesSiteIdPublishPostResponsesContentApplicationJsonSchemaDetailsItems
          description: Array of errors
      title: Site-publishRequestTooManyRequestsError
  securitySchemes:
    OAuth2:
      type: http
      scheme: bearer

```

## Examples



**Request**

```json
{
  "customDomains": [
    "660c6449dd97ebc7346ac629",
    "660c6449dd97ebc7346ac62f"
  ],
  "publishToWebflowSubdomain": false
}
```

**Response**

```json
{
  "customDomains": [
    {
      "id": "589a331aa51e760df7ccb89d",
      "url": "test-api-domain.com",
      "lastPublished": "2022-12-07T16:51:37.571Z"
    }
  ],
  "publishToWebflowSubdomain": false,
  "publishScope": "site"
}
```

**SDK Code**

```typescript
import { WebflowClient } from "webflow-api";

async function main() {
    const client = new WebflowClient({
        accessToken: "YOUR_TOKEN_HERE",
    });
    await client.sites.publish("580e63e98c9a982ac9b8b741", {
        customDomains: [
            "660c6449dd97ebc7346ac629",
            "660c6449dd97ebc7346ac62f",
        ],
        publishToWebflowSubdomain: false,
    });
}
main();

```

```python
from webflow import Webflow

client = Webflow(
    access_token="YOUR_TOKEN_HERE",
)

client.sites.publish(
    site_id="580e63e98c9a982ac9b8b741",
    custom_domains=[
        "660c6449dd97ebc7346ac629",
        "660c6449dd97ebc7346ac62f"
    ],
    publish_to_webflow_subdomain=False,
)

```

```go
package main

import (
	"fmt"
	"strings"
	"net/http"
	"io"
)

func main() {

	url := "https://api.webflow.com/v2/sites/580e63e98c9a982ac9b8b741/publish"

	payload := strings.NewReader("{\n  \"customDomains\": [\n    \"660c6449dd97ebc7346ac629\",\n    \"660c6449dd97ebc7346ac62f\"\n  ],\n  \"publishToWebflowSubdomain\": false\n}")

	req, _ := http.NewRequest("POST", url, payload)

	req.Header.Add("Authorization", "Bearer <token>")
	req.Header.Add("Content-Type", "application/json")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(res)
	fmt.Println(string(body))

}
```

```ruby
require 'uri'
require 'net/http'

url = URI("https://api.webflow.com/v2/sites/580e63e98c9a982ac9b8b741/publish")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["Authorization"] = 'Bearer <token>'
request["Content-Type"] = 'application/json'
request.body = "{\n  \"customDomains\": [\n    \"660c6449dd97ebc7346ac629\",\n    \"660c6449dd97ebc7346ac62f\"\n  ],\n  \"publishToWebflowSubdomain\": false\n}"

response = http.request(request)
puts response.read_body
```

```java
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;

HttpResponse<String> response = Unirest.post("https://api.webflow.com/v2/sites/580e63e98c9a982ac9b8b741/publish")
  .header("Authorization", "Bearer <token>")
  .header("Content-Type", "application/json")
  .body("{\n  \"customDomains\": [\n    \"660c6449dd97ebc7346ac629\",\n    \"660c6449dd97ebc7346ac62f\"\n  ],\n  \"publishToWebflowSubdomain\": false\n}")
  .asString();
```

```php
<?php
require_once('vendor/autoload.php');

$client = new \GuzzleHttp\Client();

$response = $client->request('POST', 'https://api.webflow.com/v2/sites/580e63e98c9a982ac9b8b741/publish', [
  'body' => '{
  "customDomains": [
    "660c6449dd97ebc7346ac629",
    "660c6449dd97ebc7346ac62f"
  ],
  "publishToWebflowSubdomain": false
}',
  'headers' => [
    'Authorization' => 'Bearer <token>',
    'Content-Type' => 'application/json',
  ],
]);

echo $response->getBody();
```

```csharp
using RestSharp;

var client = new RestClient("https://api.webflow.com/v2/sites/580e63e98c9a982ac9b8b741/publish");
var request = new RestRequest(Method.POST);
request.AddHeader("Authorization", "Bearer <token>");
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "{\n  \"customDomains\": [\n    \"660c6449dd97ebc7346ac629\",\n    \"660c6449dd97ebc7346ac62f\"\n  ],\n  \"publishToWebflowSubdomain\": false\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = [
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
]
let parameters = [
  "customDomains": ["660c6449dd97ebc7346ac629", "660c6449dd97ebc7346ac62f"],
  "publishToWebflowSubdomain": false
] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "https://api.webflow.com/v2/sites/580e63e98c9a982ac9b8b741/publish")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "POST"
request.allHTTPHeaderFields = headers
request.httpBody = postData as Data

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error as Any)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
```