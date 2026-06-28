---
title: "Open Design Guarded Proxy Contract"
description: "Deny-by-default precondition contract for Open Design calls that mutate state or feed a design decision."
trigger_phrases:
  - "open design guarded proxy"
  - "opendesigndesignprecondition"
  - "design proof token gate"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# Open Design Guarded Proxy Contract

This document defines a contract, not a running server. The guarded proxy is the agent-side boundary that every wired Open Design surface must traverse before a call can spawn an inner agent, fire a build, mutate project state, or provide Open Design content as design-decision input.

The contract is deny-by-default. Anything not positively recognized as pure transport is guarded.

## Boundary

Open Design exposes one daemon through interchangeable surfaces: MCP tools, HTTP routes, the `od` CLI, and in-app Skills. Per-surface checks drift too easily, so the guarded proxy sits at the shared agent-side adapter boundary, immediately before inner-agent spawn or build-fire and before any Open Design mutating verb is forwarded.

The boundary governs requests that pass through the agent-side adapter. It does not claim to alter the bundled daemon, patch the desktop app, or intercept calls that bypass the adapter.

## Canonical Request

Every surface adapter MUST normalize its request into this canonical shape before classification or execution:

| Field | Required | Meaning |
|---|---:|---|
| `surface` | yes | One of `mcp`, `http`, `cli`, or `skills`. |
| `toolOrVerb` | yes | Stable tool name, route verb, CLI command form, or Skills action. |
| `mutationClass` | yes | One of `read`, `mutating`, `destructive`, or `transport`. |
| `feedsDesignDecision` | yes | `true` when the response or request content will shape a UI, design system, visual artifact, prototype, motion, or build brief. |
| `target` | yes for guarded calls | Stable target surface, project, run, artifact, file, route, or output artifact identity. |
| `designProofToken` | conditional | Structured `DESIGN_PROOF_TOKEN` metadata supplied by the caller for guarded calls. |
| `payloadDigestInputs` | yes for guarded calls | Reconstructable inputs used by the token validator: subject, brief object, form-answer object, Open Design lineage object, and reachable loaded-file hashes. |
| `rawRequest` | yes | The original request payload, retained for forwarding only after the precondition allows it. |

Normalization MUST be lossless for `surface`, `toolOrVerb`, `mutationClass`, `feedsDesignDecision`, `target`, token metadata, and payload digest inputs. If any of those fields cannot be reconstructed unambiguously, the request is treated as guarded and denied unless a valid token can be checked against the real outgoing payload.

## Surface Mapping

| Surface | Adapter mapping |
|---|---|
| MCP | `surface: "mcp"`; `toolOrVerb` is the MCP tool name; `mutationClass` comes from the tool-surface policy; `target` comes from explicit project, run, file, artifact, or active-context target when permitted. |
| HTTP | `surface: "http"`; `toolOrVerb` is the canonical route method and path mapped to the equivalent MCP tool or CLI verb; `mutationClass` follows the mapped operation. |
| CLI | `surface: "cli"`; `toolOrVerb` is the normalized `od` command form; `mutationClass` follows the policy block command class. |
| Skills | `surface: "skills"`; `toolOrVerb` is the Skills action or message intent after it is mapped to a run, file, artifact, project, UI, automation, memory, plugin, daemon, diagnostic, media, or research operation. |

HTTP and Skills adapters MUST map to the same canonical operation classes as MCP and CLI. A route or message that cannot be mapped is not exempt transport; it is guarded.

## Classification

Classification uses two axes:

| Rule | Decision |
|---|---|
| `mutationClass` is `mutating` or `destructive` | Guarded. |
| `mutationClass` is `read` and `feedsDesignDecision` is `true` | Guarded. |
| `mutationClass` is `read` or `transport` and `feedsDesignDecision` is `false`, and the operation is listed in `exemptTransport` | Exempt. |
| Operation is missing from the policy block, ambiguous, or throws while classifying | Guarded. |

This mirrors the existing design gate: running Open Design generation is design work, and a read that feeds the design decision is also design work. Bare inventory, status, diagnostics, and non-design transport can pass without a design token.

## `openDesignDesignPrecondition`

`openDesignDesignPrecondition(canonicalRequest)` is invoked after normalization and classification but before forwarding the inner request.

For exempt transport requests, it returns `ALLOW` without requiring a token. It MUST NOT block legitimate pure-transport reads or status checks listed in the policy block.

For guarded requests, it MUST:

| Check | Requirement |
|---|---|
| Token presence | Reject when `designProofToken` is absent or not structured metadata. |
| Token validity | Delegate schema, freshness, replay, digest, file-hash, mode, and payload validation to the [`DESIGN_PROOF_TOKEN` contract](../../sk-design/references/design_proof_token.md). This contract does not redefine token internals. |
| Bound surface | Reject unless `designProofToken.boundSurface` matches the normalized `target` for the outgoing operation. |
| Payload binding | Validate the token against `payloadDigestInputs` rebuilt from the actual outgoing payload, not from prose or caller assertions. |
| Exception handling | Reject on validator exceptions, unreadable required inputs, stale replay state, malformed timestamps, ambiguous target binding, unmapped routes, or classifier failures. |

The result is binary:

```text
ALLOW: the request is exempt transport, or the guarded request has a valid token bound to the normalized target.
DENY: every other case.
```

The proxy MUST fail closed. Absence, ambiguity, stale token state, exceptions, or unmapped surfaces are denial conditions.

## Exemption Model

`exemptTransport` is a positive allowlist. These operations are allowed without `DESIGN_PROOF_TOKEN` only when `feedsDesignDecision` is `false`.

A listed read becomes guarded when its output is used to decide layout, visual language, component styling, content hierarchy, motion, prototype behavior, or a build brief. This prevents laundering design context through a nominally read-only operation while still allowing harmless transport, inventory, status, and polling.

## Policy

The policy is derived from the Open Design tool-surface reference.

```json
{
  "policyName": "open-design-guarded-proxy",
  "defaultDecision": "guarded",
  "surfaces": ["mcp", "http", "cli", "skills"],
  "guarded": {
    "mcpTools": [
      "create_artifact",
      "write_file",
      "create_project",
      "start_run",
      "cancel_run",
      "delete_file",
      "delete_project"
    ],
    "mcpReadToolsWhenFeedsDesignDecision": [
      "list_projects",
      "get_active_context",
      "get_artifact",
      "get_project",
      "get_file",
      "search_files",
      "list_files",
      "list_skills",
      "list_plugins",
      "list_agents",
      "get_run"
    ],
    "cliVerbs": [
      "od artifacts create",
      "od files write",
      "od media generate",
      "od research search",
      "od automation create",
      "od automation run",
      "od ui respond",
      "od ui revoke",
      "od ui prefill",
      "od memory tree edit",
      "od memory tree move",
      "od plugin install",
      "od diagnostics export",
      "od daemon start",
      "od project create",
      "od plugin publish",
      "od plugin login",
      "od plugin trust",
      "od daemon stop",
      "od db vacuum",
      "od connector execute",
      "od desktop import",
      "od auth internals"
    ],
    "httpRoutes": "Map method and path to the equivalent MCP tool or CLI verb; guard when the mapped operation is guarded, when feedsDesignDecision is true, or when mapping fails.",
    "skillsActions": "Map message intent to the equivalent run, artifact, file, project, UI, automation, memory, plugin, daemon, diagnostic, media, research, connector, import, or auth operation; guard when the mapped operation is guarded, when feedsDesignDecision is true, or when mapping fails."
  },
  "exemptTransport": {
    "requiresFeedsDesignDecisionFalse": true,
    "mcpTools": [
      "list_projects",
      "get_active_context",
      "get_artifact",
      "get_project",
      "get_file",
      "search_files",
      "list_files",
      "list_skills",
      "list_plugins",
      "list_agents",
      "get_run"
    ],
    "cliVerbs": [
      "od tools design-systems read",
      "od files list",
      "od files read",
      "od skills list",
      "od design-systems list",
      "od doctor",
      "od daemon status",
      "od automation list",
      "od automation view",
      "od automation show",
      "od memory tree list",
      "od memory tree view",
      "od memory tree show",
      "od ui list",
      "od ui view",
      "od ui show"
    ],
    "httpRoutes": "Map method and path to the equivalent exempt MCP tool or CLI verb; exempt only when feedsDesignDecision is false and mapping succeeds.",
    "skillsActions": "Map message intent to inventory, status, polling, list, view, show, or read-only transport; exempt only when feedsDesignDecision is false and mapping succeeds."
  }
}
```

Anything omitted from `exemptTransport` is guarded. A new Open Design tool, route, command, or Skills action starts guarded until the tool-surface reference classifies it and this policy is updated.

## Named Residual

The bundled Open Design daemon ships inside the Mac app and is not modified by this contract. A raw HTTP-port call, or an in-app Skills-UI message, that reaches the daemon without traversing the agent-side adapter cannot be forced through this proxy.

That daemon-side bypass is out of scope for this contract. The honest boundary is agent-side enforcement across wired adapters, with the daemon residual named rather than implied away.

## Acceptance

The contract is acceptable when all of these are true:

| Scenario | Expected result |
|---|---|
| A guarded MCP, HTTP, CLI, or Skills request arrives without a fresh valid `DESIGN_PROOF_TOKEN` bound to the normalized target. | `DENY` before inner-agent spawn, build-fire, or mutation. |
| A listed pure-transport operation arrives with `feedsDesignDecision: false`. | `ALLOW` without requiring a token. |
| A caller reaches the bundled daemon without traversing the agent-side adapter. | Not enforceable by this proxy; the daemon residual is explicitly out of scope. |
