---
title: "Feature Specification: Pre-v4 spec folder upgrade path"
description: "Spec folders written under v3.x fail the v4 validate.sh --strict almost without exception, and every /speckit workflow stops on that failure, so an upgrading user pays an AI to repair history before any new work. This packet finds and builds the path that brings those folders to a full pass without authored LLM edits."
trigger_phrases:
  - "pre-v4 spec upgrade"
  - "legacy spec folder migration"
  - "v3 spec folders fail strict validation"
  - "upgrade old spec folders"
  - "zero-token spec upgrade"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Pre-v4 spec folder upgrade path

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-09-24 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 51 of 51 |
| **Predecessor** | 050-ci-cleanup-pi-proof |
| **Successor** | None |
| **Handoff Criteria** | research/research.md names a deterministic route to a full strict pass for every residual finding class, each route checked against the harness data |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 51** of the system-speckit v4 program. It covers what an existing v3.x user's spec folders need after upgrading.

**Scope Boundary**: spec folders that already exist when a user upgrades, and the spec-kit tooling that validates and repairs them. New packets created under v4 are out of scope.

**Dependencies**:
- The v4 validator, `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh`, and its orchestrator
- The existing repair tools named in §2

**Deliverables**:
- `research/research.md`, the synthesis of the deep-research run
- The upgrade tooling that research selects, built in a later step of this phase

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Spec folders written under v3.x fail the v4 `validate.sh --strict` almost without exception. Every `/speckit:*` workflow stops on a failed post-write validation (`.skilled/commands/speckit/assets/speckit-implement.yaml:481-484`, `on_fail: "STOP and repair ... before proceeding"`), so reopening any old packet makes the AI repair its whole legacy backlog before it can do the requested work. The v4 changelog's Upgrade Notes say nothing about spec-folder contents.

Measured on 2026-09-24: real packets extracted from tags `v3.0.0.0` and `v3.6.0.0` with `git archive`, laid out as an upgraded user's repo (a `specs/` root, a `.opencode/` anchor, the current spec-kit), validated with today's `validate.sh --strict`.

| Active packets passing `--strict` | v3.0.0.0 (170) | v3.6.0.0 (1,007) |
|---|---|---|
| As upgraded | 2 | 0 |
| `repair-derived.cjs --apply` only | 74 | 592 |
| `backfill-frontmatter.js --apply`, then `repair-derived.cjs --apply` | 111 | 686 |

Archived packets (`z_archive`, `z_future`) pass 0 of 186 (v3.0) and 0 of 911 (v3.6) in every row, because both repair tools skip archives by default.

Observations from the same run:
- `memory/` folders (204 packets at v3.0) trip no rule. `checklist.md` without `acceptance-criteria.md` passes `FILE_EXISTS` and `LEVEL_MATCH`.
- Both `specs/` and `.opencode/specs/` are discovered roots (`runtime/lib/search/folder-discovery.ts:1385-1392`).
- CI blocks only regressions (`.github/workflows/changed-packet-validation.yml:114-160`). Warnings never fail strict (`runtime/lib/validation/orchestrator.ts:976`).
- `backfill-graph-metadata` exits 0 with a non-empty `failed[]`, and `repair-derived.cjs:324-330` trusts the exit code, so refused writes report `repaired=N failed=0`.
- Order matters: `backfill-frontmatter` edits source docs, which re-stales the sidecars `repair-derived` fixed first.

### Purpose
An upgrading user runs one deterministic command and every existing spec folder passes `validate.sh --strict`, with no authored LLM edits.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Research: for every residual finding class in `scratch/harness/data/`, the route to a pass without authored content, and what each route costs.
- Build: the upgrade tooling and any validator change the research selects.
- One Upgrade Notes line in the v4 changelog naming the command.

### Out of Scope
- Rewriting historical content by LLM. The goal is to make that unnecessary.
- New packets created under v4. They already follow the current contract.
- Placeholder documents and Status rewrites in historical packets. Operator decision, 2026-09-24: record those findings instead (REQ-007).
- The deep-research fan-out gap where synthesis expects a root dashboard no fan-out step writes. It belongs to a deep-loop packet.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/graph/backfill-graph-metadata.ts` | Modify | Exit non-zero when a folder fails, so `repair-derived.cjs` reports the failure without a change of its own |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs` | Create | The upgrade command (`plan.md` §3) |
| `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts` | Modify | Report a finding listed in the packet's `upgrade-baseline.json` as a warning (REQ-006) |
| `.skilled/skills/system-spec-kit/runtime/tests/upgrade-baseline.vitest.ts` | Create | Tests for the recorded-findings hook |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts` | Create | Tests for the command |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/graph-metadata-backfill.vitest.ts` | Modify | Exit-code case |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md` | Modify | Name the command |
| `.skilled/skills/system-spec-kit/changelog/v4.0.0.0.md` | Modify | Upgrade Notes line |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | One command upgrades a v3.x specs tree with no LLM call, dry-run by default |
| REQ-002 | After it runs, every active packet from `v3.0.0.0` and `v3.6.0.0` passes `validate.sh --strict` |
| REQ-003 | The command is idempotent: a second run changes nothing |
| REQ-006 | Each finding no deterministic transform clears is recorded per packet at upgrade time, keyed on rule and diagnostic. A recorded finding reports as a warning under `--strict`; any finding not recorded, including a new one in an upgraded packet, stays an error |
| REQ-007 | The upgrade creates no document and rewrites no Status field. Missing required documents and status mismatches are recorded under REQ-006 instead |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | Archived packets reach the same result when the command is asked to include them |
| REQ-005 | A repair step that fails reports failure; no step reports success for a write it did not make |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The harness in `scratch/harness/` reports 170 of 170 (v3.0) and 1,007 of 1,007 (v3.6) active packets passing after the command runs.
- **SC-002**: The count of files the command changed on its second run is zero.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A route to a pass weakens what `--strict` means for new work | High | A route is accepted only when the harness shows a new finding in an upgraded packet still fails strict |
| Risk | A mechanical rewrite changes the meaning of a historical document | Med | Rewrites limited to structure and derived fields; content bytes outside them unchanged, checked by diff |
| Dependency | The harness sandbox needs the full v3.6 tree, about 800 MB | Low | Built outside the repo under `HARNESS_SANDBOX` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The command finishes a 1,000-packet tree in under 15 minutes on an 18-core machine; the current two-tool pipeline measured about 10 minutes.
- **NFR-P02**: No step needs network access.

### Security
- **NFR-S01**: No write outside the specs roots the command was given.
- **NFR-S02**: No LLM or external service call.

### Reliability
- **NFR-R01**: A run interrupted mid-way converges to the same result when run again. Amended 2026-09-24 by operator decision, because three tools that each write their own files cannot give an all-or-nothing update per folder (`plan.md` §3).
- **NFR-R02**: The run's exit status is non-zero whenever any folder failed.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty specs root: the command reports zero packets and exits 0.
- Malformed frontmatter: reported per file, the folder left untouched, the run exit non-zero.
- Packets under `.opencode/specs/` only: discovered like `specs/`.

### Error Scenarios
- A child tool refuses a write: reported as a failure for that folder, never as repaired.
- A tree already on v4: the command changes nothing.
- A packet already passing: left byte-identical.

### State Transitions
- Partial completion: rerunning the command resumes from the current state; every step is idempotent.
- Upgrade then later edit: new findings in an upgraded packet are ordinary errors.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | About 12 files, about 900 LOC per `recommend-level.sh` |
| Risk | 15/25 | Touches validator behavior for existing packets |
| Research | 16/20 | Deep-research fan-out before any build |
| **Total** | **46/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

These are the research questions for the deep-research run. Evidence to test answers against: `scratch/harness/data/v3.0.0.0.final.jsonl` and `scratch/harness/data/v3.6.0.0.pipeline.jsonl`, one JSON line per packet after the two-tool pipeline, with `failing` rule ids and up to three `details` per rule. `scratch/harness/classify.cjs <file> <label>` and `agg.cjs <file>` summarize them. `fullrun.sh <tag>` and `bf-pipeline.sh <tag>` rebuild a sandbox under `HARNESS_SANDBOX`.

- For each residual rule in the data (`ANCHORS_VALID`, `GREP_CONVENTION`, `GENERATED_METADATA_INTEGRITY`, `STATUS_CROSS_DOC_CONSISTENCY`, `LEVEL_MATCH`, `FILE_EXISTS`, `FRONTMATTER_MEMORY_BLOCK`, `TEMPLATE_SOURCE`, `SCAFFOLD_NEVER_TOUCHED`, `METADATA_DISK_PATH_CONSISTENCY`, `FOLDER_NAMING`, `SPEC_DOC_INTEGRITY`, `SPEC_DOC_SUFFICIENCY`, `AI_PROTOCOLS`, `TOC_POLICY`, `CANONICAL_SAVE_LINEAGE_REQUIRED`), what deterministic transformation or validator policy makes the packet pass without authored content, and what does each cost?
- Which residual findings are artifacts of v4 rules applied to documents the v3 templates never required, and which are defects the documents had under v3 as well?
- Where no transformation is safe, what is the least validator change that lets the packet pass while keeping every new finding an error?
- Why do the two repair tools skip archived packets, and what breaks if the upgrade includes them?
- In what order must the steps run so no step undoes an earlier one, and how is idempotence proven?

<!-- BEGIN GENERATED: deep-research/spec-findings -->
Findings from `research/research.md` (two lineages, five iterations each):

- **Routes.** Twenty rule classes fail somewhere in the data. Sixteen have a deterministic route for at least part of their instances. Four families have no safe transform: legacy folder names, unresolvable links, empty sections, trigger-phrase quality.
- **Projection.** Widened transforms reach about 138 of 170 (v3.0) and 927 of 1,007 (v3.6) active packets. This is an estimate from details capped at three per rule, not a measurement.
- **Policy.** Both lineages chose a per-finding list written at upgrade time: a recorded finding reports as a warning, any other finding stays an error. The operator chose the wider scope, which records inherited defects too, and chose recording over placeholder documents and Status rewrites (REQ-006, REQ-007).
- **Order.** All document edits run before derivation, because each source edit stales a stored fingerprint. No step is judged by its exit code, since graph backfill exits 0 with failures.
- **Idempotence.** Proven by a report-mode rerun planning zero edits and an identical path-and-hash tree manifest across two runs.
- **Archives.** `z_archive` and `z_future` are counted separately and left read-only by default. Archive snapshots keep their old recorded location on purpose.
- **Refuted.** The claim that v3.0 command assets emitted no anchor markers. They did, so a document with no anchors is a defect in either era.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---
