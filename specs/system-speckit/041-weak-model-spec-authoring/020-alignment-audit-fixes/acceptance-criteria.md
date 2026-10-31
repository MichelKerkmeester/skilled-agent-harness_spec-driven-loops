---
title: "Acceptance Criteria: Phase 20: alignment-audit-fixes"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "alignment audit fixes acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/020-alignment-audit-fixes"
    last_updated_at: "2026-10-26T20:45:00Z"
    last_updated_by: "closeout-doc-writer"
    recent_action: "Recorded the close gates; every row Met"
    next_safe_action: "None: phase complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-020-alignment-audit-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 20: alignment-audit-fixes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 054-weak-model-spec-authoring/020-alignment-audit-fixes
**Level:** 2
**Status:** Complete
**Date:** 2026-10-26
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the allowlist entry for `draft-auto-repair.vitest.ts`, When the AST import check and `npm run check` run in `runtime/cli`, Then both exit 0 | `npx tsx evals/check-no-mcp-lib-imports-ast.ts` and `npm run check` from `runtime/cli`. Observed: `AST import policy check passed: no prohibited @spec-kit/runtime/{lib,core,handlers} internal imports found.`, rc=0; `npm run check` ended with `AST handler cycle check passed`, rc=0. Before the fix the check printed `FAILED: 1 violation(s)` and exited 1 (`spec.md` Measured Behavior) Evidence: `.skilled/skills/system-spec-kit/runtime/cli/evals/import-policy-allowlist.json:175` | Met | - |
| AC-002 | REQ-002 | Given the 12 P1 findings, When each lane verifier re-checks them, Then each is fixed or closed by a recorded re-audit | `scratch/review.md` lanes A to D. Observed: A3, A4, B-01 to B-05, C-01 to C-03 and D-F1 verified fixed; A2 closed by the four re-audits of the `scope2.txt` delta. Spot checks rerun at closeout: `set -euo pipefail` at line 11 of the drift guard, playbook `scenarios=112 violations=0`, skill package gate `PASS (exit 0)`, seven-heading set on all 7 phase changelogs, and the orchestrate agent's `RESULT: PASSED (exit code 0` rule Evidence: `.skilled/agents/orchestrate.md:403` | Met | - |
| AC-003 | REQ-003 | Given the 33 P2 findings, When the lanes finish, Then each is fixed or recorded with a reason | `scratch/review.md`. Observed: every P2 finding is fixed, with C-15 fixed through B-12 on the same line. Closeout checks: `rg -c SPECKIT_DRAFT_AUTO_REPAIR .env.example` printed 1, `effort-est` and the effort `rg` printed nothing, `rg 'phase [0-9]\|054-'` over `template-authoring/` printed nothing Evidence: `.env.example:180` | Met | - |
| AC-004 | REQ-004 | Given the final tree, When the targeted checks run, Then each passes | Observed at closeout: 7 CLI vitest files `Tests 117 passed (117)`, rc=0; catalog `PASS tier=fail violations=0`; playbook `PASS ... scenarios=112 ... violations=0`; Hermes `PASS: 67`; runtime mirrors `PASS: 194`; codex and pi `PASS` 11, 38, 11, 38; roster `STATUS=OK`; skill graph freshness `SIGNAL DRIFT compiled vs disk: none`, rc=0; trigger index `matches the corpus`, rc=0; `CARD SYNC OK`; `EXAMPLE_DRIFT_OK` Evidence: `scratch/review.md:5` | Met | - |
| AC-005 | REQ-005 | Given the residuals the four verifiers found, When the residual passes finish, Then each is fixed or recorded as open with its severity | `scratch/review.md` residual tables. Observed: R1 (P1) fixed and rechecked; R2 (P2) fixed by wiring `guard_command` into the nine `post_write_validation` gates, rechecked by `rg -c 'guard_command' .skilled/commands/speckit/assets/speckit-*.yaml` (2, 2, 5); every other residual fixed or recorded with a reason Evidence: `scratch/review.md:51` | Met | - |
| AC-006 | REQ-006 | Given the filled docs, When `validate.sh` runs on this folder with `--strict` and the repair switched off, Then it prints `RESULT: PASSED` | `node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder <this folder> --apply`, then `SPECKIT_DRAFT_AUTO_REPAIR=0 bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict`. Observed: repair `inspected=1 repaired=1 failed=0`, rc=0; validate `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED`, rc=0 Evidence: `implementation-summary.md:128` | Met | - |

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
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** Yes

Yes. Every criterion is Met, and every P0 and P1 residual is fixed.
<!-- /ANCHOR:closure -->
