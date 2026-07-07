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
    packet_pointer: "028-memory-search-intelligence/003-spec-data-quality/005-shared-engine-and-research/026-shared-safe-fix-engine"
    last_updated_at: "2026-06-27T17:15:39.553Z"
    last_updated_by: "markdown-agent"
    recent_action: "Resolved F001 scorer import via the mcp_server/api public barrel"
    next_safe_action: "Build the engine per the resolved import route once implementation begins"
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
Five keystone consumers converge on one shared core that does not exist yet (`research.md` section 4). Three are write-time front doors with a safe-apply path: A1 is on-write and report-only, B1 is scheduled and headless, B2 is interactive on `/doctor`. The other two register on the engine without a safe-apply path. B3 emits queue rows. Every Tier-C retrieval detector must pass one promotion gate. SC-001 measures the three write-time front doors A1, B1, B2. With no shared core each front door would carry its own detector list, its own notion of what a safe fix is, and its own write path, so the five would drift on the one decision that matters: whether a given fix is allowed to mutate a git-tracked authored artifact. There is no `detector-registry.ts` single source of truth and no `dq-engine.ts` pure runner today, so the deny-by-default safety property the program depends on has nowhere to live.

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
- Verbatim reuse of the shipped pure scorer `computeMemoryQualityScore`, reached through the public `@spec-kit/mcp-server/api` barrel because it lives across the enforced `scripts` to `mcp_server/handlers` import boundary, and the non-mutating reviewer `reviewPostSaveQuality`, reached by a legal intra-`scripts` import, with no scoring logic of the engine's own.
- The two structural invariants encoded as registry-declaration checks, not behavioral proofs. INV-1, a detector whose declared `touchesBody` flag is set is never granted `safe`. This cross-checks the author's own `fixClass` against the author's own `touchesBody` declaration and is backed by the human review the guarded allow-list edit forces. It cannot prove an arbitrary `fix()` leaves the body untouched at runtime. INV-2, a retrieval-class change is never promoted without the C2 prod-mode read.

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
| `.opencode/skills/system-spec-kit/mcp_server/api/index.ts` | Modify | Re-export the pure `computeMemoryQualityScore` through the `@public` barrel so `scripts/dq/` reaches it via `@spec-kit/mcp-server/api` without crossing the enforced `scripts` to `mcp_server/handlers` import boundary |
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
| REQ-004 | The system SHALL enforce INV-1 as a declaration-consistency check, a detector whose declared `touchesBody` flag is set is never granted `safe`. | A registry entry that pairs `safe` with a set `touchesBody` declaration fails the invariant check and cannot be granted `safe`. The check compares declarations and does not prove the `fix()` runtime behavior, so a body-mutating fix mis-declared `touchesBody: false` is caught only by the human review the guarded edit forces. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | While applying, the system SHALL guard each fix with a content_hash idempotency check so a second apply on a fixed target is a no-op. | Two consecutive apply runs on the same target produce an empty diff on the second run. |
| REQ-006 | While applying, the system SHALL write through atomic writes so a partial or interrupted apply never leaves a torn file. | An apply interrupted mid-write leaves either the original or the fully-written file, never a partial. |
| REQ-007 | Granting a detector `safe` SHALL be a `guarded`-class registry change that re-checks INV-1 and INV-2. | An allow-list edit that promotes a detector to `safe` runs the two invariant checks before the promotion is accepted. |
| REQ-008 | The engine SHALL reuse the shipped scorers verbatim and add no scoring logic of its own, reaching `computeMemoryQualityScore` through the public `mcp_server/api` barrel and `reviewPostSaveQuality` through a legal intra-`scripts` import. | The engine imports `computeMemoryQualityScore` from `@spec-kit/mcp-server/api` and `reviewPostSaveQuality` from `scripts/core/post-save-review.ts`, defines no parallel scorer and passes `check-no-mcp-lib-imports`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: One engine and one registry serve all three write-time front doors (A1, B1, B2) with no per-front-door detector list or write path, proven by A1, B1, and B2 importing the same `detector-registry.ts` and calling the same `runDetectors`.
- **SC-002**: The deny-by-default and INV-1 checks hold under test. A detector declaring `touchesBody` cannot be granted `safe`. An apply run touches only safe-class targets, leaving risky, none and unclassified detectors untouched. INV-1 verifies the declaration pairing, not the `fix()` runtime behavior.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Shipped scorers `computeMemoryQualityScore` and `reviewPostSaveQuality` | The engine reuses them verbatim, a parallel scorer would risk divergent verdicts | Reach the pure scorer through the public `mcp_server/api` barrel and the reviewer by a legal intra-`scripts` import, define none of the engine's own |
| Risk | A detector touching an authored body slips in as `safe` | A safe-class fix would amputate or rewrite a git-tracked authored artifact | INV-1 declaration check blocks `safe` on any detector declaring `touchesBody`, granting `safe` is a guarded allow-list edit re-checked under human review. INV-1 cannot catch a body-mutating fix mis-declared `touchesBody: false`, that residual is the reviewer's job not a mechanical guarantee |
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
- **NFR-R02**: The self-guarding registry re-checks INV-1 and INV-2 on every allow-list edit, so a detector cannot reach `safe` without passing the INV-1 declaration check and the human review the guarded edit forces.
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
| Scope | 14/25 | Two new files, the registry plus the pure engine, consumed by the five keystone consumers (three write-time front doors plus B3 and the Tier-C detectors) |
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
- The reused scorers are the PURE `computeMemoryQualityScore` and the non-mutating `reviewPostSaveQuality`, both already shipped and wired into the live save workflow. They live in different trees and are reached by different routes. `computeMemoryQualityScore` lives at `mcp_server/handlers/quality-loop.ts:392,747`, across the enforced `scripts` to `mcp_server/handlers` import boundary that `scripts/evals/import-policy-rules.ts` defines and `scripts/evals/check-no-mcp-lib-imports.ts` enforces, so the engine reaches it through the `@public` `mcp_server/api/index.ts` barrel (alias `@spec-kit/mcp-server/api`) where it is added as a re-export, never by a relative `../../mcp_server/handlers/...` path the eval gate would reject. `reviewPostSaveQuality` lives at `scripts/core/post-save-review.ts:573,1041,1077`, a legal intra-`scripts` import from `scripts/core` to `scripts/dq`, so the engine imports it directly. Both are reused verbatim with no scoring logic of the engine's own. The engine NEVER calls the destructive `runQualityLoop` auto-fix, whose `attemptAutoFix` trims content by substring to an 8000-char budget.
- The two structural invariants from `research.md` section 5. INV-1, a fix touching an authored body is never `safe`, enforced two ways with different strengths. For the one known destructive path it fences off `runQualityLoop` and `attemptAutoFix` by a `computeAuthoredDocQuality` wrapper that throws on full-auto and by quarantining the budget-trim to memory-save, a real mechanical block on that specific path. For any new detector it reduces to a declaration-consistency check, the registry author's `fixClass` against a declared `touchesBody` flag. That check cannot prove an arbitrary `fix()` leaves the body untouched and so leans on the human review the guarded allow-list edit forces. Deny-by-default catches the omission case (no class becomes `none`), the declaration check plus review catches misclassification only as far as `touchesBody` is declared honestly. INV-2, a retrieval-class change is never promoted without a prod@3 read through the C2 gate.

## 8. DEPENDENCIES AND VERDICT

- **Depended on by A1, B1, B2 (and B3, C-class detectors)**: this engine is the foundation those keystone consumers depend on, not the foundation the whole program depends on. The 001-a1 on-write hook, the 011-b1 scheduled sweep and the 012-b2 `/doctor` route are three write-time front doors over this one engine and this one registry, and they must not fork it. 013-b3 is a detector registered here that emits queue rows. Of the seven Novel-tier phases (019 through 025) only two register a detector on this engine, 019 contradiction-detection and 024 freshness-decay-queue. The other five ride separate `mcp_server` subsystems and do not mount this engine: 020 the vector cache, 022 hybrid-search, 023 the causal graph-lifecycle, 025 the quality lib, 021 a standalone generator. So the 028 rollout sequences each of those five against its own substrate, not behind 026. The build order is inviolable: engine before front doors (`research.md` section 5, the topological sort).
- **The two mounting novels need a substrate extension, not a plain registry entry**: 019 and 024 break the single-target pure-runner contract this engine specifies. `runDetectors(target, opts)` runs one target and NFR-P01 plus REQ-001 keep report mode pure and side-effect-free, but 019 generates candidate document PAIRS across the corpus and makes a per-pair LLM entailment call, which is network IO not a pure single-target detect, and 024 iterates memory-DB rows reading per-memory FSRS retrievability, a row domain the file-target sweep does not enumerate. Mounting them needs either a non-pure detector class with its own iteration unit, pair for 019 and db-row for 024, or a sweep-adjacent runner. The current single-target pure contract does not host them as written, and the spec must say so before either is planned against 026.
- **Points at 015-prodmode-recall-gate via INV-2**: this engine does not build the C2 gate, but its INV-2 routes every retrieval-class detector's promotion through it. Any Tier-C and 027 retrieval item that registers a detector here inherits the C2 prod-mode completeRecall@3 gate as its promotion condition.
- **Verdict: GO-on-cost (INFRA foundation)**. The engine touches validation and write-time fixes, never a vector row, so it pays no re-index or prod@3 tax. It reuses shipped scorers verbatim and ships on cost and structural soundness. It is the foundation the order-is-the-safety-property sequence places first, right after the Stage-0 census.

---

## 10. OPEN QUESTIONS

- RESOLVED. The `dq` script directory location is settled at `.opencode/skills/system-spec-kit/scripts/dq/`. The load-bearing decision that location forces is how the engine reaches `computeMemoryQualityScore`, which lives across the enforced `scripts` to `mcp_server/handlers` import boundary. Resolved per the deep-review remediation by re-exporting the pure scorer through the `@public` `mcp_server/api` barrel and importing it via `@spec-kit/mcp-server/api`, which keeps the engine in `scripts/dq/` and the boundary intact.
- Does the content_hash idempotency guard reuse the stored `content_hash` cache key or compute a fresh per-target hash at apply time, to stay inside the existing trust boundary without a schema change.
<!-- /ANCHOR:questions -->
