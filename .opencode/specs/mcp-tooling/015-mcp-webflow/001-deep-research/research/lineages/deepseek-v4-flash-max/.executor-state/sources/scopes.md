> For clean Markdown of any page, append .md to the page URL.
> For a complete documentation index, see https://developers.webflow.com/llms.txt.
> For AI client integration (Claude Code, Cursor, etc.), connect to the MCP server at https://developers.webflow.com/_mcp/server.

# Scopes

## Available scopes

Available scopes are determined by the type of token you're creating. For [Data Client apps](/data/reference/oauth-app) and [site tokens](/data/reference/site-token), refer to the site-level scopes. For [workspace tokens](/data/reference/authentication/workspace-token), refer to the workspace-level scopes.

#### Site-level

| Resource           | Scopes                                  | Endpoints                                                                     |
| :----------------- | :-------------------------------------- | :---------------------------------------------------------------------------- |
| Assets             | `assets:read`, `assets:write`           | → [API Docs](/data/reference/assets/assets/list)                              |
| Authorized User    | `authorized_user:read`                  | → [API Docs](/data/reference/token/authorized-by)                             |
| Authorization info | None required                           | → [API Docs](/data/reference/token/introspect)                                |
| CMS                | `cms:read`, `cms:write`                 | → [API Docs](/data/reference/cms/collections/list)                            |
| Comments           | `comments:read`, `comments:write`       | → [API Docs](/data/reference/comments/list-comment-threads)                   |
| Components         | `components:read`, `components:write`   | → [API Docs](/data/reference/pages-and-components/components/list)            |
| Custom Code        | `custom_code:read`, `custom_code:write` | → [API Docs](/data/reference/custom-code/custom-code/list)                    |
| Ecommerce          | `ecommerce:read`, `ecommerce:write`     | → [API Docs](/data/reference/ecommerce/products/list)                         |
| Forms              | `forms:read`, `forms:write`             | → [API Docs](/data/reference/forms/list)                                      |
| Pages              | `pages:read`, `pages:write`             | → [API Docs](/data/reference/pages-and-components/pages/list)                 |
| Sites              | `sites:read`, `sites:write`             | → [API Docs](/data/reference/sites/list)                                      |
| Site Activity      | `site_activity:read`                    | → [API Docs](/data/reference/enterprise/site-activity/list)                   |
| Site Configuration | `site_config:read`, `site_config:write` | → [API Docs](/data/reference/enterprise/site-configuration/url-redirects/get) |
| Users              | `users:read`, `users:write`             | → API Docs                                                                    |
| Webhooks           | Depends on `trigger_type`               | → [API Docs](/data/reference/webhooks/list)                                   |
| Workspace          | `workspace:read`, `workspace:write`     | → [API Docs](/data/reference/enterprise/workspace-management/create)          |

The `custom_code:read` and `custom_code:write` scopes are available only to [Data Client apps](/data/reference/oauth-app). Site tokens cannot access custom code endpoints.

#### Workspace-level

| Resource           | Scopes                    | Endpoints                                                         |
| :----------------- | :------------------------ | :---------------------------------------------------------------- |
| Workspace Activity | `workspace_activity:read` | → [API Docs](/data/reference/enterprise/workspace-audit-logs/get) |

#### Quick tip: Finding required scopes

Each API endpoint lists its required scopes in the description. When planning your integration, check the endpoints you'll use to determine which scopes to request.

## Understanding scopes

Scopes are permissions that control what data your app can access. Think of them like permissions on your phone - an app might request access to your camera, photos, or contacts. In Webflow's API:

* Each scope gives access to specific [resources](/data/reference/structure-1)
* Scopes usually come in pairs: `:read` for viewing data, `:write` for modifying data
* Users will see and approve these permissions when connecting to your app

#### Best practice

Only request scopes your app actually needs. Requesting unnecessary scopes can make users hesitant to approve your app.

## Adding scopes

When creating a Data Client App or an API token, you'll first register your required scopes:

#### Data Client App

During [app registration](/data/docs/register-an-app), select the scopes that match your app's required functionality. These scopes define what data your app can access.

<img src="https://fdr-prod-docs-files-public.s3.us-east-1.amazonaws.com/https%3A//webflow.docs.buildwithfern.com/35db7e8252baa175397b1e7569bda4ead5ab50d15ac0be3c42d512d529a72719/assets/images/28e0ad2-Large_GIF_1064x696.gif?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA6KXJSKKNFOCF7G4B%2F20260802%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260802T164116Z&X-Amz-Expires=604800&X-Amz-Signature=238679cece219364a886a2c7588f4a47c9790e5cd365fcb9cd6771d8a955b5e1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject" alt="Scope Registration" />

#### Using scopes in OAuth

After registration, you'll use these same scopes in your [Authorization URL](/data/reference/oauth-app#constructing-the-authorization-link) during the OAuth flow. This shows users an authorization page where they can review and approve your requested permissions.

See our [authorization guide](/data/reference/oauth-app) for step-by-step OAuth implementation.

#### API Token

When creating a [site](/data/reference/site-token) or [workspace](/data/reference/authentication/workspace-token) token, select the scopes that match your integration's required functionality. These scopes define what data your token can access.

<img src="https://fdr-prod-docs-files-public.s3.us-east-1.amazonaws.com/https%3A//webflow.docs.buildwithfern.com/4214985a35cb0f9fa2cc64b81aad2086bb4138a0312c47a1cb2cd9f242281969/products/data/pages/Data%20API/rest-introduction/assets/scopes.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA6KXJSKKNFOCF7G4B%2F20260802%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260802T164116Z&X-Amz-Expires=604800&X-Amz-Signature=cb87c4374a5ae3a3840e8fc65a39c340190dbf7a025a75f56cb4fe315d778649&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject" alt="Scope Registration" />