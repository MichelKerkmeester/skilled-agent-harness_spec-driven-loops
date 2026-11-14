---
title: "Feature Specification: Phase 3: runtime-council-removal"
description: "The shared deep-loop runtime carries a council loop type, nine council library files, three council ledger, reducer and sealed-artifact libraries and council members in shared libraries, while the divergent pivot reads only one of those files. This child removes the council code the pivot does not read and keeps the pivot working."
trigger_phrases:
  - "runtime council removal"
  - "phase 3 runtime council removal"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 3: runtime-council-removal

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-14 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 5 |
| **Predecessor** | 002-hub-two-mode-wiring |
| **Successor** | 004-advisor-council-removal |
| **Handoff Criteria** | Child 004 starts when the divergent pivot tests, `npm test` and `npm run typecheck` in the deep-loop runtime exit 0, and `ls .skilled/skills/system-deep-loop/runtime/lib/council` lists only `README.md` and `multi-seat-dispatch.cjs`. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the ai-council mode deprecation, which retires `ai-council` as a `system-deep-loop` mode and keeps the council as a standalone agent.

**Scope Boundary**: `.skilled/skills/system-deep-loop/runtime/` council libraries, scripts, tests, catalog and playbook entries, plus the council scope in the doctor deep-loop workflow. The divergent pivot logic, `multi-seat-dispatch.cjs`, its test and the `pathContainsAiCouncil` guard stay.

**Dependencies**:
- Child 002 is Complete, so no hub surface or command names the `council` loop type.
- Parent decision D4: the divergent Council pivot keeps working.

**Deliverables**:
- `runtime/lib/council/` holding only `multi-seat-dispatch.cjs` and a rewritten `README.md`.
- No `council` loop type in `convergence.cjs`, `upsert.cjs`, `query.cjs`, `status.cjs` or the append gateway.
- The deep-loop runtime suite and typecheck green on the final tree of this child.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The runtime still accepts `--loop-type council` and ships nine files in `runtime/lib/council/`, three `deep-ai-council-*` libraries and council members in nine shared libraries. Once the mode is gone nothing calls that code except the divergent pivot, which reads exactly one file, `multi-seat-dispatch.cjs`. Dead code that still passes its own tests hides the fact that no caller remains.

### Purpose
The runtime holds only the council code the divergent pivot reads, and its suite and typecheck pass.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Read-only command and its verbatim output:

```text
$ ls .skilled/skills/system-deep-loop/runtime/lib/council; rg -l -i 'council' .skilled/skills/system-deep-loop/runtime -g '!node_modules' | wc -l; rg -n "require\('\.\./council/" .skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts; ls -d .skilled/skills/system-deep-loop/runtime/lib/deep-ai-council-*; ls .skilled/skills/system-deep-loop/runtime/tests/council | wc -l
adjudicator-verdict-scoring.cjs
convergence.cjs
cost-guards.cjs
council-graph-db.ts
council-graph-query.ts
multi-seat-dispatch.cjs
README.md
round-state-jsonl.cjs
session-state-hierarchy.cjs
     144
273:const { dispatchCouncilSeats } = require('../council/multi-seat-dispatch.cjs') as {
.skilled/skills/system-deep-loop/runtime/lib/deep-ai-council-ledger-schema
.skilled/skills/system-deep-loop/runtime/lib/deep-ai-council-reducers
.skilled/skills/system-deep-loop/runtime/lib/deep-ai-council-sealed-artifacts
       6
```

Run from the repository root at `81faa4614c` on 2026-11-14. `runtime/lib/council/` holds 9 entries. 144 runtime files name `council`, and that count includes the pivot. The divergent pivot reads exactly one council file. Three `deep-ai-council-*` libraries exist. `tests/council/` holds 6 entries.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Delete the seven council library files the pivot does not read and rewrite the folder readme for the one kept file.
- Delete the three `deep-ai-council-*` libraries and the legacy council contract.
- Remove the `council` loop type from `convergence.cjs`, the council paths from `upsert.cjs`, `query.cjs` and `status.cjs`, and the council cases from the append gateway.
- Remove the council member from each shared library and keep the library.
- Delete the tests of removed code, the council catalog and playbook folders and the council scope in the doctor deep-loop workflow.

### Out of Scope
- The divergent pivot logic in `runtime/lib/deep-loop/divergent-pivot.ts`, including its `ai-council` path guard - parent decision D4 keeps it.
- The pivot comments in `scripts/fanout-pool.cjs` and `deep-research-ledger-types.ts` - they are pivot vocabulary, not the mode.
- Untracked council graph databases on disk - this child never deletes an untracked file.
- Advisor entries and callers in other skills - children 004 and 005 own them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/lib/council/` | Delete/Modify | Seven files deleted, readme rewritten, `multi-seat-dispatch.cjs` kept |
| `runtime/lib/deep-ai-council-ledger-schema/`, `deep-ai-council-reducers/`, `deep-ai-council-sealed-artifacts/`, `legacy-projections/deep-ai-council-config-state-contract.ts` | Delete | No caller remains |
| `runtime/scripts/convergence.cjs`, `upsert.cjs`, `query.cjs`, `status.cjs`, `append-mode-event.cjs`, `lib/mode-append-gateway/` | Modify | No `council` loop type or mode case |
| Nine shared libraries listed in the `plan.md` D4 table | Modify | Council member removed, library kept |
| `runtime/tests/` | Delete/Modify | Tests of removed code deleted, council cases dropped from shared tests |
| `runtime/feature-catalog/council/`, `runtime/manual-testing-playbook/council/` and their index rows | Delete/Modify | Only multi-seat dispatch entries stay |
| `.skilled/commands/doctor/assets/doctor-deep-loop.yaml` and its presentation file | Modify | No `--scope=council` input |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids come from the requirement list this phase had before it was split, so a requirement keeps its id in the child that owns it. Ids from REQ-018 up were added at the split. A new requirement takes the highest REQ id across the five children plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-006 | D4: `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/integration/divergent-pivot.vitest.ts tests/council/multi-seat-dispatch.vitest.ts` exits 0 on the final tree. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-011 | D4: `git ls-files .skilled/skills/system-deep-loop/deep-ai-council .skilled/skills/system-deep-loop/runtime/lib/deep-ai-council-ledger-schema .skilled/skills/system-deep-loop/runtime/lib/deep-ai-council-reducers .skilled/skills/system-deep-loop/runtime/lib/deep-ai-council-sealed-artifacts` prints nothing, and `ls .skilled/skills/system-deep-loop/runtime/lib/council` lists only `multi-seat-dispatch.cjs` and `README.md`. |
| REQ-012 | D4: each removed runtime file has a caller check in `tasks.md`, and the combined check prints nothing outside changelogs and benchmark reports on the final tree. |
| REQ-013 | D4: `node .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` with `--spec-folder`, `--session-id` and `--loop-type council` prints an `INPUT_VALIDATION` error starting `loopType must be` that no longer names `council`, and the full runtime suite `cd .skilled/skills/system-deep-loop/runtime && npm test` and `npm run typecheck` exit 0. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-003**: The divergent pivot tests and the full deep-loop runtime suite exit 0 on the final tree of this child.
- **SC-009**: `ls .skilled/skills/system-deep-loop/runtime/lib/council` lists only `README.md` and `multi-seat-dispatch.cjs`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Child 002 at Status Complete | A hub surface or command that still names the `council` loop type fails once the type is gone. | The setup task T096 checks the status before any edit. |
| Risk | A removed file still has a live caller | High: a research or review run fails at load time | Each removal task carries a caller check that must print nothing, and `npm run typecheck` runs after the shared library edits. |
| Risk | Removing a council member from a shared library changes a research or review entry | Med: a silent behavior change in a kept mode | Each shared library keeps its research and review tests, and the full suite runs against the start baseline. |
| Risk | The divergent pivot breaks, because a deleted file was in its import closure | High: research and review lose the pivot | The closure was walked and reaches one council file. REQ-006 runs the pivot tests on the final tree. |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The runtime suite takes no longer than its start-commit duration, recorded in `../scratch/gate-baseline.md`, since this child only removes tests.

### Security
- **NFR-S01**: N/A: no security, path, parser or redaction logic changes. The `pathContainsAiCouncil` guard stays as it is.

### Reliability
- **NFR-R01**: The deep-loop runtime suite ends with 0 failed tests, as at the start commit, with the passed and skipped counts logged beside the baseline.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: `convergence.cjs` run with no `--loop-type` still reports its usual input error for the missing argument.
- Maximum input: all 144 runtime files that name `council` end as deleted, edited or kept by a named row of the D4 table.
- Failure path: `convergence.cjs --loop-type council` exits with an `INPUT_VALIDATION` error starting `loopType must be` that does not name `council`, instead of loading a deleted module.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | 144 runtime files name `council`. Three libraries and seven files are deleted, and nine shared libraries are edited. |
| Risk | 16/25 | Shared runtime libraries that research and review also use. The divergent pivot must keep working. |
| Research | 8/20 | Each shared library edit needs the file read at implementation time. |
| **Total** | **44/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
