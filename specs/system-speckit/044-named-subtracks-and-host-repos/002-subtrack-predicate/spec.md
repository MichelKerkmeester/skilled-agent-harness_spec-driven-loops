---
title: "Feature Specification: Phase 2: subtrack-predicate"
description: "The question 'is this folder a declared sub-track' has several copies that disagree on the numbered-name pattern, a symlinked description.json and hidden folders, so one folder can be a packet to the sweep and a container to validation. This phase plans one agreed rule, enforced by a parity test."
trigger_phrases:
  - "subtrack predicate"
  - "phase 2 subtrack predicate"
  - "declared sub-track rule parity"
  - "validate symlinked description sub-track"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 2: subtrack-predicate

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-07 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 5 |
| **Predecessor** | 001-create-track-fixes |
| **Successor** | 003-metadata-write-safety |
| **Handoff Criteria** | The parity test passes for every consumer in the matrix, the 044 `implementation-summary.md` row at line 101 states what is true, and the baseline totals in `scratch/baseline.txt` still pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the 044 remediation. The parent, `specs/system-speckit/044-named-subtracks-and-host-repos`, shipped sub-track support in several tools at once, and its deep review found that they do not judge a sub-track the same way (P2-1, P2-2, P2-8 in `../review/p2-verification.md`).

**Scope Boundary**: The declared-sub-track predicate and the symlink and name rules it applies, in validation, archive, parent derivation and repair. The metadata write paths are phase 003.

**Dependencies**:
- Phase 001, because `create.sh`'s own check (`is_declared_subtrack`, `create.sh:1026`) already asks the reader, and the parity test uses it as the reference answer.
- The sub-track fixture builder `runtime/cli/tests/fixtures/subtrack-tree.mjs`.

**Deliverables**:
- One rule set, written down once and checked by one parity test across every consumer.
- Validation that refuses a symlinked `description.json` and a symlinked numbered packet inside a sub-track.
- A corrected `implementation-summary.md:101`, and optionally a precise diagnostic for a declared sub-track that holds `spec.md` (P2-7).
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Six implementations answer the declared-sub-track question: the reader (`runtime/cli/lib/track-roots.mjs:28-46,76-78`), `validate.sh:188-217`, `orchestrator.ts:213-240`, `archive.sh:193-213`, `graph-metadata-parser.ts:854-873` and `repair-derived.cjs:321-341`. They differ on the numbered-name pattern, on whether a symlinked `description.json` counts, and on hidden and `node_modules` exclusions (P2-1). With `trk/001_odd` declared, the sweep calls it a packet while `validate.sh` calls it a container. Validation accepts a symlinked `description.json` that the reader refuses (P2-2), and recursive validation follows a symlinked numbered packet inside a sub-track that the reader skips (P2-8). `implementation-summary.md:101` says every copy uses "the exact word and the same location rules", which is false.

### Purpose
Every consumer gives the reader's answer for the same folder, and a test fails when one of them drifts.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
# Observed 2026-11-07 in a scratch workspace: the 044 fixture tree, then specs/demo/sub2/description.json made a symlink to a file outside specs/ that holds {"level":"sub-track","specFolder":"demo/sub2"}.
$ node .skilled/skills/system-spec-kit/runtime/cli/spec/sweep-track-roots.mjs --specs specs 2>&1 | grep sub2
demo/sub2: undeclared folder ignored
$ bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/demo/sub2 --strict
Summary: Errors: 0  Warnings: 0
RESULT: PASSED
```
The P2-1 name-pattern split (`001_odd`) and the P2-8 symlinked packet were reproduced by the P2 verifier and are quoted from `../review/p2-verification.md`, not rerun here.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Align the numbered-name pattern, the symlinked-description refusal and the hidden and `node_modules` exclusions across the consumers (P2-1, P2-2).
- Make recursive validation skip a symlinked numbered packet inside a declared sub-track (P2-8).
- Add one parity test over a shared case matrix, including `create.sh`'s reader-backed check as the reference (P2-1).
- Correct `implementation-summary.md:101` (P2-1).
- Optional, P3: give a declared sub-track that holds `spec.md` its own diagnostic (P2-7).

### Out of Scope
- A moved packet keeping its old sub-track `parent_id` - verified as by design in `p2-verification.md` row P2-6, so no work.
- The top-level numbered-packet glob in `validate.sh` - same pattern as P2-8, but flat tracks must behave as before; D-002b records it as adjacent and unfixed unless the operator says otherwise.
- The metadata write paths and the pre-push repair - phase 003 owns them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh` | Modify | `has_subtrack_declaration` (`:197-217`) and the sub-track packet loop (`:~377`) |
| `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts` | Modify | `isDeclaredSubTrack` and `hasSubTrackLevel` (`:213-240`); rebuild `runtime/dist` |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh` | Modify | `is_declared_subtrack` (`:193-213`) |
| `.skilled/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts`, `.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs` | Modify if the matrix shows divergence | `isDeclaredSubtrackFolder` (`:854-873`), `declaresSubtrack` (`:321-341`) |
| `.skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs` | Modify, optional | Split the two causes behind `undeclared folder ignored` (`:146`, `:253`) for P2-7 |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/subtrack-predicate-parity.vitest.ts` | Create | The one cross-consumer test; no existing file's subject owns it |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/validate-subtrack.vitest.ts`, `track-roots.vitest.ts` | Modify | Red cases for P2-2, P2-8 and optionally P2-7 |
| `specs/system-speckit/044-named-subtracks-and-host-repos/implementation-summary.md` | Modify | Line 101 only |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | P2-1: every consumer answers the declared-sub-track question as the reader does, on the three differing axes (numbered-name pattern, symlinked `description.json`, hidden and `node_modules` folders) | `subtrack-predicate-parity.vitest.ts` runs one case matrix (`001-odd`, `001_odd`, `.hidden`, `node_modules`, `z_old`, symlinked description, symlinked folder, folder with `spec.md`) and every consumer matches the reader on every case |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | P2-2: validation refuses a symlinked `description.json` as a declaration (`validate.sh:200-203`, `orchestrator.ts:226-236`) | In the Measured Behavior tree, `validate.sh specs/demo/sub2 --strict` no longer prints `RESULT: PASSED` as a container, and the sweep still prints `undeclared folder ignored` |
| REQ-003 | P2-8: recursive validation skips a symlinked numbered packet inside a declared sub-track (`validate.sh:~377`), as the reader's `Dirent.isDirectory()` does | `validate.sh specs/demo --recursive` on a tree with `demo/sub/002-linked` symlinked outside `specs/` does not list it |
| REQ-004 | `implementation-summary.md:101` states what is true after REQ-001 | `rg -n 'exact word and the same location rules' implementation-summary.md` prints nothing, and the replacement row names the parity test |
| REQ-005 | Flat tracks behave as before | The seven test files in `plan.md` section 5 pass against the baseline |
| REQ-006 | Optional, P3, P2-7: a declared sub-track that holds `spec.md` gets a diagnostic that says so, not `undeclared folder ignored` (`track-roots.mjs:146,253`) | A `track-roots.vitest.ts` case reads the distinct message in both views; the diagnostic stays advisory |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The two Measured Behavior commands, rerun after the fix, give the same answer: the sweep and `validate.sh` both treat `demo/sub2` as undeclared.
- **SC-002**: The packet test set in `plan.md` section 5 passes with zero failures, against the baseline taken before the first change.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `runtime/dist` is compiled from `orchestrator.ts` and `validate.sh` refuses a stale build | Med: validation will not run | `npm run build` in `runtime/` after each TypeScript change |
| Risk | Narrowing validation's name pattern or adding hidden-folder exclusions changes what an existing repository validates | Med: a push that passed could fail | The parity matrix is written from the reader's rules, which the sweep already enforces on every push, so the change moves validation toward the gate that already runs; T002 records the operator's answer first |
| Risk | The orchestrator, parser and repair copies are TypeScript and CommonJS and cannot all call the ESM reader directly | Low: forces D-002a | D-002a below |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **D-002a (operator decision): where the rule lives.**
  - Option A, align and test (recommended): keep each consumer's own predicate, bring the three differing axes into line with the reader, and let the parity test fail when one drifts. It is the smallest change that makes `implementation-summary.md:101` true, and it needs no new cross-language module.
  - Option B, ask the reader: every consumer calls `track-roots.mjs`, as `create.sh:1026` already does through a node call. It removes the copies, and it adds a node spawn per check in bash and an ESM import path for the TypeScript and CommonJS consumers.
  - Status: answered. Decided 2026-11-07 by operator: Option A, align and test. Each consumer keeps its predicate, and the parity test enforces the reader's rules.
- **D-002b (operator decision): P2-8 on the top-level glob.** `validate.sh` uses the same glob and `[[ -d ]]` test for a flat track's numbered packets. Recommended: fix the sub-track loop only, and name the flat-track loop as an adjacent defect, because the parent requires flat tracks to behave as before. Option B fixes both loops and accepts that a symlinked packet in a flat track stops validating.
  - Status: answered. Decided 2026-11-07 by operator: Option A, fix the sub-track loop only and keep the flat-track loop unchanged.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent**: `../spec.md`
- **Plan**: `plan.md`
- **Tasks**: `tasks.md`
- **Evidence**: `../review/review-report.md`, `../review/p2-verification.md`
