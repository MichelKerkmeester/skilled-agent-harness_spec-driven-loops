---
title: "Implementation Plan: Headless Automation Freeze (D4-R11)"
description: "Plan to freeze the design-affecting Open Design automation surface at the agent/proxy boundary: deny-by-default unless a fresh per-execution mint or a named pre-authorized replay is present."
trigger_phrases:
  - "d4-r11 automation freeze"
  - "headless automation gate design build"
  - "automation freeze plan"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/004-d4-open-design-pairing/011-automation-freeze"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Confirm the freeze plan: deny-by-default, two escape paths, named daemon residual"
    next_safe_action: "Let the parent refresh description.json and graph-metadata.json"
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
# Implementation Plan: Headless Automation Freeze (D4-R11)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Domain** | Open Design guarded proxy (mcp-open-design), agent-side adapter boundary |
| **Deliverable** | Prose policy contract (an evergreen reference section), not a daemon patch or code change |
| **Home (recommended)** | A new `## Automation Freeze` section appended to `.opencode/skills/mcp-open-design/references/guarded_proxy.md` |
| **Verification** | Documentation checks: structural grep for the freeze rule, escape paths, exemption, residual, and the cited token section |

### Overview
This plan adds an automation-freeze contract to the existing Open Design guarded-proxy boundary. A design-affecting automation (`od automation create`/`od automation run` that triggers a design-mutating op, or a scheduled `start_run`) is FROZEN — denied by default — because the design proof token is single-use and short-lived (~300s) and an unattended automation cannot carry or mint a live interactive token at fire time. The freeze allows exactly two escape paths and one exemption, reuses the token single-use/TTL rules by citation rather than restating them, and honestly names the daemon-internal scheduler residual it cannot reach.

The lowest-duplication home is a new section inside `guarded_proxy.md` rather than a standalone `automation_freeze.md`, because the boundary model, canonical request, classification, deny-by-default precondition, the `od automation` guarded/exempt split, the token citation, and the named-daemon-residual framing already live there. A standalone reference would re-state all of that scaffolding.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Freeze rule, two escape paths, read-only exemption, and named residual enumerated
- [x] Home decided (guarded_proxy.md section) with a duplication rationale
- [x] Token single-use/TTL basis identified for citation (not restatement)
- [x] Honesty boundary agreed: agent/proxy-side policy contract, daemon scheduler is a named residual

### Definition of Done
- [x] Contract defines the freeze rule (design-affecting automation = DENY by default)
- [x] Both escape paths documented (per-execution fresh-mint OR named auditable pre-authorization)
- [x] Read-only-automation exemption documented (`od automation list/view/show`)
- [x] Daemon-internal scheduler named as the residual
- [x] Token single-use/TTL section reused by citation; no field-schema duplication
- [x] Authored contract is evergreen: no spec IDs, finding IDs, packet numbers, or spec-folder paths embedded

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Deny-by-default policy refinement of the existing guarded-proxy precondition, scoped to the headless automation subset where no interactive operator is present to authorize a fire.

### Key Components
- **Freeze rule**: a design-affecting automation is denied by default; an automation cannot satisfy a single-use, ~300s token at an unattended fire time.
- **Escape path A — per-execution fresh-mint**: the automation pauses for a live operator to mint a fresh single-use token bound to that specific fire's outgoing payload, converting a headless fire into an attended one.
- **Escape path B — named auditable pre-authorization**: a frozen binding captured at create time (subject/payload digests plus a bounded run budget — `maxRunsBeforeReview`, `singleFire`/`reviewWindow`); fire-time accepts only an exact replay of that frozen binding within the review window.
- **Read-only-automation exemption**: pure inventory automations (`od automation list/view/show`) feed/mutate no design decision and require no token, consistent with the existing exempt-transport allowlist.
- **Named residual**: the bundled Open Design daemon's own internal scheduler can fire a scheduled automation without traversing the agent-side adapter; agent-side policy cannot freeze it.
- **Citation reuse**: single-use, nonce/runId replay defense, and ~300s TTL are owned by the token contract section and referenced, never re-specified here.

### Data Flow
1. An automation request is normalized into the canonical request at the agent-side adapter.
2. Classify: design-mutating, or a read that feeds a design decision, versus pure read-only inventory.
3. Read-only inventory automation → exempt → ALLOW without a token.
4. Design-affecting automation → freeze rule → DENY by default.
5. Override only when escape path A (live fresh-mint at execution) or escape path B (valid replay of a named, pre-authorized frozen binding within budget) is satisfied; otherwise DENY.
6. A scheduled fire that reaches the daemon without traversing the adapter is the named residual — out of scope for agent-side enforcement.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Decide & Draft
- [x] Confirm the home (guarded_proxy.md section) and capture the lowest-duplication rationale
- [x] Draft the freeze rule wording tied to the single-use/short-TTL constraint
- [x] Outline the two escape paths and the read-only exemption

### Phase 2: Author Contract
- [x] Write the freeze rule, both escape paths, and the read-only-automation exemption
- [x] Name the daemon-internal scheduler residual and the honesty boundary
- [x] Cite the token single-use/TTL section; reference the `od automation` verbs in-section (single-file scope held — no separate surface-doc edit)
- [x] Define the acceptance scenarios (deny, fresh-mint allow, replay allow, exempt allow, residual unenforceable)

### Phase 3: Verification
- [x] Grep-confirm freeze rule, escape paths, exemption, residual, and the token citation are present
- [x] Evergreen scan: no spec/finding IDs or spec-folder paths embedded in the durable section
- [x] Confirm no daemon patch or code change is claimed; the deliverable stays prose-only

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Freeze rule, two escape paths, read-only exemption, named residual all present | Grep / Read |
| Citation | Single-use/TTL is cited from the token contract, not duplicated | Grep / Read |
| Evergreen | No spec IDs, finding IDs, packet numbers, or spec-folder paths in the durable section | Grep |
| Honesty | Section states agent/proxy-side scope and names the daemon scheduler residual | Read |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Design proof token single-use/TTL contract section | Internal | Green | Freeze rationale loses its cited basis |
| Guarded proxy boundary, classification, and policy | Internal | Green | No host contract to extend; would force duplication |
| Open Design tool-surface automation verbs (guarded create/run vs exempt list/view/show) | Internal | Green | Cannot classify the automation subset |
| Codex guarded sets (start_run, od automation create/run) | Internal | Green | Cross-surface consistency check unavailable |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The freeze section conflicts with the host guarded-proxy contract, or over-blocks legitimate read-only automation.
- **Procedure**: Remove the appended `## Automation Freeze` section and the one-line surface cross-reference; the change is additive prose with no runtime coupling.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Decide & Draft) ──> Phase 2 (Author Contract) ──> Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Decide & Draft | None | Author Contract |
| Author Contract | Decide & Draft | Verification |
| Verification | Author Contract | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Decide & Draft | Low | 30 minutes |
| Author Contract | Medium | 1-1.5 hours |
| Verification | Low | 30 minutes |
| **Total** | | **2-2.5 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Host guarded-proxy section read before editing
- [x] Feature flag configured (N/A — additive prose contract)
- [x] Backup not required (version-controlled markdown)

### Rollback Procedure
1. **Immediate**: Delete the appended `## Automation Freeze` section
2. **Cross-reference**: Remove the one-line pointer from the `od automation` surface doc
3. **Verify**: Confirm the guarded-proxy contract reads cleanly without the section
4. **Notify**: Note the reversal in the phase implementation summary

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: None — prose-only, no state or schema

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Core + Level 2 addendum
- Phase dependencies and effort estimation
- Enhanced rollback procedure
-->
