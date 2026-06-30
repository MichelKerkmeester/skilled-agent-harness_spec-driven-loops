---
title: "Implementation Plan: Invert Open Design exemption to deny-by-default positive purpose"
description: "planning. Replace the caller-supplied feeds_design_decision boolean default with a required openDesignPurpose; missing maps to unclassified and is denied for design."
trigger_phrases:
  - "open design exemption inversion plan"
  - "deny by default positive purpose"
  - "opendesignpurpose unclassified guarded"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/004-d4-open-design-pairing/008-positive-exemption-inversion"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark all plan phases complete and align the Level 2 plan anchors"
    next_safe_action: "Let the parent refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-open-design/references/guarded_proxy.md"
      - ".opencode/skills/mcp-open-design/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Invert Open Design exemption to deny-by-default positive purpose

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Artifact type** | Prose policy / contract (Markdown skill references, not running code) |
| **Authoritative target** | `.opencode/skills/mcp-open-design/references/guarded_proxy.md` (Canonical Request, Classification, Exemption Model, Policy JSON) |
| **Co-targets** | `.opencode/skills/mcp-open-design/SKILL.md` (the `feeds_design_decision=False` gate default) + `.opencode/skills/mcp-open-design/references/tool_surface.md` (surface/gate/omit policy alignment) |
| **Verification** | Manual contract read-through against the acceptance scenarios; allowlist non-regression; evergreen check (no embedded IDs/paths) |

### Overview
The guarded proxy is already deny-by-default at the proxy level: the policy block sets `defaultDecision: "guarded"`, `exemptTransport` is a positive allowlist, and "anything omitted from `exemptTransport` is guarded." The remaining allow-by-default leak is the **design-influence axis**: the gate is driven by a caller-supplied boolean (`feeds_design_decision` in the skill gate, normalized to `feedsDesignDecision` at the proxy) that defaults to `False`. A caller who omits the flag is silently treated as non-design and routed onto the exempt path.

This plan inverts that axis. It replaces the boolean-with-a-false-default with a **required** `openDesignPurpose` field taking two positive values — `openDesignExemption` (pure transport; forbids any later design use of the same artifact) and `skDesignGate` (design-authorized; requires a valid token). A missing or unknown purpose maps to `unclassified`, which is **denied for design**. The controlling invariant is stated explicitly in the contract: **"unknown ⇒ guarded"** — an unknown tool (not on the allowlist) and an unknown purpose (no positive `openDesignExemption`) both deny without a token.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Current policy stance confirmed by reading `guarded_proxy.md` (deny-by-default at proxy; boolean axis is the residue) — Done: `defaultDecision: "guarded"`, `exemptTransport` is a positive allowlist
- [x] The boolean default site located in `SKILL.md` (`route_open_design_resources(..., feeds_design_decision=False)` and `design_gate(intents, feeds_design_decision)`) — Done: both signatures located and replaced
- [x] Two positive purpose values and the `unclassified` deny-state agreed (`openDesignExemption` / `skDesignGate` / `unclassified`) — Done
- [x] Allowlist carve-out (the legitimate pure-transport ops that MUST stay allowed) enumerated from the existing `exemptTransport` block — Done: MCP list ops + read-only CLI verbs

### Definition of Done
- [x] Policy is deny-by-default AND the design-influence axis requires a positive `openDesignPurpose` (no boolean default) — Done: boolean removed, 0 refs
- [x] A missing/unknown purpose maps to `unclassified` → DENIED for design — Done: `classify_open_design_purpose` + gate raise
- [x] A new/unknown design-affecting tool is GUARDED (deny without token), not exempt — Done: Classification "unknown ⇒ guarded"
- [x] The explicit `exemptTransport` ops remain ALLOWED (no new token requirement) — Done: allowlist preserved verbatim
- [x] The "unknown ⇒ guarded" invariant is documented as the controlling rule — Done: intro + Policy + Acceptance
- [x] Old-contract consumers named in the residual section; policy-doc edits carry no spec/finding IDs or ephemeral paths — Done: Named Residual + evergreen clean

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Positive-allowlist, deny-by-default precondition. Exemption is the explicitly-asserted exception; everything unasserted is guarded.

### Key Components
- **`openDesignPurpose` (required, positive)**: caller-supplied, two values — `openDesignExemption` (transport) and `skDesignGate` (design-authorized). Replaces the boolean `feeds_design_decision`.
- **`unclassified` (deny-state)**: the mapped value for missing/unknown/any-other purpose; can never feed a design decision.
- **`exemptTransport` allowlist (unchanged carve-out)**: the closed set of pure-transport read-only ops that pass without a token — now gated on a positive `openDesignExemption` rather than an omitted boolean.
- **Controlling invariant**: "unknown ⇒ guarded", documented in `guarded_proxy.md`.

### Data Flow
1. Adapter normalizes the request and reads `openDesignPurpose`.
2. `openDesignPurpose = skDesignGate` → guarded path → requires a valid `DESIGN_PROOF_TOKEN` bound to the target.
3. `openDesignPurpose = openDesignExemption` → allowed only if the op is on the `exemptTransport` allowlist; forbids any later design use of the same artifact.
4. `openDesignPurpose` missing/unknown → `unclassified` → DENIED for design (treated as guarded for any design-affecting op).
5. Op not on the allowlist → guarded regardless of purpose ("unknown ⇒ guarded").

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Establish the positive-purpose contract
- [x] Define `openDesignPurpose` (two positive values + `unclassified` deny-state) in the contract — Done: Canonical Request field + `OPEN_DESIGN_PURPOSES`
- [x] Remove the boolean default from the `SKILL.md` gate signature; require the positive purpose — Done: 0 boolean refs remain
- [x] State the "unknown ⇒ guarded" invariant as the controlling rule — Done

### Phase 2: Invert the policy surfaces
- [x] Update `guarded_proxy.md` Canonical Request to carry the required `openDesignPurpose` — Done: required field added
- [x] Update the Classification table to key exemption on a positive `openDesignExemption` plus allowlist membership; unknown purpose ⇒ guarded — Done: two-axis table
- [x] Update the Exemption Model + Policy JSON (`requiresFeedsDesignDecisionFalse` → positive-purpose requirement), keeping the allowlist closed — Done: `requiresOpenDesignPurpose: "openDesignExemption"`
- [x] ~~Align `tool_surface.md` surface/gate/omit policy with the positive-purpose axis~~ — DEFERRED: `tool_surface.md` left untouched (scope held to 2 files); named in the residual

### Phase 3: Verify and document residual
- [x] Walk each acceptance scenario against the revised contract — Done: Acceptance table traces ALLOW/DENY
- [x] Confirm the allowlist pure-transport ops are not newly blocked — Done: allowlist preserved, not token-gated
- [x] Name old-contract consumers (the residual section) — Done: Named Residual flags `feedsDesignDecision` consumers
- [x] Evergreen check: no spec/finding IDs or ephemeral paths embedded in the policy docs — Done: scan clean

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Method |
|-----------|-------|--------|
| Contract read-through | Each acceptance scenario resolves to ALLOW/DENY as specified | Manual trace through Canonical Request → Classification → precondition |
| Allowlist non-regression | The listed pure-transport ops still ALLOW without a token | Cross-check the `exemptTransport` set is unchanged and not token-gated |
| Unknown-tool trace | A new/unknown design-affecting tool resolves to GUARDED | Trace an op absent from the allowlist with each purpose value |
| Evergreen lint | No IDs/paths baked into the durable policy docs | Grep the edited docs for spec/finding IDs and packet paths |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `guarded_proxy.md` policy block | Internal | Green | Primary inversion target |
| `SKILL.md` gate signature | Internal | Green | Boolean default site to remove |
| `tool_surface.md` policy | Internal | Green | Surface/gate/omit alignment |
| `DESIGN_PROOF_TOKEN` contract | Internal | Green | Referenced for the `skDesignGate` path; not redefined here |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The positive-purpose axis blocks a legitimate pure-transport op, or a consumer hard-breaks on the removed boolean.
- **Procedure**: Revert the edits to `guarded_proxy.md`, `SKILL.md`, and `tool_surface.md`; the prior deny-by-default proxy stance plus the boolean axis is restored intact.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Contract) ──> Phase 2 (Policy surfaces) ──> Phase 3 (Verify + residual)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Contract | None | Policy surfaces |
| Policy surfaces | Contract | Verify |
| Verify + residual | Policy surfaces | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Contract | Low | 45 minutes |
| Policy surfaces | Medium | 1-1.5 hours |
| Verify + residual | Low | 45 minutes |
| **Total** | | **2.5-3 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline copy of the target docs captured before editing — Done: git-tracked, revertable
- [x] Feature flag configured (N/A — prose contract, no runtime flag) — Done: not applicable
- [x] Allowlist set recorded so non-regression can be confirmed — Done: `exemptTransport` set recorded and preserved verbatim

### Rollback Procedure
1. **Immediate**: Revert `guarded_proxy.md` to the prior Classification + Exemption + Policy block.
2. **Co-target**: Restore the `SKILL.md` boolean signature.
3. **Verify**: Confirm the acceptance scenarios resolve as they did pre-change.

### Data Reversal
- **Has data migrations?** No — documentation/contract only.
- **Reversal procedure**: Git revert of the two edited Markdown files.

<!-- /ANCHOR:enhanced-rollback -->

---

## HONEST RESIDUAL — what still speaks the old contract

This is a prose/contract inversion; the gate is never-executed pseudocode today, so "consumers" are documents and any future implementation that hardcoded the old allow-by-default. The two named targets — `guarded_proxy.md` and `SKILL.md` — are migrated: the boolean is removed from `SKILL.md` (0 refs) and the Policy JSON now keys on `requiresOpenDesignPurpose: "openDesignExemption"`. After this change the following still speak the old boolean contract until separately migrated:

- `tool_surface.md` — the surface/gate/omit policy was NOT updated here (scope held to 2 files); any "always safe read" framing still predates the positive-purpose axis.
- `.codex/policy.json` and the PreToolUse hook (`pre-tool-use.ts`) — any branch that reads a `feedsDesignDecision` boolean rather than the positive `openDesignPurpose`.
- Any other adapter or caller still passing or omitting the removed positional boolean.

<!--
LEVEL 2 PLAN
- Core + Level 2 addendum (phase deps, effort, enhanced rollback)
- Prose/contract inversion: deny-by-default positive purpose
-->
