<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Phase 1 — Versioned catalog authority and fail-closed submission

## Summary

This phase establishes a bounded, session-scoped command catalog contract and the revision-checked slash submission boundary. It preserves the existing `+` browser and ordinary prompt flow while making the relay and protocol the sole authority for command availability.

## Problem & Goal

The host command catalog and slash-aware submission path need explicit identity and revision bindings before client discovery or execution can safely depend on them. The goal is to make the real host catalog explicit, bounded, session-scoped, and revision-checked while retaining current `+` and ordinary prompt behavior.

## Scope

### In scope

- Evolve `CommandCatalogDto` to carry host epoch, session identity, session revision, and catalog revision.
- Preserve only authoritative descriptor fields, with aliases and argument hints available only as opt-in protocol fields.
- Keep `/api/commands/list` authenticated, read-only, and relay-filtered.
- Revalidate slash-command submission against the current effective catalog before Pi forwarding, using one-use tickets and expected identity/revision values.
- Preserve ordinary prompt submission behavior and current UI compatibility until the inline surface is enabled.

### Out of scope

- The inline autocomplete surface, client-side catalog lifecycle, ranking, trigger parsing, or insertion reducer.
- A client-owned or hardcoded fallback catalog, TUI-only built-ins, command authoring, or new mutation actions.
- Changes to the ink-on-parchment design system, typography, light/dark themes, WCAG AA target, PWA architecture, or host/extension-enforced plan mode.

## User-facing behavior + states

N/A — internal authority and protocol phase. Existing `+` discovery and ordinary prompt submission remain usable and visually compatible; this phase does not enable the inline surface.

## Acceptance criteria

- A real Pi `get_commands` response becomes one bounded, path-free, relay-filtered catalog with explicit host/session/catalog identity.
- A malformed, incompatible, cross-session, or stale catalog is rejected without rendering partial rows.
- Existing `+` insertion and ordinary prompt submission continue to pass their current tests.
- A slash-aware submission with a changed host, session, or catalog revision is rejected before any Pi RPC, with no automatic retry.
- A valid explicit submission consumes exactly one ticket and forwards exactly one revision-checked prompt.
- Security review signs off before merge because this phase changes protocol data, redaction, ticket consumption, prompt forwarding, and host/extension policy enforcement.

## Security & Redaction

The catalog remains an authenticated read of the relay’s allowlisted `get_commands` projection. `redaction.ts` emits only bounded approved fields and removes paths, filenames, prompt bodies, source locations, secrets, raw host errors, unsafe names, and unknown nested data. The relay rejects privileged, path-like, control, or bidi-override names and does not create a fallback catalog. Slash Send consumes one fresh one-use ticket, checks the authenticated principal and current host/session/catalog revisions, and fails closed before Pi forwarding on any mismatch. Confirmation metadata remains informational, while existing approval, mutation, plan-mode, and host/extension policy boundaries remain authoritative.

## Dependencies & affected areas

| Area | Files/components | Phase responsibility |
|---|---|---|
| Protocol | `packages/pi-rpc-protocol/src/types.ts`, `packages/pi-rpc-protocol/src/guards.ts`, `packages/pi-rpc-protocol/src/index.ts` | Versioned catalog identity, selected binding, slash-aware expected-revision submission shape, strict guards, and exports. |
| Protocol tests | `packages/pi-rpc-protocol/tests/guards.test.ts` | Valid, malformed, cross-session, unknown-field, control-character, bidi-override, oversized, and stale-shape fixtures. |
| Relay authority | `apps/pi-remote-relay/src/store/redaction.ts`, `apps/pi-remote-relay/src/commands/command-service.ts`, `apps/pi-remote-relay/src/http/server.ts`, `apps/pi-remote-relay/src/prompt/prompt-service.ts`, `apps/pi-remote-relay/src/auth/policy.ts`, `apps/pi-remote-relay/src/index.ts` | Safe projection, catalog lifecycle, authenticated endpoint, one-use ticket/revision gate, separate authorization, and host/session wiring. |
| Relay tests | `apps/pi-remote-relay/tests/commands.test.ts`, `apps/pi-remote-relay/tests/prompt.test.ts`, `apps/pi-remote-relay/tests/security/negative-controls.test.ts`, relevant HTTP/integration fixtures | Redaction, filtering, races, ticket use, compatibility, and zero-Pi-call failure paths. |
| Web transport | `apps/pi-remote-web/src/relay.ts` | Parse the versioned catalog and slash-submit responses through protocol guards while retaining ordinary `submitPrompt`. |

