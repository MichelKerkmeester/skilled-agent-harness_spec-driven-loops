---
title: "Implementation Plan: Phase 6: relocate-resume-and-preflight"
description: "Extend relocate.mjs in place so a rerun of the same map finishes the late steps, a half-finished move and a failed identity step, and so the preflight refuses a source that never existed and two spellings of one folder. Prove each with a suite case that fails before the fix."
trigger_phrases:
  - "relocate resume and preflight plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 6: relocate-resume-and-preflight

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM (`.mjs`) and TypeScript test files |
| **Framework** | None |
| **Storage** | The relocation ledger, `.skilled/skills/sk-doc/shared/scripts/relocation-ledger.json` |
| **Testing** | vitest, run from `.skilled/skills/system-spec-kit/runtime/cli` |

### Overview
This phase changes one script, `runtime/cli/spec/relocate.mjs`, and its suite. Four functions change in place: the work check, the dirty-tree check, the stale-identity check and the preflight. Proof is a rerun in a `mktemp` copy that finishes after each induced failure, and one suite case per requirement that fails before its fix.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] T001 reproduced A1, A3, A4, A5 and B6 in a `mktemp` copy and saved each output
- [ ] T002 confirmed `relocate.mjs` is the only reader of the relocation ledger
- [ ] T003 saved the suite baseline

### Definition of Done
- [ ] All six requirements pass their acceptance check in `SCRATCH`
- [ ] From `runtime/cli`, `../../node_modules/.bin/vitest run --config ../../vitest.config.ts --project cli tests/relocate.vitest.ts tests/archive-track.vitest.ts` exits 0. On 2026-11-14 it printed `Test Files  2 passed (2)` and `Tests  77 passed (77)` before any change
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
In-place script extension

### Key Components
- **Work check** (`hasWork` and `buildPlan`, lines 857 to 964): gains a term that is true until the late steps have landed and the sweep has passed once for the map's entries. Changing a value fails here, because nothing the plan reads today differs between a run that finished and a run that stopped after the ledger step. The planned move is to extend the ledger batch the tool already writes with a completion mark, set once the sweep of the close has passed. A moved packet's own validation verdict is printed and never holds the mark back, because a packet that fails for its own reasons would keep the map open on every run, which the comment at lines 776 to 779 rules out. No new file is added.
- **Dirty-tree check** (lines 1252 to 1268): runs only when a move is pending and then refuses every dirty file the run would rewrite. It gains one exemption, files under the destination of an entry the same map already moved.
- **Stale-identity check** (`staleIdentity`, lines 780 to 803): reads `specFolder`, `specId`, `folderSlug`, `packet_id`, `spec_folder` and the pointer lines. It gains `parentChain`, under the rule in the comment above it: only a record that names the old place counts.
- **Preflight** (lines 469 to 489): a missing source with a present destination becomes `done` only with a record of the move. Without one the entry is refused, and the refusal names the move back to the source path. The duplicate maps stop keying on the spelling. `fs.realpathSync` keeps the spelling it was given on a case-insensitive volume and throws for a path that does not exist yet, so existing paths are compared by device and inode, and for a path that does not exist yet the longest existing prefix is compared that way and the rest case-insensitively when a probe shows the volume folds case.

### Data Flow
The preflight classifies each entry as pending or done. `buildPlan` collects the work, `hasWork` decides between `nothing to do` and a run, `applyPlan` runs the steps in order and `closeRun` ends the run. After this phase the ledger batch records that the sweep passed, and `buildPlan` reads that record on the next run.

### Shared Contracts
The owner is `relocate.mjs`. Its callers are `archive.sh:392`, which reads the exit status, and the two suites. The contract that must not break is the exit status at lines 34 to 36: 0 for nothing left to do, 1 for work found on a dry run, 2 for a refusal or a failed step. The second contract is the ledger shape. Only `relocate.mjs` reads and writes the ledger, which T002 confirms before any field is added.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup reproduces the five findings in a `mktemp` copy, lists the ledger readers and saves the suite baseline. Implementation adds one failing case and then one fix per requirement in `relocate.mjs`. Verification reruns each induced failure in `SCRATCH`, runs the two suites and validates this folder.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The suite command is `../../node_modules/.bin/vitest run --config ../../vitest.config.ts --project cli tests/relocate.vitest.ts`, run from `runtime/cli`, and it must exit 0.

Each changed surface gets one happy-path case and one edge case, and each case fails before its fix. A stub that exits 1 on its first call and records every call stands in for the failing writer, so the assertion is on what the rerun invoked and on the exit status, not on the shape of the code. The case-spelling cases probe the temp volume first and assert the refusal only where two spellings resolve to one folder.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`node`, `git` and the vitest binary at `.skilled/skills/system-spec-kit/node_modules/.bin/vitest`. No new package. Phase 007 and phase 008 edit the same script and start after this phase is committed.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a finished map reports work on every run, or a rerun overwrites an uncommitted edit outside the folders the map moved.
- **Procedure**: revert the one commit that carries this phase. A ledger batch written with the completion mark stays readable, because the mark is an added field.
<!-- /ANCHOR:rollback -->

---
