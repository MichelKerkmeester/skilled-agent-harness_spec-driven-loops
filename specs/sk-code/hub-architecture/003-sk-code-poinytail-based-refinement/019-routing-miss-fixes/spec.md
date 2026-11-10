---
title: "Feature Specification: Phase 19: routing-miss-fixes"
description: "Three routing misses that two earlier passes closed as needing a one-caller mechanism: a finished-run mention that routes DOC-331 to research, and two advisor probes that lose to a rule built for a different intent."
trigger_phrases:
  - "routing miss fixes"
  - "phase 19 routing miss fixes"
  - "doc-331 finished run clause"
  - "advisor battery p4 p7"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 19: routing-miss-fixes

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-11 |
| **Branch** | `worktrees/102-routing-miss-fixes` |
| **Parent Spec** | ../spec.md |
| **Phase** | 19 of 19 |
| **Predecessor** | 018-create-sh-unknown-options |
| **Successor** | None |
| **Handoff Criteria** | Every criterion in goal.md passes and strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 19** of the sk-code Ponytail 5 refinement phase parent. The operator directed the three misses that phases 15 and 16 closed as "needs a one-caller mechanism" to be fixed, which outranks those closed verdicts. The overengineering rule still decides how: the smallest change that fixes the cause, reusing a mechanism that exists.

**Scope Boundary**: The deep-loop compiled router, the advisor's deep-review and corpus-study rules in both scorers, their tests and the ledgers that pin them.

**Dependencies**:
- None.

**Deliverables**:
- DOC-331 deferring, with the deep-loop hub passing admission without `--warn-only`.
- P4 and P7 reaching sk-code on both advisor entry points, with N3 unchanged.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
DOC-331 says "We just finished a deep-research run" and asks for a diagnosis. The deep-loop router scores the alias `deep-research` wherever it appears, so it routes to `research`, the loop whose iterations write the graph the scenario must leave untouched. P4 asks for a Vitest about the `resume deep review` phrase, and `deepReviewSkCodeReviewPenalty` (-0.25) pushes sk-code under system-deep-loop. P7 asks for a packet-local helper, and `corpusStudySpecKitBonus` (+0.35) puts system-spec-kit first on the CLI, while the Python `--force-native` path happens to rank sk-code first.

### Purpose
Each miss is fixed at its cause without moving any other row.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A finished-run clause that the deep-loop router does not score
- One code-authoring condition shared by the deep-review penalty and the corpus-study bonus, mirrored in the Python deep-loop precedence
- Tests that fail before the change, and the ledgers the improvements move

### Out of Scope
- The Python re-sort by confidence, which discards the native rank for every prompt; changing it moves 8 labeled prompts both ways
- A context-filter field in the hub router schema, because the clause is a hub-local constant like `WORD_BOUNDARY_KEYWORDS`
- The v4.0.0.4 release entry, which another lane owns

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/002-system-deep-loop/lib/canary-router.cjs` | Modify | Authored copy of the finished-run clause |
| `.skilled/bin/lib/compiled-routing/` (router copy, `serving-closure.manifest.json`) | Modify | Served copy, from `compiled-route-sync.cjs` |
| `.skilled/bin/tests/compiled-route-finished-run.test.cjs` | Create | Four cases |
| `.skilled/bin/tests/compiled-route-admission.test.cjs` | Modify | Corpus pin 86 to 82, stale since the mode removal |
| `.github/workflows/routing-registry-drift.yml` | Modify | Deep-loop admission blocks |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts`, `scoring-constants.ts` | Modify | Code-authoring condition and one bonus |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` | Modify | Mirror in the deep-loop precedence |
| advisor golden fixture, Python test, divergence ledger, eval baseline | Modify | Four golden rows, T243-SA-012b, two ledger entries, new counts |
| `.skilled/skills/system-skill-advisor/SKILL.md`, `changelog/v0.15.3.0.md`, Hermes copy | Modify, Create | Release |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | DOC-331 defers and no other admission or canary row moves | `compiled-route-admission.cjs --all` exits 0 with one changed scenario; `all-canaries.cjs` prints `all hubs failures 0` |
| REQ-002 | P4 and P7 reach sk-code, N3 stays on system-deep-loop | Both batteries print `positives 17/17 negatives-false-positive 0/5` |
| REQ-003 | No regression | The advisor vitest reports 0 failed; the regression suite reports `overall_pass` true |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Each rule change has a test that fails before it | Golden rows, the Python case and the finished-run test fail on the old sources |
| REQ-005 | The served router matches its authored source | `compiled-route-sync.cjs --check` and `compiled-route-guard.cjs` exit 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every completion criterion in goal.md passes when the orchestrator reruns it.
- **SC-002**: The phase lands as conventional commits in the worktree, not pushed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A real run request that contains a finished-run clause is deferred | Low | The clause needs a completion verb, a determiner and a run noun, and a request after it still routes |
| Risk | The code-authoring condition catches a real deep-review request | Low | A deep-review phrase between the verb and the noun blocks the match, and 1,342 prompts show only the intended rows move |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
