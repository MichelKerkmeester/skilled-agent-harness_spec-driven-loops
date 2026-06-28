---
title: "Open Design Guarded Proxy Contract"
description: "Deny-by-default precondition contract for Open Design calls that mutate state, feed a design decision, or omit a positive purpose."
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

The contract is deny-by-default. Anything not positively recognized as pure transport for a positive purpose is guarded. The controlling invariant is "unknown ⇒ guarded": unknown tool AND unknown purpose both deny without a token.

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
| `openDesignPurpose` | yes | Required positive purpose. Exactly `openDesignExemption` for pure transport that forbids any later design use of the artifact, or `skDesignGate` for design-authorized calls that require a valid token. Missing, unknown, or any other value maps to `unclassified`. |
| `target` | yes for guarded calls | Stable target surface, project, run, artifact, file, route, or output artifact identity. |
| `designProofToken` | conditional | Structured `DESIGN_PROOF_TOKEN` metadata supplied by the caller for guarded calls. |
| `payloadDigestInputs` | yes for guarded calls | Reconstructable inputs used by the token validator: subject, brief object, form-answer object, Open Design lineage object, and reachable loaded-file hashes. |
| `rawRequest` | yes | The original request payload, retained for forwarding only after the precondition allows it. |

Normalization MUST be lossless for `surface`, `toolOrVerb`, `mutationClass`, `openDesignPurpose`, `target`, token metadata, and payload digest inputs. If any of those fields cannot be reconstructed unambiguously, the request is treated as guarded and denied unless a valid token can be checked against the real outgoing payload.

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
| `openDesignPurpose` is `skDesignGate` | Guarded; requires a valid `DESIGN_PROOF_TOKEN`. |
| `mutationClass` is `read` or `transport`, `openDesignPurpose` is `openDesignExemption`, and the operation is listed in `exemptTransport` | Exempt. |
| `openDesignPurpose` is missing, unknown, any value other than `openDesignExemption` or `skDesignGate`, or cannot be reconstructed | Guarded. |
| Operation is missing from the policy block, ambiguous, not listed in `exemptTransport`, or throws while classifying | Guarded. |

This mirrors the design gate without relying on a caller boolean. Running Open Design generation is design work, and a read that feeds the design decision is also design work. Bare inventory, status, diagnostics, and non-design transport can pass without a design token only when the caller positively asserts `openDesignExemption`.

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

The `od` CLI design-mutating Bash surface is enforced by the codex PreToolUse hook's `od` CLI lane; that Bash lane is enforced at the hook, not by this proxy.

## Exemption Model

`exemptTransport` is a positive allowlist. These operations are allowed without `DESIGN_PROOF_TOKEN` only when the caller supplies `openDesignPurpose: "openDesignExemption"` and the operation is listed in the allowlist. Either condition missing means guarded.

A listed read becomes guarded when its output is used to decide layout, visual language, component styling, content hierarchy, motion, prototype behavior, or a build brief. A caller that asserts `openDesignExemption` also asserts that the returned artifact will not later be used as design-decision input. This prevents laundering design context through a nominally read-only operation while still allowing harmless transport, inventory, status, and polling.

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
    "mcpReadToolsWhenPurposeRequiresToken": [
      "get_active_context",
      "get_artifact",
      "get_project",
      "get_file",
      "search_files",
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
    "httpRoutes": "Map method and path to the equivalent MCP tool or CLI verb; guard when the mapped operation is guarded, when openDesignPurpose is skDesignGate or unclassified, or when mapping fails.",
    "skillsActions": "Map message intent to the equivalent run, artifact, file, project, UI, automation, memory, plugin, daemon, diagnostic, media, research, connector, import, or auth operation; guard when the mapped operation is guarded, when openDesignPurpose is skDesignGate or unclassified, or when mapping fails."
  },
  "exemptTransport": {
    "requiresOpenDesignPurpose": "openDesignExemption",
    "forbidsLaterDesignUse": true,
    "mcpTools": [
      "list_projects",
      "list_files",
      "list_skills",
      "list_plugins",
      "list_agents"
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
    "httpRoutes": "Map method and path to the equivalent exempt MCP tool or CLI verb; exempt only when openDesignPurpose is openDesignExemption and mapping succeeds.",
    "skillsActions": "Map message intent to inventory, status, polling, list, view, show, or read-only transport; exempt only when openDesignPurpose is openDesignExemption and mapping succeeds."
  }
}
```

Anything omitted from `exemptTransport` is guarded. A new Open Design tool, route, command, or Skills action starts guarded until the tool-surface reference classifies it and this policy is updated. Missing, unknown, or any other `openDesignPurpose` starts as `unclassified` and is guarded. The policy is deny-by-default on both axes: unknown operation and unknown purpose.

## Named Residual

The bundled Open Design daemon ships inside the Mac app and is not modified by this contract. A raw HTTP-port call, or an in-app Skills-UI message, that reaches the daemon without traversing the agent-side adapter cannot be forced through this proxy.

That daemon-side bypass is out of scope for this contract. The honest boundary is agent-side enforcement across wired adapters, with the daemon residual named rather than implied away.

Any PreToolUse hook, policy file, adapter, or caller still reading a `feedsDesignDecision` boolean instead of required `openDesignPurpose` speaks the old contract. That consumer can still misclassify omission as non-design until it is migrated.

## Acceptance

The contract is acceptable when all of these are true:

| Scenario | Expected result |
|---|---|
| A guarded MCP, HTTP, CLI, or Skills request arrives without a fresh valid `DESIGN_PROOF_TOKEN` bound to the normalized target. | `DENY` before inner-agent spawn, build-fire, or mutation. |
| A listed pure-transport operation arrives with `openDesignPurpose: "openDesignExemption"`. | `ALLOW` without requiring a token. |
| A caller omits `openDesignPurpose` or supplies an unknown purpose. | `DENY` for design; the purpose is `unclassified`, and unknown ⇒ guarded. |
| A new or unknown design-affecting tool is absent from `exemptTransport`. | `DENY` without a token; unknown ⇒ guarded. |
| A caller reaches the bundled daemon without traversing the agent-side adapter. | Not enforceable by this proxy; the daemon residual is explicitly out of scope. |
