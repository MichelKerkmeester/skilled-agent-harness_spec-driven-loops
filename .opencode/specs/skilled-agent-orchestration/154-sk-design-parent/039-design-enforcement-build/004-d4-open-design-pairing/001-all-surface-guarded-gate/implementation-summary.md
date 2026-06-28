---
title: "Implementation Summary: All-surface guarded proxy + openDesignDesignPrecondition contract"
description: "Post-build record for the new mcp-open-design guarded-proxy contract reference: the canonical request normalizer, the deny-by-default precondition, the embedded tool policy, the honestly named daemon-side residual, and that it is contract documentation not yet wired into a running proxy."
trigger_phrases:
  - "guarded proxy implementation summary"
  - "opendesigndesignprecondition summary"
  - "all-surface gate build record"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/004-d4-open-design-pairing/001-all-surface-guarded-gate"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Author the phase build record and mark the guarded proxy checklist verified"
    next_safe_action: "Let the parent process refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-open-design/references/guarded_proxy.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-all-surface-guarded-gate |
| **Completed** | 2026-06-28 |
| **Level** | 2 |
| **Deliverable** | `.opencode/skills/mcp-open-design/references/guarded_proxy.md` (212 lines) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

This phase delivered the guarded-proxy CONTRACT for Open Design: the single agent-side boundary every wired surface must traverse before a call can spawn an inner agent, fire a build, mutate project state, or feed an Open Design response into a design decision. One daemon backs four interchangeable surfaces (MCP, HTTP, the `od` CLI, in-app Skills), so the contract converges them at the run/build chokepoint instead of trusting four divergent per-surface hooks. It is a contract, not a running server, and it is deny-by-default: anything not positively recognized as pure transport is guarded.

The reference carries four load-bearing parts:

1. **Request-normalization contract.** Every surface adapter maps its request into one canonical shape (`surface`, `toolOrVerb`, `mutationClass`, `feedsDesignDecision`, `target`, `designProofToken`, `payloadDigestInputs`, `rawRequest`), lossless on the security-relevant fields. A field that cannot be reconstructed unambiguously is treated as guarded.
2. **`openDesignDesignPrecondition`.** The deny-by-default validator runs after normalization and classification. For guarded requests it delegates token validity (schema, freshness, replay, digest, file-hash, mode) to the `DESIGN_PROOF_TOKEN` contract, adds a `boundSurface` match against the normalized target, validates the token against payload digests rebuilt from the actual outgoing payload, and fails closed on any gap. The result is binary: `ALLOW` or `DENY`.
3. **Embedded tool policy.** A parseable JSON policy block enumerates the guarded tool sets and a positive `exemptTransport` allowlist, with `defaultDecision: "guarded"`. Anything omitted, or any new tool, route, command, or Skills action, starts guarded until the tool-surface reference classifies it.
4. **Named residual.** The bundled daemon ships unmodifiable inside the Mac app, so a raw-HTTP-port call or in-app Skills-UI message that reaches the daemon without traversing the agent-side adapter cannot be forced through this proxy. The contract names that bypass as out of scope rather than implying it away.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/mcp-open-design/references/guarded_proxy.md` | Created | Guarded-proxy boundary contract: canonical request normalizer, two-axis classifier, `openDesignDesignPrecondition`, embedded JSON tool policy, and the named daemon-side residual |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementer authored one new reference file and verified it in place. The nine sections were read back against the three acceptance scenarios: a guarded call without a fresh valid token denies on every wired surface; a listed pure-transport call with `feedsDesignDecision: false` passes without a token; and a caller that reaches the bundled daemon without the agent-side adapter is named as the out-of-scope residual. The embedded JSON policy block was parsed with `jq` and exits clean. An evergreen scan over the document body found no spec, packet, or phase identifiers and no `specs/` paths. A scope check confirmed the change set is limited to the one new file, with no live `mcp-open-design`, `sk-design`, or `SKILL.md` file touched; the optional SKILL.md cross-link was deferred to hold scope. This is contract documentation; no runtime proxy, token minter, or validator ships in this phase.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Converge all four surfaces at the agent-side run/build chokepoint | One daemon backs four interchangeable surfaces, so a single shared boundary beats four divergent per-surface hooks |
| Make the contract deny-by-default with a positive exemption allowlist | An unlisted or unmapped tool stays guarded, which closes the laundering path that a negative blocklist would leave open |
| Delegate token validity to the `DESIGN_PROOF_TOKEN` contract | The precondition checks presence, binding, and freshness without redefining or weakening the token internals |
| Bind the token to `boundSurface` and rebuild digests from the real payload | Defends against cross-surface replay and against laundering design context through a degraded canonical shape |
| Name the daemon-side residual instead of overclaiming coverage | The bundled daemon is unmodifiable, so honest agent-side enforcement is the real boundary and the bypass is stated, not hidden |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Deliverable exists at the target path | PASS, `.opencode/skills/mcp-open-design/references/guarded_proxy.md` (212 lines) |
| Canonical request shape lossless on security fields | PASS, Canonical Request table carries surface, tool, mutationClass, feedsDesignDecision, target, token, and payload digest inputs |
| `openDesignDesignPrecondition` is deny-by-default and fail-closed | PASS, precondition denies on absence, ambiguity, stale state, exceptions, and unmapped surfaces |
| Token validity delegated, not redefined | PASS, Token-validity row references `design_proof_token.md` with no duplicated rules |
| ACCEPTANCE: guarded call without token denied on every wired surface | PASS, Acceptance scenario 1 + per-surface adapter mapping |
| ACCEPTANCE: listed pure-transport call passes | PASS, Acceptance scenario 2 with `feedsDesignDecision: false` |
| ACCEPTANCE: daemon-side residual named as out of scope | PASS, Named Residual section names raw-HTTP-port + in-app Skills-UI bypass |
| Deny-by-default holds for unlisted tools | PASS, policy `defaultDecision: "guarded"`; omitted ops are guarded |
| Embedded JSON policy parses | PASS, `jq` over the fenced block exits 0 |
| Evergreen scan (no spec/packet/phase IDs in body) | PASS, no identifiers or `specs/` paths found |
| Scope clean (one new file, no live target edited) | PASS, change set limited to the new reference; SKILL.md untouched |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Daemon-side bypass is a named residual, not closed.** A raw HTTP-port call or in-app Skills-UI message that reaches the bundled daemon without traversing the agent-side adapter cannot be forced through this proxy, because the daemon ships unmodifiable in the Mac app. This is stated in the contract, not implied away. The executable pre-tool-use branch and any downstream enforcement still depend on this contract for the surfaces they cover, and they likewise cannot fully close the daemon-side gap.
2. **Contract only, not yet wired.** This phase defines the boundary, the canonical request, the precondition, and the tool policy. No running proxy, token minter, or validator is built here; the executable enforcement branch consumes this contract in a later phase.

<!-- /ANCHOR:limitations -->

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY
- Core + Level 2 verification focus
- Contract documentation for the Open Design guarded-proxy boundary
- Named residual: the daemon-side bypass is out of scope and stated honestly
-->
