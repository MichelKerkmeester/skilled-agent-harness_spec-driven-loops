# API Contract: [YOUR_VALUE_HERE: api-name] - Endpoint Specification

API contract defining endpoint specifications, request/response formats, and integration requirements.

<!-- SPECKIT_TEMPLATE_SOURCE: api-contract | v1.0 -->

---

## 1. METADATA

- **Contract ID**: API-[FORMAT: ###]
- **Version**: [FORMAT: X.Y.Z - example: 1.0.0]
- **Status**: [NEEDS CLARIFICATION: What is the contract status? (a) Draft - under development (b) Review - awaiting approval (c) Published - ready for use (d) Deprecated - being phased out]
- **Date Created**: [FORMAT: YYYY-MM-DD]
- **Last Updated**: [FORMAT: YYYY-MM-DD]
- **Owner**: [YOUR_VALUE_HERE: team or individual responsible]
- **Reviewers**: [YOUR_VALUE_HERE: names/roles]

**Related Documents**:
- Spec: [OPTIONAL: link to spec.md if applicable]
- Data Model: [OPTIONAL: link to data-model.md if applicable]
- OpenAPI/Swagger: [OPTIONAL: link to machine-readable spec]

---

## 2. OVERVIEW

### API Purpose
[YOUR_VALUE_HERE: describe what this API does and who uses it]

### Base URL
```
Production:  https://api.example.com/v1
Staging:     https://api.staging.example.com/v1
Development: http://localhost:3000/v1
```

### API Style
[NEEDS CLARIFICATION: What API style is used? (a) REST (b) GraphQL (c) gRPC (d) WebSocket (e) Hybrid]

### Versioning Strategy
[YOUR_VALUE_HERE: how API versioning is handled - example: URL path versioning (/v1/), header versioning, query parameter]

---

## 3. AUTHENTICATION

### Authentication Method
[NEEDS CLARIFICATION: What authentication method is required? (a) API Key (b) OAuth 2.0 / JWT (c) Basic Auth (d) Session-based (e) None - public API]

### Authentication Details

#### API Key Authentication
```
Header: X-API-Key: [your-api-key]
```

#### Bearer Token (JWT/OAuth)
```
Header: Authorization: Bearer [access-token]
```

### Token Lifecycle

| Token Type | Expiration | Refresh Method |
|------------|------------|----------------|
| Access Token | [duration - example: 15 minutes] | Refresh token exchange |
| Refresh Token | [duration - example: 7 days] | Re-authentication |
| API Key | [duration - example: No expiration] | Manual rotation |

### Authentication Flow
```
[YOUR_VALUE_HERE: ASCII diagram or description of auth flow]

Example:
1. Client → POST /auth/login (credentials) → Server
2. Server → { access_token, refresh_token } → Client
3. Client → GET /api/resource (Authorization: Bearer token) → Server
4. Server → { data } → Client
```

---

## 4. ENDPOINTS

### Endpoint 1: [YOUR_VALUE_HERE: endpoint-name]

#### Definition

| Property | Value |
|----------|-------|
| **Method** | [GET/POST/PUT/PATCH/DELETE] |
| **Path** | `/[path]` |
| **Description** | [What this endpoint does] |
| **Authentication** | [Required/Optional/None] |
| **Rate Limit** | [requests per period - example: 100/minute] |

#### Request

**Headers**:
| Header | Required | Description | Example |
|--------|----------|-------------|---------|
| Authorization | Yes/No | [Description] | `Bearer xxx` |
| Content-Type | Yes/No | [Description] | `application/json` |
| [Custom-Header] | Yes/No | [Description] | [Example] |

**Path Parameters**:
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| [param] | [type] | Yes/No | [Description] | [Example] |

**Query Parameters**:
| Parameter | Type | Required | Default | Description | Example |
|-----------|------|----------|---------|-------------|---------|
| [param] | [type] | Yes/No | [default] | [Description] | [Example] |
| page | integer | No | 1 | Page number | `?page=2` |
| limit | integer | No | 20 | Items per page | `?limit=50` |

**Request Body**:
```json
{
  "field1": "[type] - [description]",
  "field2": "[type] - [description]",
  "nested": {
    "field3": "[type] - [description]"
  }
}
```

**Request Example**:
```bash
curl -X [METHOD] \
  'https://api.example.com/v1/[path]' \
  -H 'Authorization: Bearer [token]' \
  -H 'Content-Type: application/json' \
  -d '{
    "field1": "value1",
    "field2": "value2"
  }'
```

#### Response

**Success Response (200/201)**:
```json
{
  "success": true,
  "data": {
    "id": "[type] - [description]",
    "field1": "[type] - [description]",
    "field2": "[type] - [description]",
    "created_at": "[ISO 8601 timestamp]"
  },
  "meta": {
    "request_id": "[UUID for tracing]"
  }
}
```

**Paginated Response**:
```json
{
  "success": true,
  "data": [
    { "id": "1", "..." : "..." },
    { "id": "2", "..." : "..." }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "total_pages": 5,
    "has_next": true,
    "has_prev": false
  }
}
```

---

### Endpoint 2: [YOUR_VALUE_HERE: endpoint-name]

#### Definition

| Property | Value |
|----------|-------|
| **Method** | [GET/POST/PUT/PATCH/DELETE] |
| **Path** | `/[path]` |
| **Description** | [What this endpoint does] |
| **Authentication** | [Required/Optional/None] |
| **Rate Limit** | [requests per period] |

#### Request

**Path Parameters**:
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| [param] | [type] | Yes/No | [Description] | [Example] |

**Request Body**:
```json
{
  "field1": "[type] - [description]"
}
```

#### Response

**Success Response**:
```json
{
  "success": true,
  "data": {
    "...": "..."
  }
}
```

---

### Endpoint 3: [YOUR_VALUE_HERE: endpoint-name]

[OPTIONAL: Add more endpoints following the same pattern]

---

## 5. ERROR HANDLING

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "[ERROR_CODE]",
    "message": "[Human-readable message]",
    "details": [
      {
        "field": "[field name]",
        "message": "[field-specific error]"
      }
    ],
    "request_id": "[UUID for support reference]"
  }
}
```

### Error Codes

#### HTTP Status Codes

| Status | Meaning | When Used |
|--------|---------|-----------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST creating resource |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid request format or parameters |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Valid auth but insufficient permissions |
| 404 | Not Found | Resource does not exist |
| 409 | Conflict | Resource conflict (duplicate, state conflict) |
| 422 | Unprocessable Entity | Validation failed |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |
| 503 | Service Unavailable | Temporary unavailability |

#### Application Error Codes

| Code | HTTP Status | Description | Resolution |
|------|-------------|-------------|------------|
| [ERR_001] | 400 | [Description] | [How to fix] |
| [ERR_002] | 401 | [Description] | [How to fix] |
| [ERR_003] | 422 | [Description] | [How to fix] |
| [ERR_004] | 429 | [Description] | [How to fix] |

### Error Examples

**Validation Error (422)**:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Request validation failed",
    "details": [
      { "field": "email", "message": "Invalid email format" },
      { "field": "age", "message": "Must be at least 18" }
    ],
    "request_id": "req_abc123"
  }
}
```

**Authentication Error (401)**:
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired access token",
    "request_id": "req_def456"
  }
}
```

---

## 6. RATE LIMITING

### Rate Limit Configuration

| Tier | Requests/Minute | Requests/Hour | Burst |
|------|-----------------|---------------|-------|
| Free | 60 | 1,000 | 10 |
| Pro | 300 | 10,000 | 50 |
| Enterprise | 1,000 | 100,000 | 200 |

### Rate Limit Headers

| Header | Description | Example |
|--------|-------------|---------|
| X-RateLimit-Limit | Max requests in window | `100` |
| X-RateLimit-Remaining | Requests remaining | `95` |
| X-RateLimit-Reset | Unix timestamp when limit resets | `1640000000` |
| Retry-After | Seconds until retry allowed (when limited) | `60` |

### Rate Limit Exceeded Response (429)
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please retry after 60 seconds.",
    "retry_after": 60
  }
}
```

### Rate Limit Best Practices
- Implement exponential backoff on 429 responses
- Cache responses where appropriate
- Use webhooks instead of polling where available
- Monitor rate limit headers proactively

---

## 7. EXAMPLES

### Complete Workflow Example

**Step 1: Authenticate**
```bash
curl -X POST 'https://api.example.com/v1/auth/login' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "user@example.com",
    "password": "securepassword"
  }'
```

**Response**:
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbG...",
    "refresh_token": "dGhpcyBp...",
    "expires_in": 900
  }
}
```

**Step 2: [YOUR_VALUE_HERE: next action]**
```bash
curl -X [METHOD] 'https://api.example.com/v1/[path]' \
  -H 'Authorization: Bearer eyJhbG...' \
  -H 'Content-Type: application/json' \
  -d '{
    "...": "..."
  }'
```

**Step 3: [YOUR_VALUE_HERE: next action]**
```bash
[Example request]
```

---

### SDK Examples

#### JavaScript/Node.js
```javascript
const response = await fetch('https://api.example.com/v1/resource', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    field1: 'value1',
    field2: 'value2',
  }),
});

const data = await response.json();
```

#### Python
```python
import requests

response = requests.post(
    'https://api.example.com/v1/resource',
    headers={
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json',
    },
    json={
        'field1': 'value1',
        'field2': 'value2',
    }
)

data = response.json()
```

#### cURL
```bash
curl -X POST 'https://api.example.com/v1/resource' \
  -H 'Authorization: Bearer [token]' \
  -H 'Content-Type: application/json' \
  -d '{"field1":"value1","field2":"value2"}'
```

---

## 8. CHANGELOG

### Version History

| Version | Date | Changes | Breaking |
|---------|------|---------|----------|
| 1.0.0 | [DATE] | Initial release | N/A |
| 1.1.0 | [DATE] | Added [feature] | No |
| 2.0.0 | [DATE] | Changed [breaking change] | Yes |

### Deprecation Notices

| Deprecated | Replacement | Removal Date | Migration Guide |
|------------|-------------|--------------|-----------------|
| [old endpoint/field] | [new endpoint/field] | [DATE] | [Link] |

---

## WHEN TO USE THIS TEMPLATE

**Use api-contract.md when:**
- Defining new API endpoints
- Documenting existing APIs for consumers
- Contract-first API development
- API versioning and migration planning
- Integration documentation for partners

**Do NOT use when:**
- Internal function documentation (use code comments)
- Data schema only (use data-model.md)
- General technical research (use research.md)

**Related templates:**
- Use with data-model.md for complete backend documentation
- Reference from plan.md for implementation planning
- Store in contracts/ folder for multi-endpoint APIs

---

<!--
  API CONTRACT TEMPLATE - ENDPOINT SPECIFICATION
  - Complete endpoint definitions with request/response
  - Authentication and rate limiting documentation
  - Error handling standardization
  - Working examples for integration
-->
