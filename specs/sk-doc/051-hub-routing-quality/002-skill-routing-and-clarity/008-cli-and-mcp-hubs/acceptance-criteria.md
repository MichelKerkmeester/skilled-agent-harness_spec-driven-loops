---
title: "Acceptance Criteria: Phase 8: cli and mcp hubs"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "cli and mcp hubs acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/008-cli-and-mcp-hubs"
    last_updated_at: "2026-10-28T14:45:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Verified every criterion against the final gate run"
    next_safe_action: "Conductor landing"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "skill-routing-and-clarity-phase-008"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 8: cli and mcp hubs

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `sk-doc/072-skill-routing-and-clarity/008-cli-and-mcp-hubs`
**Level:** 2
**Status:** Complete
**Date:** 2026-10-28
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the phase is implemented, When its gates run, Then: `parent-skill-check.cjs`, `package_skill.py --strict` and `compiled-route-guard.cjs` pass for all three hubs. | At the final state all three pass. `parent-skill-check` prints `PASS: 12b-routing-shape: hub and 7 packet(s) follow the routing canon (0 known debt)` on `cli-external-orchestration`, `hub and 1 packet(s) ... (0 known debt)` on `cli-classifier` and `hub and 9 packet(s) ... (1 known debt)` on `mcp-tooling`, each with `OK: parent-skill-check — all hard invariants passed, 0 warnings` and exit 0. `package_skill.py --check --strict` prints `Result: PASS`, exit 0, on all eighteen changed files, the two hubs and the sixteen packets, and the runner's fourteen runs carry no advisory on any of the three hubs. `compiled-route-guard.cjs --json` reports seven hubs `fresh` and `failures: 0`, and `compiled-route-sync.cjs --check` reports all 55 served copies matching. The full gate set is `scratch/after.md` §1, 39 of 39 at exit 0. `scratch/after.md:9`, `scratch/after.md:85`, `scratch/after.md:98`, `scratch/after.md:107`, `scratch/after.md:195`, `scratch/after.md:199` | Met | - |
| AC-002 | REQ-002 | Given the phase is implemented, When its gates run, Then: No cli packet restates a first leaf slice that differs from the hub `ROUTER.md`. | Every cli packet defers to the hub and none states a first slice of its own. `.skilled/skills/cli-external-orchestration/cli-claude-code/SKILL.md:50` and `.skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:49` read "the hub `ROUTER.md` names the two leaves a dispatch starts from", `.skilled/skills/cli-external-orchestration/cli-hermes/SKILL.md:59` and `.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:49` say the same for their own dispatches, `.skilled/skills/cli-external-orchestration/cli-cursor/SKILL.md:48` and `.skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:49` say "names the mode's first leaves", and `.skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:49` says "names this packet's first leaves, so leaf selection stays in the hub router". That matches `.skilled/skills/cli-external-orchestration/ROUTER.md:40`, where each mode's first slice is its CLI command reference plus its integration-pattern guide. The six-item `Start with` list `cli-claude-code` carried in §8, which named four resources beyond the hub's two-leaf slice, is gone, and no packet names a different hub-facing first slice. The `LOADING_LEVELS` `ALWAYS` rows name in-packet resources, a separate layer, so they are not first-slice claims and were left as they were. `scratch/after.md:158` | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

Both criteria are Met with observed evidence from the final gate run. AC-001 closes on the three hubs' checks and the 39-gate set, and AC-002 closes on the seven cli packets' own wording plus the hub `ROUTER.md` it defers to.
<!-- /ANCHOR:closure -->
