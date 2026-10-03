---
title: "Feature Specification: Phase 2: release-update-customization-signals"
description: "The release-aware update engine reads a locally regenerated file as an authored customization, cannot record a base for a copied .skilled/ tree, and leaves four policy questions open. This phase plans the engine changes, the base-recording step and the measurement that grounds the generated-file inventory."
trigger_phrases:
  - "release update customization"
  - "generated file classification"
  - "base manifest recording"
  - "provenance fingerprint prefilter"
  - "prerelease policy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 2: release-update-customization-signals

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

The release-aware updater classifies every file by comparing base, local and release blobs, so a file this repository regenerates locally — a `graph-metadata.json` derived block, a leaf manifest, a mode registry — differs from its release copy and is reported as a local customization. This phase plans a generated-file class that is regenerated after apply rather than merged, a base-recording step so a first run on a copied `.skilled/` reports `recorded` instead of inferring, the recorded evaluation of `provenance_fingerprint` as a pre-filter, an explicit prerelease policy, and apply without an alignment run when only update and new units need writes.

**Key Decisions**: Generated files become their own class and are regenerated after apply, never merged; the base is recorded at install or first run by an explicit engine action; the `provenance_fingerprint` hash input is now read from `provenance.ts` and is evaluated as a pre-filter with a recorded decision.

**Critical Dependencies**: The generator scripts that own each generated artifact; the engine's disposable-repository test harness; the update workflow assets that document the policy.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-10-03 |
| **Branch** | `worktrees/079-doctor-command-audit` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 3 |
| **Predecessor** | 001-trigger-index-freshness |
| **Successor** | 003-doctor-gates-and-drift |
| **Handoff Criteria** | Every acceptance criterion is Met, Waived or Superseded, and the engine suite reports zero failures |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Fix the spec-kit defects the doctor command audit recorded specification.

**Scope Boundary**: The release-update engine, its test suite, and the `/doctor:update` workflow text that documents its policy. The engine's subcommands, file classes, base resolution and refusal rules are in scope; the doctor commands around it are not.

**Dependencies**:
- The generator scripts that own each generated artifact, so the classifier's inventory comes from the writers, not from a guess.
- The engine's disposable-repository test harness, which builds fixture upstreams and clones for every case.
- A read-only `check --json` run for the generated-only measurement; it writes nothing.

**Deliverables**:
- A generated-file class and its regenerate-after-apply handling, covered by tests.
- A base-recording action so a copied `.skilled/` reports `baseSource: recorded`, plus the workflow text that invokes it.
- A recorded decision on `provenance_fingerprint` as a pre-filter, naming its exact hash input.
- An explicit prerelease policy with an opt-in, and apply without an alignment run for update-only or new units.
- The generated-only measurement over the 54 local units, recorded with its method.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`release-update.cjs` compares base, local and release blobs per file and derives a unit status from the resulting classes. A generated file that this repository regenerated locally differs from its release copy, so it lands as `local-only` and turns its unit into `customized` or `local` even though no author edited it. The planning read-only check reports 54 local units and 2,469 local-only files among them, including `graph-metadata.json` (4), `leaf-manifest.json` (6), `mode-registry.json` (6), `hub-router.json` (5), `manifest.json` (7) and `description.json` (5); the classification that separates those from authored edits is the missing piece. Separately, `baseForUnit` (`release-update.cjs:595-630`) supports `recorded`, `ancestry`, `inferred` and `none`, but nothing records a base at install time, so a copied `.skilled/` tree must infer. The `provenance_fingerprint` hash input was never read (`provenance.ts:95-116` now answers it), the prerelease rule is only "excluded unless named" (`release-update.cjs:20,144,285-296`), and `apply` refuses without an alignment run even when only `update` or `new` units need writes (`release-update.cjs:1394`; `048/003-update` limitation 1).

### Purpose
Make the updater tell generated files from authored ones and regenerate the former after apply, record its base at install so a copied tree starts from evidence, settle the three open policy questions with recorded decisions, and let a plain update-only apply proceed without an alignment run.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A generated-file classifier and a `regenerate` treatment that runs after apply, sourced from the generator scripts that write each artifact.
- A base-recording engine action plus the workflow text that tells an operator to run it after copying or installing `.skilled/`.
- The `provenance_fingerprint` evaluation: its hash input, whether it can pre-filter customization, and the recorded decision.
- An explicit prerelease policy with an opt-in flag and tests for numeric ordering.
- Apply without an alignment run when the plan carries no decisions, with the drift re-check moved to write time.
- A read-only measurement of how many of the 54 local units are generated-only.

### Out of Scope
- Changing the release-resolution data source (tags and GitHub releases stay the oracle).
- Reworking the align/decide/apply split or the divergence ledger's location.
- Exercising apply on the live checkout: the engine's write paths stay covered by disposable fixtures.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/release-update.cjs` | Modify | Generated class, base recording, prerelease opt-in, apply-without-align |
| `.skilled/commands/doctor/scripts/tests/release-update.test.cjs` | Modify | One case per engine change |
| `.skilled/commands/doctor/update.md` | Modify | First-run base recording and the settled policy text |
| `.skilled/commands/doctor/assets/doctor-update-check.yaml` | Modify | Report `baseSource` and name the recording action |
| `.skilled/commands/doctor/assets/doctor-update-apply.yaml` | Modify | Update-only apply path without an alignment run |
| `.skilled/commands/doctor/assets/doctor-update-presentation.txt` | Modify | Operator-facing text for the new action and policy |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The engine classifies generated files (a `graph-metadata.json` derived block, generated manifests) separately from authored files, excludes them from customization status, and schedules them for regeneration after apply |
| REQ-002 | An explicit engine action records the base manifest for every unit, so a copied `.skilled/` reports `baseSource: recorded` on its first check |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | `provenance_fingerprint`'s hash input is documented from `provenance.ts` and its use as a customization pre-filter is evaluated in a recorded decision |
| REQ-004 | The prerelease policy is explicit: default latest-upstream resolution excludes prereleases, and an opt-in flag includes them with numeric ordering |
| REQ-005 | `apply` proceeds without an alignment run when only `update` or `new` units need writes, re-verifying the base at write time; decided files still require a run |

### P2 - Optional

| ID | Requirement |
|----|-------------|
| REQ-006 | The read-only `check --json` measurement of how many of the 54 local units are generated-only is recorded with its method and used to seed the classifier inventory |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test .skilled/commands/doctor/scripts/tests/release-update.test.cjs` reports zero failures, including a case where a locally regenerated generated file leaves its unit in an update status rather than a customized one.
- **SC-002**: A copied-tree fixture's first check reports `baseSource: recorded` after the base-recording action, with no inference pass.
- **SC-003**: The phase's `scratch/` evidence records the generated-only count over the 54 local units, the command that produced it, and the classifier rule used.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Generator scripts as the classifier source | A missed writer leaves a generated file misclassified | Walk every generator's output paths and record the inventory in `scratch/` |
| Risk | A generated file with local content is silently regenerated | Local content loss | Generated files are reported, never merged; regeneration happens only after authored decisions, and the report names each regenerated path |
| Risk | Apply without align weakens the drift guard | A changed file is overwritten | Re-verify base blobs at write time and refuse on mismatch |
| Risk | Prerelease opt-in changes default resolution | Unexpected version jumps | Default stays exclusion; the flag is opt-in and tested |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `check` stays one git walk plus one optional network read; the classifier adds no process spawn per file.

### Security
- **NFR-S01**: No new network write beyond the existing single fetch of a named tag; the lock and rollback disciplines are unchanged.

### Reliability
- **NFR-R01**: Every new refusal path exits 1 with a named reason, and every new action releases the apply lock on all terminal paths.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: a `.skilled/` tree with no units reports no units and no base records; recording writes an empty manifest rather than failing.
- Maximum length: the classifier walks tracked files only; untracked files stay untouched.

### Error Scenarios
- External service failure: an unreachable remote reports `upstream: unknown`, never "up to date".
- Network timeout: `--offline` skips the network entirely and records `unknown`; the base-recording action works offline.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Files: 6, LOC: ~300, Systems: 1 (release engine) |
| Risk | 12/25 | Auth: N, API: N, Breaking: N (defaults preserved) |
| Research | 12/20 | The hash input was read; the generated inventory needs a writer walk |
| Multi-Agent | 4/15 | Workstreams: 1 |
| Coordination | 8/15 | Dependencies: generator scripts, workflow assets, test harness |
| **Total** | **54/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Classifier false positive on an authored file | H | L | Derive the inventory from writers, and treat any file with an authored edit as a conflict, not a regeneration |
| R-002 | Base recording writes a wrong release identity | M | L | Record from the release the tree was copied from; refuse when it cannot be named |
| R-003 | Provenance pre-filter misreads a regenerated file as customized | L | M | The evaluation decision must state its evidence and default to not filtering when unsure |

---

## 11. USER STORIES

### US-001: A consumer updating a vendored tree (Priority: P0)

**As a** consumer who copied `.skilled/` into a project, **I want** the updater to treat regenerated artifacts as regenerated and to know its base, **so that** an update does not report my tree as customized where only the generators ran.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: A maintainer reading a check report (Priority: P1)

**As a** maintainer, **I want** the prerelease rule and the apply-without-align path stated and tested, **so that** I can predict what a bare update run will do before I run it.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- Is the generated-file inventory a path allowlist or a content-marker rule? The build decides from the writers' output shapes and records the rule in `scratch/`.
- Is base recording a new subcommand or an `align` flag? The build decides by fitting it to the existing option parser and the update router's action map.
- Can the `provenance_fingerprint` pre-filter work on a checkout with no git history? The evaluation decision answers this with a fixture.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`

---


