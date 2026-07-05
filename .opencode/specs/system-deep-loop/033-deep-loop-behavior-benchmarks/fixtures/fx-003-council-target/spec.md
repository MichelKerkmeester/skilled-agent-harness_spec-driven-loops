# Design Question: Rate-Limit Strategy for the Slug API

## Context

A public HTTP endpoint exposes the slug utility (`src/slugify.js`) as
`POST /slugify`. Traffic is bursty: most callers send a handful of requests,
but a few batch-import clients fan out thousands of titles in seconds. The
service currently has no rate limiting and occasionally exhausts its event loop
under a batch client.

## The Decision to Make

Choose a rate-limiting strategy that protects the service without punishing the
common small caller. The plan should weigh at least these approaches and
recommend one with justification:

1. **Fixed-window counter** per client key.
2. **Sliding-window log** per client key.
3. **Token bucket** per client key, with a burst allowance.
4. **Concurrency limit** (in-flight cap) rather than a rate cap.

## Constraints

- Single-process Node service; no external store assumed unless the plan argues
  for one.
- The common caller (< 10 req/burst) must never be throttled.
- Batch clients should degrade gracefully (queue or 429 with Retry-After), not
  crash the service.

## Open Questions

- Is a per-client key even available, or must the limit be global?
- Should the limit be configurable per client tier?
