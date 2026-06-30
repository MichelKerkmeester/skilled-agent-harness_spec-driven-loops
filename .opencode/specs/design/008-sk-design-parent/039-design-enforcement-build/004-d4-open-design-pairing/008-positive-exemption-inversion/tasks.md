---
title: "Tasks: Invert Open Design exemption to deny-by-default positive purpose"
description: "planning. Replace the boolean default with a required openDesignPurpose; document the unknown-equals-guarded invariant; keep the exemptTransport allowlist allowed."
trigger_phrases:
  - "open design exemption inversion tasks"
  - "deny by default positive purpose tasks"
  - "opendesignpurpose unclassified tasks"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/004-d4-open-design-pairing/008-positive-exemption-inversion"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark all tasks complete with one-line evidence and align Level 2 phase headers"
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
# Tasks: Invert Open Design exemption to deny-by-default positive purpose

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

Establish the positive-purpose contract (45m).

- [x] T001 Confirm current stance: read the Policy block and confirm `defaultDecision: "guarded"` plus "anything omitted from exemptTransport is guarded" (`.opencode/skills/mcp-open-design/references/guarded_proxy.md`) [10m] — Done: proxy already deny-by-default; boolean axis was the residue
- [x] T002 Locate the boolean default sites: `route_open_design_resources(..., feeds_design_decision=False)` and `design_gate(intents, feeds_design_decision)` (`.opencode/skills/mcp-open-design/SKILL.md`) [10m] — Done: both signatures located
- [x] T003 Define `openDesignPurpose` with two positive values — `openDesignExemption` (transport; forbids later design use) and `skDesignGate` (design-authorized) — plus the `unclassified` deny-state for missing/unknown (`.opencode/skills/mcp-open-design/references/guarded_proxy.md`) [15m] — Done: Canonical Request field + `OPEN_DESIGN_PURPOSES`
- [x] T004 Author the controlling invariant statement "unknown ⇒ guarded" (unknown tool AND unknown purpose both deny) (`.opencode/skills/mcp-open-design/references/guarded_proxy.md`) [10m] — Done: stated in intro, Policy, Acceptance

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Invert the policy surfaces (1-1.5h).

### Canonical request + skill gate
- [x] T005 Replace the boolean default in the gate signature with a required `openDesignPurpose`; missing → `unclassified` → denied for design (`.opencode/skills/mcp-open-design/SKILL.md`) [20m] — Done: `design_gate(intents, openDesignPurpose)` raises on `unclassified`; 0 boolean refs
- [x] T006 Add the required `openDesignPurpose` field to the Canonical Request table; mark unreconstructable purpose as guarded (`.opencode/skills/mcp-open-design/references/guarded_proxy.md`) [15m] — Done: required field added; unreconstructable ⇒ guarded
- [x] T007 Rewrite the Classification table so exemption requires a positive `openDesignExemption` AND allowlist membership; `skDesignGate` ⇒ token-required; missing/unknown purpose ⇒ guarded (`.opencode/skills/mcp-open-design/references/guarded_proxy.md`) [20m] — Done: two-axis Classification table
- [x] T008 Update the Exemption Model prose: the allowlist is the legitimate pure-transport carve-out, now keyed on a positive `openDesignExemption` not an omitted boolean (`.opencode/skills/mcp-open-design/references/guarded_proxy.md`) [15m] — Done: "Either condition missing means guarded"
- [x] T009 Update the Policy JSON: replace `exemptTransport.requiresFeedsDesignDecisionFalse` with the positive-purpose requirement; keep the allowlist closed and unchanged (`.opencode/skills/mcp-open-design/references/guarded_proxy.md`) [15m] — Done: `requiresOpenDesignPurpose: "openDesignExemption"`, allowlist verbatim
- [x] ~~T010 [P] Align the surface/gate/omit policy with the positive-purpose axis so reads that feed design are not "always safe" (`.opencode/skills/mcp-open-design/references/tool_surface.md`)~~ [15m] — DEFERRED: `tool_surface.md` left untouched (scope held to 2 files); named in the residual

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Trace the acceptance scenarios and confirm the residual (45m).

### Contract traces
- [x] T011 Trace: no `openDesignPurpose` → `unclassified` → DENIED for design [10m] — Done: Acceptance row resolves DENY
- [x] T012 Trace: an unknown/new design-affecting tool (absent from the allowlist) → GUARDED (deny without token) [10m] — Done: Acceptance row resolves DENY, "unknown ⇒ guarded"
- [x] T013 [P] Trace: each `exemptTransport` op with `openDesignExemption` → ALLOWED without a token (no new gate) [10m] — Done: allowlist preserved, not token-gated

### Residual + evergreen
- [x] T014 Confirm the residual section names every old-contract consumer (boolean signature, `requiresFeedsDesignDecisionFalse`, any `feedsDesignDecision` hook) (`guarded_proxy.md` Named Residual + `plan.md`) [10m] — Done: Named Residual flags hook/policy/adapter/caller still reading `feedsDesignDecision`
- [x] T015 Evergreen check: grep the edited policy docs for spec/finding IDs and packet paths; remove any found [5m] — Done: scan clean, none found

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` (T010 deferred with reason — `tool_surface.md` out of scope, named in residual)
- [x] No `[B]` blocked tasks remaining
- [x] Policy is deny-by-default with a positive `openDesignPurpose` axis
- [x] Unknown tool AND unknown purpose both resolve to guarded/denied
- [x] `exemptTransport` allowlist ops remain allowed without a token
- [x] `checklist.md` fully verified

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->

<!--
LEVEL 2 TASKS
- Core + Level 2 detail (effort per task, explicit verification tasks)
- Prose/contract inversion: deny-by-default positive purpose
-->
