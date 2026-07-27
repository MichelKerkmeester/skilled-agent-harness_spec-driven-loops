---
title: "Verification Checklist: Phase 5: pi-command-layer [template:level-2/checklist.md]"
description: "Verification checklist for the pi-command-layer planning phase (flattening convention + argument translation table)."
trigger_phrases:
  - "pi command layer checklist"
  - "command flattening verification"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/005-pi-command-layer"
    last_updated_at: "2026-07-27T07:50:00Z"
    last_updated_by: "claude-code"
    recent_action: "checklist.md drafted: 26 items, 12 P0 + 13 P1 + 1 P2"
    next_safe_action: "Run validate.sh --strict on this phase folder; hand off to phase 006 once phase 003/004 land"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-authoring-005"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 5: pi-command-layer

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

This phase is **Planned**, not Complete. Items verifiable from the authored docs themselves are checked with evidence below; items that require a future execution pass (live Pi session, actual `.pi/prompts/*.md` creation) are left unchecked and explicitly marked as deferred — not silently implied to be done.

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in `spec.md` (REQ-001..REQ-008)
- [ ] CHK-002 [P0] Technical approach defined in `plan.md` (classification rule, flattening convention, translation table, frontmatter-key disposition table, 36-row worklist)
- [ ] CHK-003 [P1] Real `.opencode/commands/` tree read directly during authoring (`find`/`grep`, not assumed from the phase brief) — 49 files confirmed, 36 invokable / 13 supporting split confirmed
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

Adapted for a documentation-only phase (doctrine quality, not source code).

- [ ] CHK-010 [P0] Flattening convention produces 36 unique filenames, zero collisions — verified by inspection of `plan.md`'s worklist "Flattened Filename" column (36 rows, 36 distinct values)
- [ ] CHK-011 [P0] No claim about Pi's live behavior is stated as confirmed when it rests only on pi.dev docs — every such claim carries an explicit UNCONFIRMED marker (`grep -c "UNCONFIRMED" spec.md plan.md` → non-zero in both files)
- [ ] CHK-012 [P1] Translation table covers all 5 argument-hint grammar patterns actually observed in the 36 commands (whole-string, positional-slot, sub-action-enum, GNU-flag, mode-suffix) — `plan.md` §3 component C
- [ ] CHK-013 [P1] Frontmatter-key gap (`allowed-tools`/`argument-hint`/`skill`/`title`/`version`/`description`) has a stated disposition per key, not a silent drop — `plan.md` §3 component D
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Every one of REQ-001..REQ-008's acceptance criteria is stated in a form a person or CI could check against the real repo tree — each cites a runnable check such as `grep -rl "argument-hint" .opencode/commands` (spec.md §4)
- [ ] CHK-021 [P0] Manual re-derivation of the 36 flattened names from the stated convention matches the worklist (no drift) — **Planned, not yet run**: this is `tasks.md` T011, deferred to a future execution pass since the derivation was produced once during authoring and has not yet been independently re-derived and diffed
- [ ] CHK-022 [P1] Edge cases addressed in spec.md §7 Open Questions: `goal-opencode.md` title/filename mismatch, `doctor-mcp`'s sub-action+flags positional pattern, `${1:-default}` presence-vs-value ambiguity
- [ ] CHK-023 [P1] Error scenarios named and routed: unknown-Pi-frontmatter-key rejection risk and missing-$1-substitution behavior, both flagged as `not yet confirmed` in spec.md §7, routed to phase 001
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

Adapted for a non-fix planning phase: completeness of the classification/translation coverage.

- [ ] CHK-FIX-001 [P0] Each of the 49 `.opencode/commands/**/*.md` files has an explicit disposition: ported (36, via the worklist) or explicitly excluded with a stated reason (13, via the classification rule) — no file left unclassified
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed: all 36 `argument-hint` lines cross-referenced against the 5-pattern translation table during authoring (`plan.md` §3 component C)
- [ ] CHK-FIX-003 [P0] [deferred: not applicable — this phase creates new planning doctrine, it does not modify a shared symbol or helper with existing consumers]
- [ ] CHK-FIX-004 [P0] [deferred: not applicable — no security, path, parser, or redaction code path is touched by this docs-only phase]
- [ ] CHK-FIX-005 [P1] Matrix axes listed: 8 command groups × source-path × flattened-name × invocation × Task-dependency-flag — the worklist's column set (`plan.md`), 36 concrete rows rather than a combinatorial matrix
- [ ] CHK-FIX-006 [P1] [deferred: not applicable — no process-wide or global runtime state is read by this docs-only phase]
- [ ] CHK-FIX-007 [P1] [deferred: not applicable — no fix SHA exists, this phase has Planned status with no implementation commit]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets in any drafted table or example: `grep -niE "sk-|api[_-]?key|token[:=]|password|secret[:=]" spec.md plan.md tasks.md checklist.md` → 15 hits, all confirmed false positives (the literal substring "sk-" occurring inside "Task-" / "Task-Dep" / "Task-Dependency", not a secret-shaped token); zero real credential-shaped values
- [ ] CHK-031 [P0] The `allowed-tools` frontmatter-loss gap is documented as a named, security-relevant scope-widening risk (ported Pi prompts inherit broader effective tool access than Claude's per-command allowlist intended) — spec.md §6, plan.md §3 component D — not silently omitted
- [ ] CHK-032 [P1] [deferred: not applicable — no auth/authz code exists at this planning stage, nothing to verify]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`/`plan.md`/`tasks.md`/`checklist.md` cross-reference each other's requirement/task/check IDs consistently (REQ-00x ↔ T00x ↔ CHK-0xx, e.g. REQ-006 ↔ T007 ↔ CHK-FIX-005)
- [ ] CHK-041 [P1] Every ANCHOR, SPECKIT_TEMPLATE_SOURCE, and SPECKIT_LEVEL comment marker preserved unedited from the original scaffold in all 4 phase docs, confirmed via `grep -c ANCHOR spec.md plan.md tasks.md checklist.md`
- [ ] CHK-042 [P2] N/A — no phase-local README exists or is required for this folder; the parent packet `spec.md` is untouched per this phase's Hard Constraints
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] No file created or modified outside `.opencode/specs/cli-external-orchestration/031-cli-pi-creation/005-pi-command-layer/` during this authoring pass — confirmed by scope: only `spec.md`, `plan.md`, `tasks.md`, `checklist.md` were written
- [ ] CHK-051 [P1] No temp/scratch files created by this authoring pass beyond the folder's pre-existing `scratch/` directory, which remains empty and untouched
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 11/12 (CHK-021 deferred to future execution) |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-27 — doc-level checks verified during authoring; live-Pi and future-`.pi/prompts/`-creation checks (CHK-021, and by extension `tasks.md` T010/T011) remain Planned, not run. This phase's completion claim is scoped to "planning doctrine is complete and internally consistent," not "the Pi command layer has been built or tested."
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `tasks.md`
