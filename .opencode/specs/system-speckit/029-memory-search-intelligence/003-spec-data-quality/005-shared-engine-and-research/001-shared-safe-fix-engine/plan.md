---
title: "Implementation Plan: Shared Safe-Fix Engine [template:level_2/plan.md]"
description: "A pure runDetectors engine plus one frozen detector registry the keystone consumers share, three write-time front doors plus B3 and the Tier-C detectors. Report mode never writes. Apply mode runs only safe-class fixes behind content_hash idempotency and atomic writes."
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
    packet_pointer: "system-speckit/029-memory-search-intelligence/003-spec-data-quality/005-shared-engine-and-research/001-shared-safe-fix-engine"
    last_updated_at: "2026-06-27T17:15:39.553Z"
    last_updated_by: "markdown-agent"
    recent_action: "Recorded the F001 import-route decision (Option A, api barrel)"
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
# Implementation Plan: Shared Safe-Fix Engine

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces and verification path.
- Match phases to the stated scope. Remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on Node, run through the spec-kit script runner |
| **Framework** | None, a pure module plus a frozen registry |
| **Storage** | None of its own, the engine reads a target and the existing content_hash cache |
| **Testing** | vitest for the pure runner, a dirty scratch fixture for the report and apply paths |

### Overview
The engine is two new files under `scripts/dq/`, plus a one-line re-export added to the `mcp_server/api` public barrel so the engine can reach `computeMemoryQualityScore` legally. `detector-registry.ts` is the single source of truth where each entry declares `{id, surface, detect, fixClass, fix}` and `fixClass` is one of `safe`, `risky` or `none`, deny-by-default. `dq-engine.ts` exposes a pure `runDetectors(target, opts)` that returns `{issues, applied, skipped}`, writes nothing in report mode and in apply mode runs `fix()` only for detectors whose `fixClass` is in `opts.allowFixClass`. It reuses the shipped scorers verbatim and adds none of its own.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One pure core plus one frozen self-guarding registry, no new scorer and no new store.

### Decision: scorer import route
The engine stays under `scripts/dq/` and reaches the cross-tree scorer `computeMemoryQualityScore` through the `@public` `mcp_server/api` barrel (Option A of the deep-review remediation, alias `@spec-kit/mcp-server/api`), so the enforced `scripts` to `mcp_server/handlers` import boundary stays intact. `reviewPostSaveQuality` stays a direct intra-`scripts` import from `scripts/core`. The rejected alternatives were a time-boxed `check-no-mcp-lib-imports` allowlist exception (carries an expiry obligation) and relocating the engine under `mcp_server/` (would force A1, B1 and B2 to restate their import story).

### Key Components
- **detector-registry.ts**: The single source of truth. Each entry declares `{id, surface, detect, fixClass, fix}`, deny-by-default, and the frozen safe-class allow-list is part of the same file so the registry guards itself with the invariants it enforces.
- **dq-engine.ts**: The pure core. `runDetectors(target, opts)` folds the detector issues and returns `{issues, applied, skipped}`, writes nothing in report mode, and in apply mode runs `fix()` only for detectors whose `fixClass` is in `opts.allowFixClass`.
- **frozen fixClass allow-list**: The five safe entries from spec.md section 7 (`desc.shape`, `enum.tier_status_ctype`, `triggers.propagate`, `hvr.style`, `anchor.unclosed`). Granting any new detector `safe` is a guarded-class edit that re-checks INV-1 and INV-2.

### Data Flow
A front door hands the engine a target and `opts`. The engine runs each registered `detect`, folds the issues, and in report mode returns and writes nothing. In apply mode it runs `fix()` only for `safe`-class detectors named in `opts.allowFixClass`, guards each write with a content_hash idempotency check and an atomic write, then returns `{issues, applied, skipped}`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `computeMemoryQualityScore` (`mcp_server/handlers/quality-loop.ts:392,747`) | The shipped pure scorer, across the enforced `scripts` to `mcp_server/handlers` boundary | Reused verbatim, reached through the `@public` `mcp_server/api` barrel, never by a relative handlers path | grep `dq-engine.ts` imports it from `@spec-kit/mcp-server/api`, `check-no-mcp-lib-imports` passes |
| `reviewPostSaveQuality` (`scripts/core/post-save-review.ts:573,1041,1077`) | The shipped non-mutating reviewer | Reused verbatim by a legal intra-`scripts` import from `scripts/core` to `scripts/dq` | grep the import, reuse pinned at `post-save-review.ts:573,1041,1077` |
| `mcp_server/api/index.ts` | The `@public` barrel for `scripts/` consumers | Add a re-export of `computeMemoryQualityScore` | grep the new export line, `dq-engine.ts` imports it via `@spec-kit/mcp-server/api` |
| `runQualityLoop` `attemptAutoFix` | The destructive 8000-char substring trim | Excluded, the engine never calls it | grep confirms no `runQualityLoop` call site in `dq-engine.ts` |
| 015-prodmode-recall-gate | The prod@3 recall gate INV-2 points at | Not built here, INV-2 routes retrieval promotions through it | grep the INV-2 guard references the C2 gate, not a fresh scorer |

Required inventories:
- Same-class producers: `rg -n 'fixClass|detector-registry|runDetectors' .opencode/skills/system-spec-kit/scripts`.
- Consumers of changed symbols: the engine adds the new public surface `runDetectors` and `detector-registry`, so A1, B1 and B2 are the consumers to inventory after build with `rg -n 'runDetectors|detector-registry' .`.
- Matrix axes: report mode versus apply mode and all three `fixClass` values `safe`, `risky` and `none`. INV-1 and INV-2 are the invariants the fixtures must assert.
- Algorithm invariant: a detector declaring `touchesBody` is never granted `safe` (INV-1, a declaration check plus guarded-edit review, not a runtime proof) and a second apply on a fixed target is a no-op under content_hash.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Add `computeMemoryQualityScore` to the `mcp_server/api` public barrel and import it in `dq-engine.ts` via `@spec-kit/mcp-server/api` (directory settled at `scripts/dq/`)
- [ ] Confirm the shipped scorers are importable, `computeMemoryQualityScore` through the public barrel and `reviewPostSaveQuality` by a direct intra-`scripts` import
- [ ] Verify the `dq-engine.ts` import of `computeMemoryQualityScore` passes `check-no-mcp-lib-imports`
- [ ] Stand up a dirty scratch fixture with a mixed safe, risky and none defect set

### Phase 2: Core Implementation
- [ ] Build `detector-registry.ts` as the single source of truth with per-detector `{id, surface, detect, fixClass, fix}`, deny-by-default
- [ ] Seed the frozen safe-class allow-list (`desc.shape`, `enum.tier_status_ctype`, `triggers.propagate`, `hvr.style`, `anchor.unclosed`)
- [ ] Build `dq-engine.ts` pure `runDetectors(target, opts)` returning `{issues, applied, skipped}`, report mode writes nothing
- [ ] Add the apply path that runs `fix()` only for `opts.allowFixClass` detectors behind content_hash idempotency and atomic writes
- [ ] Encode INV-1 and INV-2 as registry-declaration checks (`fixClass` against a declared `touchesBody` flag) and make the allow-list edit a guarded-class change that re-checks them under review

### Phase 3: Verification
- [ ] Report run over a dirty fixture returns populated issues with an empty applied set and a clean working tree
- [ ] Apply run with `allowFixClass ['safe']` mutates only safe targets and records risky and none in `skipped`
- [ ] Edge cases handled (unrecognized surface, empty `allowFixClass`, detect throw, fix throw, scorer signature drift)
- [ ] Run `node scripts/evals/check-no-mcp-lib-imports.ts` (or its dist build) against the new `scripts/dq/` files and confirm zero violations
- [ ] Documentation updated (spec/plan/tasks/checklist)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The pure runner, the deny-by-default filter, the INV-1 guard | vitest |
| Integration | Report path and apply path against a scratch fixture | dirty scratch fixture, git status |
| Manual | A local report run and a guarded apply on a corrupted packet | local shell |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Shipped scorers `computeMemoryQualityScore` and `reviewPostSaveQuality` | Internal | Green | No scorer to reuse, the engine would risk a divergent parallel scorer |
| 015-prodmode-recall-gate | Internal | Yellow | INV-2 has no prod@3 gate to route retrieval promotions through, retrieval detectors stay suggest-only |
| content_hash cache | Internal | Green | The idempotency guard has no hash to compare, a re-apply is no longer a guaranteed no-op |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A safe-class fix mutates an authored-doc body, or apply touches a non-safe target.
- **Procedure**: Revert the two new files via git. The engine is report-only by default and writes only under an explicit `allowFixClass`, so a report run needs no corpus rollback. Revert any operator-local apply via git.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Fixture) ──┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None, the engine is the foundation | Core, Fixture |
| Fixture | Setup | Verify |
| Core | Setup | Verify |
| Verify | Core, Fixture | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1-2 hours |
| Core Implementation | Med | 5-9 hours |
| Verification | Med | 2-4 hours |
| **Total** | | **8-15 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Scratch fixture backed up before any apply run
- [ ] `allowFixClass` defaulted to report-only with no implicit apply
- [ ] The frozen allow-list reviewed so no body-mutating detector is granted safe

### Rollback Procedure
1. Default the engine back to report mode and stop any apply caller
2. Revert the registry and engine via git if the module is removed
3. Run a report-only smoke pass on a clean packet to confirm no residual mutation
4. No stakeholder notification needed, the engine is internal infra

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A for report runs. An operator-local apply is git-tracked, revert via git if a fix is wrong.
<!-- /ANCHOR:enhanced-rollback -->
