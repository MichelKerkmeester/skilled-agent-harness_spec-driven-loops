---
title: "Feature Specification: Vitest baseline recovery [system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/003-vitest-baseline-recovery/spec]"
description: "Triage and remediate the 198 vitest failures across 166 files surfaced after Unit A's full-repo run (11,587 / 11,829 passing vs the v3.4.1.0 baseline-claim of 11,606 / 0 net regressions). Sampled failures all sit in skill_advisor scorer, hooks, scaffold, alignment, and code-graph subsystems — outside Unit A's surface — and pre-date this packet. Goal: classify each failure (pre-existing baseline drift / fixture stale / runtime regression), fix what is reasonably fixable, document the rest as accepted baseline drift with a path to closure."
trigger_phrases:
  - "vitest baseline recovery"
  - "198 vitest failures"
  - "skill advisor scorer projection-fallback"
  - "filesystem-fallback fixture drift"
  - "v3.4.1.0 baseline reconciliation"
  - "026/000/006 packet"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/003-vitest-baseline-recovery"
    last_updated_at: "2026-05-08T21:35:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded Level 2 spec; baseline drift scoped to advisor/hook/scaffold/alignment/code-graph"
    next_safe_action: "Dispatch cli-codex gpt-5.5 high fast to triage + fix"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/scorer/native-scorer.vitest.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/scorer/projection-fallback-049-005.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "vitest-baseline-recovery-2026-05-08"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Vitest baseline recovery

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-08 |
| **Branch** | `main` |
| **Predecessor** | None (cleanup packet) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

After Unit A (memory search Clusters 4-7 remediation) shipped, a full-repo `pnpm vitest run` reported **198 failed tests across 166 files** out of 11,829 total (11,587 passing). The v3.4.1.0 release note claims "Core test suites — 11,606 passed, 0 net regressions"; this is now demonstrably false at the full-repo level. Sampled failures sit in `skill_advisor/tests/scorer/` (e.g., `projection-fallback-049-005.vitest.ts` expects `'filesystem-fallback'` but receives `'filesystem'`), and across `tests/hooks/`, `tests/scaffold/`, `tests/alignment/`, `tests/code-graph/` — entirely outside Unit A's surface. Codex fixed 10 packet-adjacent failures during Unit A's run; the remaining 198 are pre-existing baseline drift that accumulated between v3.4.1.0's release-note measurement and Unit A's full-repo run. The drift was likely never captured because the v3.4.1.0 verification was an isolated-suite measurement (or the CI configuration filters certain suites).

### Purpose

Triage every failing test, fix what is reasonably fixable in a single packet sweep, and document the irreducible drift with a clear path to closure. Restore the v3.4.1.0 changelog row "Core test suites — 11,606 passed, 0 net regressions" to truth — either by closing the 198 failures or by amending the changelog row to reflect the actual baseline.

The packet does **not** introduce new functionality. It restores the baseline.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **Triage every failing test**. Run `pnpm vitest run --reporter=json --outputFile=/tmp/baseline.json`; classify each failure into: (a) **fixture-drift** (test expectation no longer matches shipped behavior), (b) **runtime-regression** (shipped behavior actually broke), (c) **environmental** (test relies on missing daemon/fixture/auth), (d) **flaky** (non-deterministic).
- **Fix fixture-drift failures** by updating test expectations to match shipped behavior (the easier majority). For each fix, leave a one-line comment citing the v3.4.x packet that introduced the behavior change.
- **Fix runtime-regression failures** by repairing the shipped code (or escalating to a sibling packet if scope is too large).
- **Document environmental failures** with `it.skip` and an explicit `// REASON: <env requirement>` annotation pointing at the daemon/fixture/auth needed.
- **Document flaky failures** with `it.fails.skip` plus a flake-rate estimate and a follow-up packet pointer.
- **Update v3.4.1.0 changelog row** to reflect the post-recovery baseline. Two acceptable forms: (a) "Core test suites — 11,829 passed, 0 net regressions" if all 198 close; (b) "Core test suites — N passed / M skipped (env-blocked) — see 026/000/006 for triage notes" if some remain blocked.

### Surfaces (sampled)

- **skill_advisor/tests/scorer/** — `projection-fallback-049-005.vitest.ts`, `native-scorer.vitest.ts`, plus likely siblings. Failure pattern: expected `'filesystem-fallback'` source label, getting `'filesystem'`. Looks like fixture-drift after a behavior change.
- **tests/hooks/** — likely fixture drift around hook-payload schemas after the cross-runtime parity work.
- **tests/scaffold/** — possibly drift after the manifest-driven template redesign (008-template-levels).
- **tests/alignment/** — workflow-invariance allowlist; new templates need entries.
- **tests/code-graph/** — possibly drift after phase 012/007 parser_skip_list landed.

Exact failure inventory generated at triage time.

### Out of Scope

- Adding **new** tests. This is a baseline-restoration packet, not a coverage uplift.
- Refactoring tests for clarity — only fix-or-skip-with-reason.
- Touching Unit A's surface (memory-search files) or any v3.4.1.0 just-shipped code.
- Investigating the v3.4.1.0 changelog measurement methodology — that's a release-process concern, not a test fix.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/scorer/*.vitest.ts` | Modify | Fixture drift — align test expectations with current shipped behavior. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/hooks/*.vitest.ts` | Modify | Fixture drift around hook payload schemas. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/scaffold/*.vitest.ts` | Modify | Manifest-driven template drift (010 phase). |
| `.opencode/skills/system-spec-kit/mcp_server/tests/alignment/*.vitest.ts` | Modify | Workflow-invariance allowlist additions for new template surfaces. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/code-graph/*.vitest.ts` | Modify | Drift after parser_skip_list landed. |
| `.opencode/skills/system-spec-kit/changelog/v3.4.1.0.md` | Modify | Update verification table row "Core test suites" with post-recovery numbers. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Triage report exists. | Triage classifies all 198 failures into the 4 buckets (fixture-drift, runtime-regression, environmental, flaky) and lists per-test classification + recommended action. |
| REQ-002 | Net regressions: zero. | Post-fix vitest run reports zero NEW failures relative to the post-Unit-A baseline. |
| REQ-003 | v3.4.1.0 changelog row reflects truth. | The "Core test suites" row in `v3.4.1.0.md` is updated to match the post-recovery numbers (passing/failing/skipped breakdown) with a one-line note pointing to this packet for triage detail. |

### P1 — Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Fixture-drift failures fixed in-packet. | All failures classified as fixture-drift have updated expectations matching shipped behavior. Each fix carries a `// drift: <packet that changed behavior>` comment. |
| REQ-005 | Runtime-regression failures either fixed in-packet OR escalated. | If fix is small (≤ 30 LOC, single file): fix in-packet. If larger: open a follow-up packet pointer in the implementation-summary §Limitations and skip the test with `it.fails.skip` + `// followup: 026/<phase>/<packet>` annotation. |
| REQ-006 | Environmental failures cleanly skipped. | Each environmental failure annotated with `it.skip` + `// REASON: <env requirement>`. Operator can trace the daemon/fixture/auth needed without reading the test body. |
| REQ-007 | Flaky failures quarantined with flake estimate. | Each flaky failure annotated with `it.fails.skip` + `// flake-rate: ~X/N runs` based on a 5-run sample. |

### P2 — Refinement

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | CI workflow guard for net regressions. | Add a `pnpm test:baseline-guard` script that fails if the failing-test count grows beyond the post-recovery baseline. (Optional — record as deferred if the scope expands.) |
| REQ-009 | Triage classification embedded in implementation-summary. | Implementation-summary §Verification includes a 4-bucket count: drift, regression, environmental, flaky. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Post-recovery `pnpm vitest run` reports zero NEW failures vs the triage baseline.
- **SC-002**: All 198 failures are classified, and either fixed, skipped-with-reason, or escalated-with-pointer.
- **SC-003**: `bash validate.sh 003-vitest-baseline-recovery --strict` exits 0.
- **SC-004**: v3.4.1.0 changelog row updated; reader can trust it.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Some "fixture-drift" turns out to be real regression | High | Triage rule: when behavior is non-obvious, treat as runtime-regression and escalate. Don't paper over real bugs by updating fixture. |
| Risk | Updating fixtures masks future drift | Med | Each fix carries a `// drift: <packet>` comment so the next reader sees the lineage. |
| Risk | 198 is too many to triage in one packet | Med | Bucket-by-surface: fix all `skill_advisor/tests/scorer/*` together (likely the same root cause), then iterate. |
| Dependency | Full-repo `pnpm vitest run` succeeds | High | Currently runs (codex used it for Unit A verification). If the test runner itself is broken, escalate before triage. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Full-repo `pnpm vitest run` completes within 10 minutes wall-clock (current baseline).

### Reliability

- **NFR-R01**: Post-recovery test count is deterministic across 3 sequential runs (no new flake introduced).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries

- **Test file references a deleted source file**: classify as fixture-drift (the source moved); update or delete the test depending on coverage equivalent.
- **Test relies on a daemon (CocoIndex, MCP)**: classify environmental; skip with REASON.

### Error Scenarios

- **Test runner OOM during full run**: split runs by directory and merge JSON reports.
- **Vitest config divergence between Unit A's run and triage run**: snapshot config at start of triage; revert at end.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | 198 test fixes across ~5 surface clusters; estimated ~400-600 LOC of test-only edits. |
| Risk | 12/25 | Misclassifying drift as fixture (vs regression) hides bugs. Mitigated by bucket-by-surface triage rule. |
| Research | 8/20 | Triage is the research; classification rules are documented. |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **Q1**: Should `it.fails.skip` annotations point at follow-up packet IDs that don't exist yet? (Recommendation: yes — placeholders fine; e.g., `// followup: 026/000/002-vitest-baseline-recovery-followup`.)
- **Q2**: For the v3.4.1.0 changelog row, should we keep "11,606 passed" historical for honesty and add a footnote, or replace outright? (Recommendation: replace — the row is currently false; replacement is a correction, not history rewriting.)
<!-- /ANCHOR:questions -->
