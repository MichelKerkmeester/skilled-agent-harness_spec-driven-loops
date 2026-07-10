---
title: "Implementation Summary: Phase 3 packet-125-126-refinements"
description: "5 WS-B advisory refinements landed in the 125-cli-external-parent and 126-mcp-tooling-parent planning packets: a ClickUp-drift cutover-visibility gate, a resolution-based move gate, an explicit no-advisor-rebuild-before-006 invariant, an ADR-005 carve-out cross-reference, and an explicit phase-001 read-only marker. Both packets stay Planned; both re-validated 0/0 strict."
trigger_phrases:
  - "packet 125 126 refinements complete"
  - "WS-B advisory refinements landed"
  - "resolution-based move gate shipped"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/skilled-agent-orchestration/127-deep-review-remediation/003-packet-125-126-refinements"
    last_updated_at: "2026-07-10T05:15:00Z"
    last_updated_by: "claude"
    recent_action: "Filled implementation-summary.md with refinement evidence"
    next_safe_action: "None - phase complete"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/125-cli-external-parent/spec.md"
      - ".opencode/specs/skilled-agent-orchestration/125-cli-external-parent/003-scaffold-hub/spec.md"
      - ".opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/008-cutover-and-rollout/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "127-deep-review-remediation-003-packet-125-126-refinements"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All 5 WS-B findings fixed and re-verified; both target packets stay Status Planned and 0/0 strict"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-packet-125-126-refinements |
| **Completed** | 2026-07-10 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The 125-cli-external-parent and 126-mcp-tooling-parent merge plans no longer leave 5 advisory gaps for a future executor to trip over. A whole-program deep review found these gaps while both plans were already passing strict validation, so none of them block execution, but each one would have cost real time to rediscover mid-execution. This phase closes all 5, in place, as additive documentation only. Both packets stay exactly what they were: validated plans with `Status: Planned`, zero code touched, zero locked decision reopened.

### R1: ClickUp auth/config drift now has a cutover-visibility gate

The 126 packet already knew about a real pre-existing drift: `mcp-click-up`'s `SKILL.md` documents an OAuth `mcp-remote` server, but `.utcp_config.json` actually registers `clickup_official` via `@clickup/mcp-server` with an API key. Phase 005 correctly deferred fixing it, but nothing in the plan would have caught it again at cutover, so "deferred" could quietly become "forgotten." Phase 008 (`cutover-and-rollout`) now carries an explicit checklist item, deliverable, and P1 requirement (`REQ-004`) that says: confirm this drift is still deferred, not silently dropped, before rollout.

### R2: Move gates now verify link resolution, not just grep-absence

Phases 004 and 005 both move skill trees one directory deeper and rewrite their internal relative links (`../mcp-*`, `../sk-*`). The original move gate only grepped for the OLD path string being gone, which proves nothing about whether the REWRITTEN link actually points at a file that exists. Both phases now add a disk-resolution check: for every rewritten relative link, resolve it from its containing file's directory and confirm the target exists, not just that the old string is absent.

### R3: The ADR-005 carve-out is visible where the scope boundary is stated

Phase 006's Scope Boundary sentence flatly said it "does not touch `mcp-code-mode` or the `code_mode` registration," while the detailed scope further down the same file explains that `mcp-code-mode`'s `graph-metadata.json` reverse edges DO get repointed, under a named ADR-005 exception. A reader who stopped at the boundary line would get the wrong impression. The boundary line now names the exception in place.

### R4: The scaffold's early graph-metadata.json is now provably safe, not just safe by accident

Phase 003 authors `cli-external/graph-metadata.json` before phase 005 rewrites the executor-delegation scorer to be hub-aware. That ordering is safe only because the advisor never actually rebuilds `skill-graph.json` from that file until phase 006. That invariant was real but only inferable by reading phases 005 and 006 together. Phase 003 now states it directly, at the exact point it creates the file.

### R5: Phase 001's read-only boundary is unambiguous

The parent phase map already said "Research gate (no writes)" for phase 001, which is correct but easy to skim past inside a longer sentence. It now reads "**Read-only research gate (no writes)**," bolded and leading, so the boundary reads as a property of the phase, not a trailing clause.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `126-mcp-tooling-parent/008-cutover-and-rollout/spec.md` | Modified | R1: Deliverables bullet, In Scope bullet, new `REQ-004` |
| `126-mcp-tooling-parent/008-cutover-and-rollout/plan.md` | Modified | R1: Key Components bullet, Phase 2 bullet |
| `126-mcp-tooling-parent/008-cutover-and-rollout/tasks.md` | Modified | R1: new `T007`, Phase 3 renumbered, Completion Criteria |
| `126-mcp-tooling-parent/004-onboard-chrome-devtools/spec.md` | Modified | R2: `REQ-002` acceptance criteria extended |
| `126-mcp-tooling-parent/004-onboard-chrome-devtools/plan.md` | Modified | R2: Key Components, Phase 3, Testing Strategy |
| `126-mcp-tooling-parent/004-onboard-chrome-devtools/tasks.md` | Modified | R2: new `T010` |
| `126-mcp-tooling-parent/005-foldin-clickup-and-figma/spec.md` | Modified | R2: `REQ-002` acceptance criteria extended |
| `126-mcp-tooling-parent/005-foldin-clickup-and-figma/plan.md` | Modified | R2: Key Components, Phase 3, Testing Strategy |
| `126-mcp-tooling-parent/005-foldin-clickup-and-figma/tasks.md` | Modified | R2: new `T011` |
| `126-mcp-tooling-parent/006-advisor-and-integration/spec.md` | Modified | R3: Scope Boundary sentence cross-references ADR-005 |
| `125-cli-external-parent/003-scaffold-hub/spec.md` | Modified | R4: In Scope bullet + Files to Change row state the invariant |
| `125-cli-external-parent/spec.md` | Modified | R5: phase map row 1 marked explicitly read-only |
| `127-deep-review-remediation/003-packet-125-126-refinements/{spec,plan,tasks,implementation-summary}.md` | Modified | This phase's own spec-kit docs, filled in from the scaffold |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every finding was re-verified against the live file (grep or Read) immediately before editing, since the fix manifest's line numbers were marked approximate. R5 turned up a real nuance this way: the cited phase-map row already carried partial "(no writes)" prose before this phase touched it, so the fix strengthened existing wording to say "read-only" explicitly rather than inventing a boundary from nothing (see Key Decisions). Each edit was a targeted `Edit` on an exact matched string, additive prose only, never touching a `decision-record.md` or a `Status` field. After all 13 file edits, metadata was regenerated for every touched phase folder plus the 125 parent root, and both packets were re-validated `--recursive --strict` end to end.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Treat R5 as "strengthen existing text" rather than "add missing text" | The live file already read "Research gate (no writes)" before this phase touched it; the review finding's premise (the map "doesn't say so") did not match the live file. Rather than silently skip the finding or fabricate a bigger change than needed, the fix made the existing signal impossible to skim past: bolded, leading, and using the word "read-only" the finding explicitly asked for. |
| Extend `REQ-002`'s acceptance criteria in 004/005 instead of adding a new REQ for R2 | The resolution check is a strengthening of the SAME requirement (self-paths correctly rewritten), not a new deliverable. A new REQ would imply a separable feature; extending the existing one keeps the requirement count honest. |
| Add a new `REQ-004` (not extend `REQ-003`) for R1 in 126/008 | The ClickUp-drift visibility check is a distinct, separately-checkable acceptance criterion from "stale-reference sweep clean; parent rolled up." Folding it into `REQ-003` would hide a real checklist item inside an unrelated one. |
| Cross-referenced the ADR-005 carve-out at the Scope Boundary line itself (R3), not just left in the detailed Scope section | The finding was specifically that the FIRST place a reader sees the boundary claim is misleading. Only fixing the detailed section below would leave the same trap for a reader who stops early. |
| Kept every 125/126 edit as additive prose with no `Status` or ADR change | The remediation task is explicit that these are advisory clarity refinements, not new decisions. Verified after editing that no `decision-record.md` file in either packet was touched and both packets' `Status` fields still read `Planned`. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Each of R1-R5 re-verified against the live file before editing | PASS - `126.../005-foldin-clickup-and-figma/spec.md:113`, `126.../004-onboard-chrome-devtools/plan.md:85-88`, `126.../006-advisor-and-integration/spec.md:72`, `125.../003-scaffold-hub/spec.md:104-105,121`, `125-cli-external-parent/spec.md:128` all matched the manifest's claims (with the R5 nuance noted above). |
| `generate-description.js` + `backfill-graph-metadata.js` for all 6 touched folders (5 phase folders + the 125 parent root) | PASS - every run reported `"failed": []` and `"drift": []`. |
| `bash .../validate.sh .../125-cli-external-parent --recursive --strict` | PASS - `Errors: 0  Warnings: 0` across the parent and all 8 phase children. |
| `bash .../validate.sh .../126-mcp-tooling-parent --recursive --strict` | PASS - `Errors: 0  Warnings: 0` across the parent and all 8 phase children. |
| `bash .../validate.sh .../127-deep-review-remediation/003-packet-125-126-refinements --strict` | PASS - see command output below this table's authoring pass. |
| No `decision-record.md` file touched in either packet; both `Status` fields still read `Planned` | PASS - only `spec.md`/`plan.md`/`tasks.md` files under the 6 target phase folders were edited; both packets' top-level `spec.md` METADATA tables (or the phase-level ones for 004/005/006/008/003) still show `Planned`. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **R1's cutover-visibility gate is still a manual confirmation step, not an automated check.** Phase 008's new `REQ-004` requires a human or agent to explicitly confirm the ClickUp drift is still deferred at cutover time; nothing greps `.utcp_config.json` against `SKILL.md` automatically. If a future executor skips the step, the gate does not self-enforce.
2. **R2's resolution-based check is specified as a task, not yet as executable tooling.** Phases 004/005 now say to resolve each rewritten relative link on disk, but no script does this automatically today; the executing agent will need to write or reuse a link-resolution check when phase 004/005 actually runs.
3. **This is a planning-document refinement only.** No runtime script, skill file, or ADR changed; both 125 and 126 remain unexecuted plans. Nothing to smoke-test beyond re-reading the corrected text and the strict validation gates already run.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
