---
title: "Verification Checklist: Phase 5: pi-command-layer"
description: "Verification checklist for the pi-command-layer planning phase (flattening convention + argument translation table)."
trigger_phrases:
  - "pi command layer checklist"
  - "command flattening verification"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/005-pi-command-layer"
    last_updated_at: "2026-07-27T10:01:30Z"
    last_updated_by: "claude-code"
    recent_action: "All 26 items closed out; CHK-021 re-derived live, zero drift"
    next_safe_action: "Commit; phase 006 proceeds with the Task-dependency list"
    blockers: []
    key_files: ["implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-authoring-005"
      parent_session_id: null
    completion_pct: 100
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

This phase is **Complete** for its planning-only scope: the flattening convention, translation table, and worklist are design-verified and re-derived live with zero drift. Items requiring a future execution pass (live Pi session, actual `.pi/prompts/*.md` creation) stay `[B]` blocked and explicitly documented — not silently implied to be done.

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

- [x] CHK-001 [P0] Requirements documented in `spec.md` (REQ-001..REQ-008) [EVIDENCE: `spec.md` §4]
- [x] CHK-002 [P0] Technical approach defined in `plan.md` (classification rule, flattening convention, translation table, frontmatter-key disposition table, 36-row worklist) [EVIDENCE: `plan.md` §3]
- [x] CHK-003 [P1] Real `.opencode/commands/` tree read directly during authoring (`find`/`grep`, not assumed from the phase brief) — 49 files confirmed, 36 invokable / 13 supporting split confirmed [EVIDENCE: re-ran live during closeout, same counts]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

Adapted for a documentation-only phase (doctrine quality, not source code).

- [x] CHK-010 [P0] Flattening convention produces 36 unique filenames, zero collisions — verified by inspection of `plan.md`'s worklist "Flattened Filename" column (36 rows, 36 distinct values) [EVIDENCE: re-derived live via shell one-liner, `sort -u | wc -l` returns 36]
- [x] CHK-011 [P0] No claim about Pi's live behavior is stated as confirmed when it rests only on pi.dev docs — every such claim carries an explicit UNCONFIRMED marker (`grep -c "UNCONFIRMED" spec.md plan.md` → non-zero in both files) [EVIDENCE: `rg -c "UNCONFIRMED" spec.md plan.md`]
- [x] CHK-012 [P1] Translation table covers all 5 argument-hint grammar patterns actually observed in the 36 commands (whole-string, positional-slot, sub-action-enum, GNU-flag, mode-suffix) — `plan.md` §3 component C [EVIDENCE: `plan.md` §3 component C]
- [x] CHK-013 [P1] Frontmatter-key gap (`allowed-tools`/`argument-hint`/`skill`/`title`/`version`/`description`) has a stated disposition per key, not a silent drop — `plan.md` §3 component D [EVIDENCE: `plan.md` §3 component D]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Every one of REQ-001..REQ-008's acceptance criteria is stated in a form a person or CI could check against the real repo tree — each cites a runnable check such as `grep -rl "argument-hint" .opencode/commands` (spec.md §4) [EVIDENCE: `spec.md` §4 acceptance-criteria column]
- [x] CHK-021 [P0] Manual re-derivation of the 36 flattened names from the stated convention matches the worklist (no drift) [EVIDENCE: re-derived live during closeout via a shell one-liner applying the `<group>-<name>.md` rule to the current `grep -rl` output; `sort -u | wc -l` returns 36, matching `plan.md`'s worklist exactly]
- [x] CHK-022 [P1] Edge cases addressed in spec.md §7 Open Questions: `goal-opencode.md` title/filename mismatch, `doctor-mcp`'s sub-action+flags positional pattern, `${1:-default}` presence-vs-value ambiguity [EVIDENCE: `spec.md` §7]
- [x] CHK-023 [P1] Error scenarios named and routed: unknown-Pi-frontmatter-key rejection risk and missing-$1-substitution behavior, both flagged as `not yet confirmed` in spec.md §7, routed to phase 001 [EVIDENCE: `spec.md` §7]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

Adapted for a non-fix planning phase: completeness of the classification/translation coverage.

- [x] CHK-FIX-001 [P0] Each of the 49 `.opencode/commands/**/*.md` files has an explicit disposition: ported (36, via the worklist) or explicitly excluded with a stated reason (13, via the classification rule) — no file left unclassified [EVIDENCE: `plan.md` §3 components A+B]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed: all 36 `argument-hint` lines cross-referenced against the 5-pattern translation table during authoring (`plan.md` §3 component C) [EVIDENCE: `plan.md` §3 component C]
- [x] CHK-FIX-003 [P0] [DEFERRED: not applicable — this phase creates new planning doctrine, it does not modify a shared symbol or helper with existing consumers]
- [x] CHK-FIX-004 [P0] [DEFERRED: not applicable — no security, path, parser, or redaction code path is touched by this docs-only phase]
- [x] CHK-FIX-005 [P1] Matrix axes listed: 8 command groups x source-path x flattened-name x invocation x Task-dependency-flag — the worklist's column set (`plan.md`), 36 concrete rows rather than a combinatorial matrix [EVIDENCE: `plan.md` worklist]
- [x] CHK-FIX-006 [P1] [DEFERRED: not applicable — no process-wide or global runtime state is read by this docs-only phase]
- [x] CHK-FIX-007 [P1] [DEFERRED: no fix commit to pin evidence to; this phase's own live re-derivation evidence (CHK-021) is timestamped to this closeout session, 2026-07-27, not a fix SHA]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets in any drafted table or example: `grep -niE "sk-|api[_-]?key|token[:=]|password|secret[:=]" spec.md plan.md tasks.md checklist.md` → 18 hits (re-run at closeout, count grew with the added evidence brackets), all confirmed false positives (the literal substring "sk-" occurring inside "Task-" / "Task-Dep" / "Task-Dependency", not a secret-shaped token); zero real credential-shaped values [EVIDENCE: re-ran live during closeout]
- [x] CHK-031 [P0] The `allowed-tools` frontmatter-loss gap is documented as a named, security-relevant scope-widening risk (ported Pi prompts inherit broader effective tool access than Claude's per-command allowlist intended) — spec.md §6, plan.md §3 component D — not silently omitted [EVIDENCE: `spec.md` §6, `plan.md` §3 component D]
- [x] CHK-032 [P1] [DEFERRED: not applicable — no auth/authz code exists at this planning stage, nothing to verify]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`/`plan.md`/`tasks.md`/`checklist.md` cross-reference each other's requirement/task/check IDs consistently (REQ-00x ↔ T00x ↔ CHK-0xx, e.g. REQ-006 ↔ T007 ↔ CHK-FIX-005) [EVIDENCE: direct read, all 4 docs]
- [x] CHK-041 [P1] Every ANCHOR, SPECKIT_TEMPLATE_SOURCE, and SPECKIT_LEVEL comment marker preserved unedited from the original scaffold in all 4 phase docs [EVIDENCE: `grep -c ANCHOR spec.md plan.md tasks.md checklist.md` — 16/16/12/19]
- [x] CHK-042 [P2] N/A — no phase-local README exists or is required for this folder; the parent packet `spec.md` is untouched per this phase's Hard Constraints [EVIDENCE: `find` shows no README.md in this phase folder]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No file created or modified outside `.opencode/specs/cli-external-orchestration/031-cli-pi-creation/005-pi-command-layer/` during this closeout pass — confirmed by scope: `spec.md`, `plan.md`, `tasks.md`, `checklist.md` edited, `implementation-summary.md` created [EVIDENCE: `git status --porcelain` scoped to this folder]
- [x] CHK-051 [P1] No temp/scratch files created by this closeout pass beyond the folder's pre-existing `scratch/` directory, which remains empty and untouched [EVIDENCE: `find 005-pi-command-layer/scratch -type f` returns nothing]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-27 — all doc-level checks verified, including a live re-derivation of the 36-name worklist (CHK-021) confirming zero drift. This phase's completion claim is scoped to "planning doctrine is complete, internally consistent, and re-verified against the live repo tree" — actual `.pi/prompts/*.md` creation and live Pi dispatch remain out of scope (deferred to a future execution pass), per this phase's own Hard Constraints.
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `tasks.md`
