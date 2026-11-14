---
title: "Implementation Plan: Phase 11: relocate-and-restore-fixes"
description: "Change relocate.mjs and archive.sh in place: plan phase-row edits for a done re-parent, narrow exit 3, bound the bare-name pass, drop the restore dry run and update the help. Prove each with a suite case that fails before the fix."
trigger_phrases:
  - "relocate and restore fixes plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 11: relocate-and-restore-fixes

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM (`.mjs`), Bash and TypeScript test files |
| **Framework** | None |
| **Storage** | The relocation ledger, read and written only by `relocate.mjs` |
| **Testing** | vitest, run from `.skilled/skills/system-spec-kit/runtime/cli` |

### Overview
This phase changes two scripts and two suites. Three functions and the header comment in `relocate.mjs`, and one function plus the help text in `archive.sh`, change in place. No file, flag or dependency is added. Proof is one suite case per requirement that fails before its fix, and the re-parent resume reproduced in a `mktemp` copy.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The setup reproduced F1 in `SCRATCH` and listed the segments the real tree writes before a bare phase name
- [ ] The setup saved the three-suite and the full `npm test` baselines

### Definition of Done
- [ ] All five requirements pass their acceptance check
- [ ] From `runtime/cli`, `../../node_modules/.bin/vitest run --config ../../vitest.config.ts --project cli tests/relocate.vitest.ts tests/archive-track.vitest.ts tests/relocate-real-pipeline.vitest.ts` exits 0
- [ ] The full CLI suite `npm test` exits 0 with no failure absent from the baseline
- [ ] `verify_alignment_drift.py --root .skilled/skills/system-spec-kit/runtime/cli/spec` prints PASS
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
In-place script fixes

### Key Components
- **Phase-row planning** (`phaseRowEdits`, `relocate.mjs:755`): today it filters to `pending` entries. A `done` re-parent entry also gets row edits when its old parent's `spec.md` or `goal.md` still names the old phase, or its new parent's `spec.md` lacks a row for the new name. The moved child's own `spec.md` is read at `entry.to` for a done entry, as `:702` already does, not at `entry.from` as `:860` does. The new parent's files are written before the old parent's, so a run stopped between them leaves the old rows as the signal a rerun reads. Each edit already checks the row before it acts, so a finished entry produces no edit and the map still ends on `nothing to do`.
- **Exit 3** (`relocate.mjs:1659-1666`): the verdict lines are already parsed into `verdict`. Status 3 is set only when that list holds a `RESULT: FAILED` line. A failed validation with no `RESULT` line sets status 2, which outranks 3, and keeps the close open: the sweep mark at `:1651` is written only after every entry produced a `RESULT` line, so a rerun validates again. The header comment at lines 35 to 40 states the narrowed condition.
- **Bare-name boundary** (`bareNamePattern`, `relocate.mjs:980`): the lookbehind keeps excluding segment characters. A match preceded by `/` is accepted only when the segment before that slash is `.`, `..` or the parent's own folder name, the forms the setup search confirms in the real tree. Its three call sites, `:746`, `:989` and `:1096`, each pass the parent name.
- **Restore mixed-track check** (`refuse_mixed_track_restore`, `archive.sh:363`): the loop at lines 386 to 392 already finds the first declared sub-track of the destination track through `is_declared_subtrack`. The check refuses when one exists, by the same declaration rule the preflight applies at `relocate.mjs:215`, and drops the `relocate.mjs` dry run. The guard at line 371 stays, and a packet already inside a sub-track still returns early at line 375.

### Data Flow
`archive.sh --restore` resolves the destination, runs the mixed-track check, then moves the folder itself or hands a renumber to `relocate.mjs --apply` and reads its exit status. `relocate.mjs` classifies entries, plans rewrites and phase rows, applies steps and closes with validation, which sets its exit status.

### Shared Contracts
The exit status of `relocate.mjs`: 0, 1, 2 and 3 keep their meanings, and REQ-002 narrows when 3 is set. Its reader is `archive.sh:437`. The `archive.sh` refusal text and exit 1 for a mixed-track restore do not change.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup reproduces F1 in a `mktemp` copy, lists the bare-name prefixes and saves the suite baseline. Implementation adds one failing case and then one fix per requirement. Verification reruns the F1 reproduction, runs the suites, the drift check and this folder's validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The suite command is `../../node_modules/.bin/vitest run --config ../../vitest.config.ts --project cli tests/relocate.vitest.ts tests/archive-track.vitest.ts tests/relocate-real-pipeline.vitest.ts`, run from `runtime/cli`, and it must exit 0.

Each requirement gets one happy-path case and one edge case, each failing before its fix. REQ-001 asserts on both parents' `spec.md` and `goal.md` and the child's neighbour rows after the run. REQ-005 records stub calls to show no `relocate.mjs` process ran. REQ-001's stopped states are made by hand before the run, because the rewrite step is in-process and has no stub to fail.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`node`, `git`, `bash` and the vitest binary at `.skilled/skills/system-spec-kit/node_modules/.bin/vitest`. No new package. Phases 012 and 013 start after this phase lands, because they describe its behavior.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a finished map reports work on every run, a restore into a mixed track is allowed, or a renumber leaves a relative link stale.
- **Procedure**: revert the one commit that carries this phase. No stored format changes, so nothing written by the new code needs migrating back.
<!-- /ANCHOR:rollback -->

---
