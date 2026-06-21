---
title: "Feature Specification: Shared Safe-Fix Engine [template:level_2/spec.md]"
description: "The five keystone front doors each need a safe-fix path, a detector inventory, and a fixClass policy, but none exists yet so each would hand-roll its own. Without one shared engine, one registry, and one frozen allow-list the front doors will diverge on what counts as a safe fix."
trigger_phrases:
  - "shared safe-fix engine"
  - "detector registry"
  - "fixClass allow-list"
  - "dq-engine runDetectors"
  - "content_hash idempotency"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "028-memory-search-intelligence/005-spec-data-quality/026-shared-safe-fix-engine"
    last_updated_at: "2026-06-21T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored shared safe-fix engine spec from research synthesis"
    next_safe_action: "Author plan.md and tasks.md for the engine and registry build"
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
# Feature Specification: Shared Safe-Fix Engine

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
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-06-21 |
| **Branch** | `026-shared-safe-fix-engine` |
| **Verdict** | GO-on-cost (INFRA foundation) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The five keystone front doors converge on one shared core that does not exist yet (`research.md` section 4). A1 is on-write and report-only, B1 is scheduled and headless, B2 is interactive on `/doctor`, B3 emits queue rows, and every Tier-C retrieval detector must pass one promotion gate. With no shared core each front door would carry its own detector list, its own notion of what a safe fix is, and its own write path, so the five would drift on the one decision that matters: whether a given fix is allowed to mutate a git-tracked authored artifact. There is no `detector-registry.ts` single source of truth and no `dq-engine.ts` pure runner today, so the deny-by-default safety property the program depends on has nowhere to live.

### Purpose
One pure engine and one frozen registry, so the front doors share a single source of truth for detectors and a single allow-list for safe fixes and cannot diverge.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A new `detector-registry.ts`, the single source of truth, where each entry declares `{id, surface, detect, fixClass, fix}` and `fixClass` is one of `safe`, `risky`, or `none`, deny-by-default.
- A self-guarding allow-list: granting a detector `safe` requires editing the frozen list, and that edit is itself a `guarded`-class change that re-checks the two structural invariants.
- A new `dq-engine.ts`, the pure core, exposing `runDetectors(target, opts)` that returns `{issues, applied, skipped}` and never writes in report mode.
- An apply mode that executes `fix()` only for detectors whose `fixClass` is in `opts.allowFixClass`, which is always `['safe']`, behind a content_hash idempotency guard and atomic writes.
- Verbatim reuse of the shipped pure scorer `computeMemoryQualityScore` and the non-mutating reviewer `reviewPostSaveQuality`, with no scoring logic of the engine's own.
- The two structural invariants encoded mechanically. INV-1, a detector that touches an authored-doc body is never `safe`. INV-2, a retrieval-class change is never promoted without the C2 prod-mode read.

### Out of Scope
- The A1 on-write hooks at `generate-context.ts` and `workflow.ts` and the `CONTENT_QUALITY` rule in `validate.sh` - those are 001-a1, a front door over this engine.
- The scheduled sweep and its workflow - that is 011-b1, a front door over this engine.
- The interactive `/doctor data-quality` route - that is 012-b2, a front door over this engine.
- The retrieval-gap capture and `refinement_queue` - that is 013-b3, a detector that emits queue rows the front doors surface.
- The C2 prod-mode recall gate itself - that is 015-c2, the gate INV-2 points at, not built here.
- Any new scoring algorithm - the engine reuses the shipped scorers and adds none.
- The DESTRUCTIVE `runQualityLoop` auto-fix path - explicitly excluded, it trims content by substring to an 8000-char budget and would amputate any doc larger than that.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/scripts/dq/detector-registry.ts` | Create | Single source of truth: per-detector `{id, surface, detect, fixClass, fix}`, deny-by-default, frozen self-guarding allow-list |
| `.opencode/skills/system-spec-kit/scripts/dq/dq-engine.ts` | Create | Pure `runDetectors(target, opts)` returning `{issues, applied, skipped}`, report vs safe-apply, content_hash idempotency, atomic writes, reuses shipped scorers |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | When `runDetectors` runs in report mode, the system SHALL return `{issues, applied, skipped}` and write nothing. | A report run over a dirty fixture returns populated issues, an empty applied set, and a clean git working tree afterward. |
| REQ-002 | When `runDetectors` runs in apply mode, the system SHALL execute `fix()` only for detectors whose `fixClass` is in `opts.allowFixClass`. | An apply run with `allowFixClass: ['safe']` over a mixed fixture mutates only safe-class targets and records risky and none-class detectors in `skipped`. |
| REQ-003 | The registry SHALL be deny-by-default, so a detector with no explicit `fixClass` is treated as `none` and never applied. | A detector entry omitting or mis-declaring `fixClass` is never executed by `fix()` in apply mode. |
| REQ-004 | The system SHALL enforce INV-1, a detector that touches an authored-doc body is never `safe`. | A registry entry that declares `safe` on a body-mutating detector fails the invariant check and cannot be granted `safe`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | While applying, the system SHALL guard each fix with a content_hash idempotency check so a second apply on a fixed target is a no-op. | Two consecutive apply runs on the same target produce an empty diff on the second run. |
| REQ-006 | While applying, the system SHALL write through atomic writes so a partial or interrupted apply never leaves a torn file. | An apply interrupted mid-write leaves either the original or the fully-written file, never a partial. |
| REQ-007 | Granting a detector `safe` SHALL be a `guarded`-class registry change that re-checks INV-1 and INV-2. | An allow-list edit that promotes a detector to `safe` runs the two invariant checks before the promotion is accepted. |
| REQ-008 | The engine SHALL reuse the shipped scorers verbatim and add no scoring logic of its own. | The engine imports `computeMemoryQualityScore` and `reviewPostSaveQuality` and defines no parallel scorer. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: One engine and one registry serve all three write-time front doors (A1, B1, B2) with no per-front-door detector list or write path, proven by A1, B1, and B2 importing the same `detector-registry.ts` and calling the same `runDetectors`.
- **SC-002**: The deny-by-default and INV-1 invariants hold under test: a body-mutating detector cannot be granted `safe`, and an apply run touches only safe-class targets, leaving risky, none, and unclassified detectors untouched.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Shipped scorers `computeMemoryQualityScore` and `reviewPostSaveQuality` | The engine reuses them verbatim, a parallel scorer would risk divergent verdicts | Import the shipped pure scorer and non-mutating reviewer, define none of the engine's own |
| Risk | A detector touching an authored body slips in as `safe` | A safe-class fix would amputate or rewrite a git-tracked authored artifact | INV-1 made mechanical, the body-mutating class is never grantable `safe`, granting `safe` is a guarded change that re-runs the invariant |
| Risk | A retrieval-class detector promoted without a prod-mode read | The 028 saturation mistake, an eval-mode win that hides a prod-mode regression | INV-2 routes every retrieval-class promotion through the 015-c2 prod@3 gate |
| Risk | The engine drifts into the DESTRUCTIVE `runQualityLoop` budget-trim | The 8000-char substring trim silently amputates docs larger than the budget | The budget-trim stays quarantined to memory-save, the engine never calls `runQualityLoop` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `runDetectors` is pure and side-effect-free in report mode, so a front door can call it on a single target on-write without a corpus pass.
- **NFR-P02**: The content_hash idempotency guard short-circuits a re-apply on an unchanged target, so a repeated apply is cheap.

### Security
- **NFR-S01**: Deny-by-default is the security property: a detector with no explicit, allow-listed `safe` class is never executed by the apply path.
- **NFR-S02**: Atomic writes keep an interrupted apply from leaving a torn or partially-rewritten git-tracked file.

### Reliability
- **NFR-R01**: A second apply on a fixed target is a no-op under the content_hash guard, so the engine is safe to re-run.
- **NFR-R02**: The self-guarding registry re-checks INV-1 and INV-2 on every allow-list edit, so the safety property cannot be eroded by adding a detector.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A detector with an unrecognized `surface`: the engine runs its `detect` for reporting but never grants `fix()` an implicit class.
- A target with no content_hash yet: the first apply computes and records it, the second apply reads it and no-ops on an unchanged body.
- An empty `allowFixClass`: apply runs `fix()` for nothing and returns all detectors in `skipped`.

### Error Scenarios
- A detector's `detect()` throws on one target: the engine records that target as errored and continues the rest, it does not abort the whole run.
- A `fix()` throws mid-apply: atomic writes leave the original intact and the detector is recorded as failed, not partially applied.
- The shipped scorer signature drifts: the engine surfaces the import or call failure rather than silently scoring zero.

### State Transitions
- Partial apply interrupted across a batch: the content_hash idempotency makes a re-run resume safely with no double-apply.
- A detector reclassified from `safe` to `risky`: the frozen allow-list is the single gate, so apply stops executing it the moment the guarded registry edit lands.
- A retrieval-class detector awaiting C2: INV-2 holds it suggest-only until the prod@3 gate passes, then the front door may promote it.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Two new files, the registry plus the pure engine, consumed by five front doors |
| Risk | 16/25 | Guarded mutation on git-tracked authored docs, mitigated by deny-by-default, INV-1, and atomic writes |
| Research | 8/20 | Seams and reused scorers verified to file:line, the invariants carry the design |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 7. CONCRETE CHANGE AND SEAMS

The exact seams, grounded to `research.md` sections 4 and 5 and verified to file:line where reuse is claimed.

- `detector-registry.ts` is the single source of truth. Each entry declares `{id, surface, detect, fixClass, fix}` where `fixClass` is one of `safe`, `risky`, or `none`, deny-by-default. Adding a detector is one entry. Granting it `safe` requires editing the frozen allow-list, and that edit is itself a `guarded`-class change that re-checks the two structural invariants, so the registry guards itself with the same invariants it enforces.
- The frozen `fixClass` allow-list, consolidated from `research.md` section 4. Safe class: `desc.shape` regenerate from frontmatter, `enum.tier_status_ctype` case-normalize, `triggers.propagate` additive subset copy capped at 12, `hvr.style` length-neutral fence-aware swap, `anchor.unclosed` append closer. Risky and suggest-only: `desc.generic`, `graph.child_aggregation`, `req.ears_coverage`, the edge-a recall-gap enrich-triggers action. None and advisory: `budget.overlength`, the edge-b below-floor row. The single invariant across all of it: a detector that touches an authored-doc body is never `safe`.
- `dq-engine.ts` is the pure core. `runDetectors(target, opts)` returns `{issues, applied, skipped}`, never writes in report mode, and in apply mode executes only `fix()` for detectors whose `fixClass` is in `opts.allowFixClass`, which is always `['safe']`, with the content_hash idempotency guard and atomic writes. It reuses the shipped scorers verbatim and adds no scoring logic of its own.
- The reused scorers are the PURE `computeMemoryQualityScore` and the non-mutating `reviewPostSaveQuality`, both already shipped and wired into the live save workflow (`quality-loop.ts:392,747`, `post-save-review.ts:573,1041,1077`). The engine NEVER calls the destructive `runQualityLoop` auto-fix, whose `attemptAutoFix` trims content by substring to an 8000-char budget.
- The two structural invariants from `research.md` section 5. INV-1, a fix touching an authored body is never `safe`, made mechanical by a `computeAuthoredDocQuality` wrapper that throws on full-auto and by quarantining the budget-trim to memory-save. INV-2, a retrieval-class change is never promoted without a prod@3 read through the C2 gate.

## 8. DEPENDENCIES AND VERDICT

- **Depended on by A1, B1, B2 (and B3, C-class detectors)**: this engine is the foundation everything in the program depends on. The 001-a1 on-write hook, the 011-b1 scheduled sweep, and the 012-b2 `/doctor` route are three front doors over this one engine and this one registry, and they must not fork it. 013-b3 is a detector registered here that emits queue rows. The build order is inviolable: engine before front doors (`research.md` section 5, the topological sort).
- **Points at 015-c2-prodmode-recall-gate via INV-2**: this engine does not build the C2 gate, but its INV-2 routes every retrieval-class detector's promotion through it. Any Tier-C and 027 retrieval item that registers a detector here inherits the C2 prod-mode completeRecall@3 gate as its promotion condition.
- **Verdict: GO-on-cost (INFRA foundation)**. The engine touches validation and write-time fixes, never a vector row, so it pays no re-index or prod@3 tax. It reuses shipped scorers verbatim and ships on cost and structural soundness. It is the foundation the order-is-the-safety-property sequence places first, right after the Stage-0 census.

---

## 10. OPEN QUESTIONS

- Where does the `dq` script directory live precisely, alongside the existing validation scripts under `scripts/validation/` or in a new `scripts/dq/`, given the front doors that import it.
- Does the content_hash idempotency guard reuse the stored `content_hash` cache key or compute a fresh per-target hash at apply time, to stay inside the existing trust boundary without a schema change.
<!-- /ANCHOR:questions -->
