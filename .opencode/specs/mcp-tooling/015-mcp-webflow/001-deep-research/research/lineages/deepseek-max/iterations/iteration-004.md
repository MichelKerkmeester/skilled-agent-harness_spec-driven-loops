# Iteration 4: Permission scopes and non-production test target

## Focus

Resolve Q4 (non-production workspace/site for live smoke) using the official scope model and publish semantics, plus the safest token shapes.

## Findings

1. **Site-level scope model** (site tokens and Data Client apps): `assets:read/write`, `authorized_user:read`, `cms:read/write`, `comments:read/write`, `components:read/write`, `custom_code:read/write`, `ecommerce:read/write`, `forms:read/write`, `pages:read/write`, `sites:read/write`, `site_activity:read`, `site_config:read/write`, `users:read/write`, `webhooks` (per trigger type), `workspace:read/write`. `custom_code` scopes are available **only to Data Client apps — site tokens cannot access custom code endpoints**. [SOURCE: https://developers.webflow.com/data/v2.0.0/reference/scopes.md]
2. **Workspace tokens are endpoint-limited**: no `site` scope → cannot hit site-specific endpoints (e.g., Get Site); docs position them for read-only monitoring/auditing. [SOURCE: https://developers.webflow.com/data/v2.0.0/reference/authentication/workspace-token.md]
3. **Publish semantics**: `POST /sites/{site_id}/publish` requires `sites:write`; request body must include `customDomains` OR `publishToWebflowSubdomain` (the `*.webflow.io` staging subdomain). "If multiple individual pages are published to staging, publishing from staging to production publishes all staged changes." Rate limit: one successful publish queue per minute. Individual pages can be published via `pageId` — a smoke can publish a single page, not the whole site. [SOURCE: https://developers.webflow.com/data/v2.0.0/reference/sites/publish.md]
4. **Token best practice (official)**: minimal scopes; mint a new token when new scopes are needed. [SOURCE: https://developers.webflow.com/data/v2.0.0/reference/authentication/site-token.md]
5. **No staging-environment API found**: the Data API surface exposes staging only through the publish target (`publishToWebflowSubdomain`); no site-duplication or backup/restore endpoints appear in the documented scopes/endpoint index. API-level site backup/restore is not part of the Data API v2 surface. [SOURCE: https://developers.webflow.com/data/v2.0.0/reference/scopes.md; inference from sitemap scan — no duplication/backup endpoints]

## Sources Consulted

- [SOURCE: https://developers.webflow.com/data/v2.0.0/reference/scopes.md]
- [SOURCE: https://developers.webflow.com/data/v2.0.0/reference/authentication/site-token.md]
- [SOURCE: https://developers.webflow.com/data/v2.0.0/reference/authentication/workspace-token.md]
- [SOURCE: https://developers.webflow.com/data/v2.0.0/reference/sites/publish.md]

## Assessment

- **newInfoRatio: 0.55** — Scope table and publish-to-staging semantics are new; token kinds were known from iteration 3.
- Confidence: high on scopes/publish (official reference); Q4 answer is a recommendation grounded in those facts.

## Reflection

- What worked: scopes reference is the definitive permission map; publish reference names the staging subdomain explicitly.
- What failed: no staging-environments doc exists in the Data API docs; guessed URLs 404'd.
- Ruled out: workspace token as a general write credential (no site scope); API-based site duplication for test scaffolding (not in the API).

## Recommended Next Focus

Q4 recommendation: a dedicated test workspace + dedicated test site (free Starter plan suffices) with a site token carrying only read scopes for the smoke baseline (`cms:read`, `pages:read`, `sites:read`, `assets:read`, `components:read`, `forms:read`, `authorized_user:read`), escalating to `sites:write` only for a staging-only publish (`publishToWebflowSubdomain`, single page, 1/min limit). Next: classify Q3/Q5/Q6 and produce the integration recommendation.
