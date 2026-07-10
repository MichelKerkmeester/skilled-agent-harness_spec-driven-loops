---
title: "Feature Specification: B1 Scheduled DQ Sweep [template:level_2/spec.md]"
description: "The eight shipped CI workflows are all on pull_request with paths filters so a corpus-wide data-quality check never runs on a timer or on demand. No standing sweep catches path-filter escapes, backfill blind spots, or cross-surface coherence drift."
trigger_phrases:
  - "scheduled dq sweep"
  - "data quality sweep"
  - "github actions schedule"
  - "post-merge hook"
  - "guarded auto-fix"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/002-spec-data-quality/002-retroactive-automation/011-scheduled-dq-sweep"
    last_updated_at: "2026-06-27T17:15:35.490Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored B1 scheduled DQ sweep spec from research synthesis"
    next_safe_action: "Author plan.md and tasks.md for the sweep build"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: B1 Scheduled DQ Sweep

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-06-21 |
| **Branch** | `011-scheduled-dq-sweep` |
| **Verdict** | GO-on-cost (Tier B keystone) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The eight shipped CI workflows are all `on: pull_request` with `paths:` filters, and a grep for `schedule:` or `cron:` across `.github/workflows/` returns empty, so no data-quality check runs on a timer or on demand. The change-triggered tiers are blind to three escape classes: a defect in a file the `paths:` filter never matched, a backfill blind spot a one-shot migration left behind, and cross-surface coherence drift between a spec doc and its JSONs that no single-file gate sees.

### Purpose
A standing scheduled sweep, a thin fan-out over the A1 detectors plus `validate.sh --json`, runs the whole corpus on a timer and on demand, reports in CI, and applies only safe-class fixes under an operator-local flag.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A new sweep entrypoint `scripts/sweep/dq-sweep.ts` that fans out over the A1 detector set plus `validate.sh --json` across the corpus, report-only by default.
- A new `.github/workflows/dq-corpus-sweep.yml` with a `schedule:` trigger plus `workflow_dispatch`, running report-only and never committing.
- An opt-in `post-merge` git hook wired by the existing globbing hook installer with no installer change.
- A guarded `--apply` mode that runs operator-local only, applies safe-class fixes only, batched and git-tracked.
- Reuse of the `backfill-frontmatter.ts` dry-run, idempotency, and `--roots` contract for the apply path.

### Out of Scope
- The shared safe-fix engine and detector registry - owned by 026-shared-safe-fix-engine, consumed here.
- The interactive `/doctor data-quality` front door - that is B2, a sibling front door over the same engine.
- Any retrieval-class detector - those are Tier C and gated on 015-prodmode-recall-gate.
- CI auto-commit of any fix - permanently excluded, the corpus-wide blast radius is the reason.
- Any new scoring logic - the sweep calls the shipped scorers verbatim.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/scripts/sweep/dq-sweep.ts` | Create | Fan-out caller over the A1 detectors plus `validate.sh --json`, report and guarded apply modes |
| `.github/workflows/dq-corpus-sweep.yml` | Create | Scheduled plus `workflow_dispatch` report-only sweep workflow |
| Git hook installer wiring | Modify | Register an opt-in `post-merge` hook via the existing globbing installer |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | When the sweep runs in CI, the system SHALL report defects and never write to the corpus or commit. | Workflow run on a dirty scratch packet exits non-zero with findings and the git working tree is clean afterward. |
| REQ-002 | When the sweep runs with `--apply` locally, the system SHALL apply only fixes whose `fixClass` is `safe`. | Apply run on a fixture with a mixed safe and risky defect set mutates only the safe-class targets, leaving risky and none-class untouched. |
| REQ-003 | While applying, the system SHALL honor the `backfill-frontmatter.ts` idempotency guard so a second apply on a fixed corpus is a no-op. | Two consecutive `--apply` runs on the same corpus produce an empty diff on the second run. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The workflow SHALL trigger on a `schedule:` cron and on `workflow_dispatch`. | The workflow file declares both triggers and a manual dispatch produces a run. |
| REQ-005 | When invoked, the sweep SHALL accept the `--roots` contract so an operator can scope it. | A `--roots .opencode/specs` run inspects only that subtree. |
| REQ-006 | The system SHALL provide an opt-in `post-merge` hook installed by the existing globbing installer. | The hook fires the report-only sweep after a merge and requires no installer code change to register. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The first scheduled run finds at least one defect in each of the three escape classes (path-filter escapes, backfill blind spots, cross-surface coherence) that the change-triggered tiers demonstrably missed. If it finds nothing they missed, the sweep is downgraded to on-demand.
- **SC-002**: An operator-local `--apply` run applies safe-class fixes batched and git-tracked, and a corrupted scratch packet flips back to clean after one apply.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 026-shared-safe-fix-engine | The sweep is a thin fan-out and has no engine, registry, or `fixClass` of its own to call | Build the sweep after the engine and registry land, consuming them verbatim |
| Dependency | `backfill-frontmatter.ts` dry-run and `--roots` contract | The apply path reuses its idempotency and scoping | Call the shipped contract, add no parallel write path |
| Risk | CI auto-applying a fix | Corpus-wide blast radius on a git-tracked artifact | CI stays report-only, apply is operator-local only, no commit step in the workflow |
| Risk | A scheduled sweep that finds nothing the change-triggered tiers missed | Standing infra with no demonstrated value | The measurement plan downgrades it to on-demand if the first run finds no escape-class defect |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The sweep is a fan-out caller over existing detectors, so a full-corpus report run completes within a single CI job wall clock without a custom runner.
- **NFR-P02**: The apply path is batched, not per-file, to keep the git diff reviewable in one pass.

### Security
- **NFR-S01**: The CI job has no write credential to the repo and no commit step, so a report run cannot mutate the corpus.

### Reliability
- **NFR-R01**: A second apply on a fixed corpus is a no-op, guarded by the content_hash idempotency the engine carries.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty corpus subtree: a `--roots` path with no spec folders reports zero findings and exits clean.
- A packet missing `description.json` or `graph-metadata.json`: the sweep flags it as a finding, it does not generate the file.
- A fixClass not in the safe allow-list: apply skips it and records it as a suggest-only or advisory row.

### Error Scenarios
- `validate.sh --json` returns malformed output: the sweep surfaces the raw failure and exits non-zero rather than swallowing it.
- A detector throws on one target: the sweep records the target as errored and continues the fan-out over the rest.
- `--apply` on a read-only filesystem: the apply aborts before the first write and reports the cause.

### State Transitions
- Partial apply interrupted mid-batch: the content_hash idempotency makes a re-run resume safely with no double-apply.
- A safe fix that the engine later reclassifies as risky: the frozen allow-list is the single gate, so the sweep stops applying it the moment the registry edit lands.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | One new script, one new workflow, one opt-in hook, all thin over shipped machinery |
| Risk | 14/25 | Guarded mutation on git-tracked docs, mitigated by report-only CI and safe-class-only apply |
| Research | 6/20 | Seams verified to file:line, the engine dependency carries the open design |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 7. CONCRETE CHANGE AND SEAMS

The exact seams, verified to file:line against the live tree.

- `scripts/sweep/dq-sweep.ts` is the new fan-out entrypoint. It iterates the A1 detector set from the shared registry, runs each detector in report mode, and folds in `validate.sh --json` over the same corpus. In apply mode it executes only `fix()` for detectors whose `fixClass` is `safe`.
- `.github/workflows/dq-corpus-sweep.yml` is the new workflow with `schedule:` plus `workflow_dispatch`. The empty grep for `schedule:` and `cron:` across the eight shipped `pull_request`-only workflows (`.github/workflows/*.yml`) confirms this is the one empirically empty timing tier.
- The opt-in `post-merge` hook is wired by the existing globbing hook installer with no installer change, matching the research note that the installer already globs hook files.
- The apply path reuses `backfill-frontmatter.ts` verbatim: its `--dry-run` default, `--apply` flag, `--roots` comma-separated scoping, and `mode: 'dry-run' | 'apply'` contract (`backfill-frontmatter.ts:131-143,152-235,429`) carry the idempotency and scoping so the sweep adds no parallel write path.

## 8. DEPENDENCIES AND VERDICT

- **Depends on 026-shared-safe-fix-engine**: B1 shares the one safe-fix engine, the single `detector-registry.ts` source of truth, and the frozen `fixClass` allow-list with A1 and B2. It is a front door, not an implementation. Build it after the engine lands.
- **Sibling front door B2**: B2 is the interactive `/doctor data-quality` front door over the same engine. B1 and B2 differ only in trigger, scheduled versus interactive. They must not fork the engine.
- **Not gated on 015-prodmode-recall-gate**: B1 carries no retrieval-class detector, so the C2 prod-mode completeRecall@3 gate does not block it. Any retrieval-class detector added later to the sweep inherits the C2 gate on its own.
- **Verdict: GO-on-cost (Tier B keystone)**. Floor-bypassing by construction, it emits findings and applies write-time safe fixes, never a vector row, so it pays no re-index or prod@3 tax. It ships on cost and structural soundness, with the standing-value proof deferred to the first scheduled run.

---

## 10. OPEN QUESTIONS

- What cron cadence does the `schedule:` trigger use, weekly versus daily, given the corpus size and the cost of a full fan-out.
- Does the opt-in `post-merge` hook run the full corpus or only the merged subtree, to keep the post-merge latency bounded.
<!-- /ANCHOR:questions -->
