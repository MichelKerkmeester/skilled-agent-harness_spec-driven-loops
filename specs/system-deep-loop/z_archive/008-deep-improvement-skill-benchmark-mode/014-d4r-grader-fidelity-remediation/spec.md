---
title: "Feature Specification: D4-R Grader Fidelity + Doc Reconciliation Remediation"
description: "Apply all 28 findings from the MiMo deep-review of skill:deep-improvement (0 P0, 8 P1, 20 P2): make the D4-R grader dimension-aware (no hardcoded 'D4'), stop truncating long task-outcome answers before grading, close a shell-injection-shaped resume hint, reconcile SKILL.md/README/scoring_contract/changelog with the code, and clear the maintainability/robustness P2s. Behavior-preserving; the 349-test suite must stay green. Fixes are drafted by gpt-5.5-fast (high) in an isolated worktree and integrated under review."
trigger_phrases:
  - "d4r grader fidelity remediation"
  - "deep-improvement review fixes"
  - "apply deep review findings"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/008-deep-improvement-skill-benchmark-mode/014-d4r-grader-fidelity-remediation"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All 28 findings fixed + integrated to main; suite 358/358 + drift 4/4 green"
    next_safe_action: "Awaiting commit decision (uncommitted on main: 014 packet + 11 files)"
    blockers: []
    key_files:
      - ".opencode/skills/deep-improvement/scripts/model-benchmark/scorer/grader/harness.cjs"
      - ".opencode/skills/deep-improvement/scripts/skill-benchmark/live-executor.cjs"
      - ".opencode/skills/deep-improvement/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "d4r-grader-fidelity-remediation"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Feature Specification: D4-R Grader Fidelity + Doc Reconciliation Remediation

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

## OVERVIEW

The MiMo-v2.5-pro deep review of `skill:deep-improvement` (recorded under sibling phase `013/review/review-report.md`) produced 28 findings: 0 P0, 8 P1, 20 P2. None are blockers, but the P1s cluster in correctness-adjacent places — the new D4-R task-outcome grader still carries leftover "old D4 hallucination" wiring in its fallback path, a 2000-char truncation penalizes the (longer) D4-R answers, and a resume-hint helper interpolates a path into a shell string unescaped — plus the docs (SKILL.md router pseudocode + Section-11 script list, README counts/tables) lag the shipped code. This phase applies ALL 28 findings, behavior-preserving, keeping the 349-test suite green.

**Critical Dependencies**: the deep-improvement skill-benchmark + model-benchmark scripts (`harness.cjs`, `live-executor.cjs`, `dispatch-model.cjs`, `score-skill-benchmark.cjs`, `d4-ablation.cjs`, `sweep-benchmark.cjs`, `score-model-variant.cjs`), the doc set (`SKILL.md`, `README.md`, `scoring_contract.md`, `changelog/v1.11.0.0.md`), the full vitest suite (349 passing at start), and the `sk-code-router-sync.vitest.ts` drift guard.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete — all 28 findings fixed + integrated; suite 358/358 + drift 4/4 green |
| **Created** | 2026-06-02 |
| **Branch** | `main` (impl staged + verified via `wt/0007-d4r-remediation`, now removed) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The D4-R task-outcome instrument and the v1.11.0.0 doc reconciliation shipped functional and suite-green, but a deep review found 8 should-fix and 20 advisory issues. The most consequential: the grader's fallback parser hardcodes `dim_id:'D4'` and its user prompt says "Score D4 Hallucination only," so a D4-R result routed through the fallback is mislabeled or accepts structurally-wrong JSON; long D4-R answers are clipped to 2000 chars before grading; and the docs no longer match the code (missing router branch, missing 6 scripts, stale README counts).

### Purpose
Close every finding with behavior-preserving edits so the instrument is correct end-to-end and the docs are traceable to code, without regressing the green suite or the router drift guard.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- All 8 P1 findings (grader dimension-awareness, truncation fairness, shell-escape, SKILL.md router pseudocode + script list).
- All 20 P2 findings (README/scoring_contract/changelog reconciliation, parsing robustness, fail-closed default + config diagnostic, maintainability refactors).
- gpt-5.5-fast (high) drafts the fixes in an isolated worktree; reviewed integration into main + full-suite + drift-guard validation.

### Out of Scope
- Any deep-improvement change not named in a finding.
- The `sk-code` smart_routing intent-synonym work (a different skill, not in this review's target).
- Net-new features or scope beyond the 28 findings.

### Files to Change (staged in worktree, then integrated)
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/model-benchmark/scorer/grader/harness.cjs` | Modify | Dimension-aware grader: thread dimId; no hardcoded 'D4'; validate fallback dim_id |
| `scripts/skill-benchmark/live-executor.cjs` | Modify | Raise grading truncation cap; default model; brace-balanced routing scan |
| `scripts/model-benchmark/dispatch-model.cjs` | Modify | Shell-escape resume-hint path; diagnose malformed-config load |
| `scripts/model-benchmark/scorer/score-model-variant.cjs` | Modify | Fail-closed criteria-exec default |
| `scripts/skill-benchmark/score-skill-benchmark.cjs` | Modify | Split scoreScenario; name magic numbers; reconcile WEIGHTS; clarify wastedCount |
| `scripts/skill-benchmark/d4-ablation.cjs` | Modify | De-dupe grader-base builder |
| `scripts/model-benchmark/sweep-benchmark.cjs` | Modify | De-dupe event-stream parsing |
| `SKILL.md` | Modify | Add router runtime_assets branch + 6 missing scripts to §11 |
| `README.md` | Modify | Fix ref/script/trigger counts + structure block |
| `references/skill-benchmark/scoring_contract.md` | Modify | Complete funnel stages + advisorySignals |
| `changelog/v1.11.0.0.md` | Modify | Link D4-R scenarios to DEFAULT_D4R_SCENARIOS |
| `014-.../proposals/` | Create | gpt-5.5's per-finding remediation report (audit trail) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Behavior-preserving suite green | Full vitest suite stays at 349 passing / 0 failing after integration; refactors change no observable output |
| REQ-002 | RM-8 isolation | The gpt-5.5 `--dangerously-skip-permissions` dispatch runs in a fresh worktree with a scoped BANNED/ALLOWED prompt; main is untouched until reviewed integration |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | All 8 P1 findings fixed | Grader never emits hardcoded `dim_id:'D4'` for D4-R; D4-R answers graded un-truncated; resume-hint path shell-escaped; SKILL.md router branch + 6 scripts present |
| REQ-004 | All 20 P2 findings fixed | README counts/tables match the tree; scoring_contract + changelog reconciled; parsing/robustness + maintainability nits closed (or explicitly deferred with reason) |
| REQ-005 | Comment hygiene + drift guard | No ids/paths in code comments; `sk-code-router-sync.vitest.ts` stays green |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 28 findings are fixed or explicitly deferred with a documented reason; the deep-review report's active findings are cleared.
- **SC-002**: Full suite 349/0 + drift guard green on main after a reviewed integration of the worktree diff; no behavior drift.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Refactor (scoreScenario split) changes scores | High | Behavior-preserving mandate + full suite gate; defer if not provably equivalent |
| Risk | `--dangerously-skip-permissions` damages the repo | High | RM-8 four-layer: worktree (L2) + scoped BANNED/ALLOWED prompt (L1) + HEAD baseline (L3) + gpt-5.5 not deepseek (L4) |
| Risk | Grader dimId threading breaks the D4 path | Medium | Default `dimId='D4'` preserves existing callers; suite covers the grader parser |
| Risk | Fail-closed default breaks a test | Medium | Verify against `model-benchmark/tests/`; warn-and-document fallback if a test depends on permissive |
| Dependency | Worktree lacks node_modules | — | gpt-5.5 syntax-checks via `node --check`; full suite runs on main post-integration |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Each finding has a defined fix in the review report's Remediation Workstreams; the only judgment calls (dispatchReal system-prompt flag, fail-closed default) have documented fallbacks in the dispatch prompt.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The raised grading-truncation cap must not balloon grader token cost unreasonably — a single bounded constant (≈8000 chars), not unbounded.

### Security
- **NFR-S01**: The resume-hint path must be shell-escaped (no command injection); the criteria-exec default should fail closed.

### Reliability
- **NFR-R01**: The router drift guard (D5 connectivity) stays green; malformed-config loads emit a diagnostic instead of failing silently.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A grader response missing `dim_id` entirely: the fallback parser must stamp the threaded expected dim, not silently accept or hardcode 'D4'.

### Error Scenarios
- A refactor that cannot be made provably equivalent: defer that single finding with a reason rather than risk score drift.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | 11 files, 28 findings, mostly small + local |
| Risk | 15/25 | --dangerously-skip-permissions (worktree-mitigated) + behavior-preserving refactors |
| Research | 6/20 | the review already specified each fix |
| **Total** | **35/70** | **Level 2** |
<!-- /ANCHOR:complexity -->
