---
title: "Feature Specification: Fix the findings of the fresh epic review"
description: "A fresh Fable 5.2 review of the skill advisor and this epic returned REQUESTED_CHANGES with one P1 and six P2 findings. This packet deletes the dead settings and the dead eval script, forwards two documented settings to the daemon, drops the retired vocabulary from the Python fallback and adds a test that runs the doctor's lane cleanup commands."
trigger_phrases:
  - "epic review fixes"
  - "fix the fresh epic review findings"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Fix the findings of the fresh epic review

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-22 |
| **Branch** | `worktrees/515-epic-review-fixes` |
| **Parent Spec** | ../spec.md |
| **Phase** | 27 of 27 |
| **Predecessor** | 026-doctor-lane-removal-alignment |
| **Successor** | None |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met and the work is merged to main |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 27** of the epic. The source is `evidence/review-report.md`, a read-only Fable 5.2 high review run on the `claude2` account against main at `920be184c8c`.

**Scope Boundary**: the seven findings and the drift lines in that report's Leftovers section. The review's five "Next" items are covered where they map to a finding.

**Dependencies**:
- The review report, saved in this packet as `evidence/review-report.md`.

**Deliverables**:
- Code, test and doc changes in the skill advisor, the launcher and the doctor tests, listed in section 3.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The review found a documented calibration setting that nothing reads, two documented location settings the launcher never forwards, two opt-in switches the daemon cannot see, an eval script that imports a deleted module, unused scoring inputs, a lane cleanup that only wording checks cover, and Python boosts for the retired memory database vocabulary.

### Purpose
Every setting the docs name either works under the daemon or is gone, and the doctor's cleanup command has a test that runs it.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ rg -n 'resolvedCalibration\b' .skilled/skills/system-skill-advisor/runtime --glob '!dist/**' --glob '!node_modules/**'
.skilled/skills/system-skill-advisor/runtime/lib/scorer/scoring-constants.ts:258:export function resolvedCalibration(): ScoringCalibration {

$ grep -n -E 'ROUTE_EXCLUSIONS_DIR|FEEDBACK_CALIBRATION_PATH' .skilled/bin/system-skill-advisor-launcher.cjs
(no output, exit 1)

$ sed -n 44p .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-outcome-rerank.mjs
const { outcomeWeightedRerank } = await import(join(DIST_SCORER, 'outcome-weighted-rerank.js'));
$ ls .skilled/skills/system-skill-advisor/runtime/lib/scorer/ | grep -i outcome
(no output, exit 1)
```
The function has one line that names it, its own definition. The launcher allowlist names neither location key. The script imports a module with no source file.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Delete `resolvedCalibration` and its override type, and the `SPECKIT_ADVISOR_CALIBRATION_OVERRIDE_JSON` rows in `ENV-REFERENCE.md` and `.env.example` (finding 1, operator decision: delete).
- Forward `SPECKIT_ADVISOR_FEEDBACK_CALIBRATION_PATH` and `SPECKIT_ADVISOR_ROUTE_EXCLUSIONS_DIR` through the launcher allowlist (finding 2).
- Delete `score-outcome-rerank.mjs`, its README row, its name in the corpus row and its entry in the holdout test (finding 3).
- Add a test that runs the apply phase's report and apply commands as the YAML spells them (finding 4).
- Delete query-class routing and the BM25 query-length switch, with the one test case that covered the first (finding 5, operator decision: delete).
- Delete the unused `hasExplicitWorkflowSignal` input and helper and the `semanticSearchCodeGraphBonus` constant (finding 6).
- Drop the `embedding`, `embeddings`, `vector` and `voyage` boosts and the two retired synonyms from the Python fallback (finding 7).
- Drop the two retired embedding columns from the projection fallback test's fixture table (Leftovers).
- Delete the untracked lane build output in the primary checkout's `dist/` (Leftovers, operator approved).

### Out of Scope
- Rewording the approval reason in `local-native-approved-divergences.json`. It is a dated reviewer record that the residue allowlist keeps on purpose, and it still names the cause of the divergence.
- A guard test that compares every daemon-read setting with the launcher allowlist (the review's Next item 2). Both instances it would catch are fixed here, and the test needs its own exception list.
- Changing what the review calls allowlisted by design: the `OLLAMA_` prefix forward in the behaviour runner and the two prompt texts in the routing parity test.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/scoring-constants.ts` | Modify | Remove the override function, its type and the unused constant |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts` | Modify | Remove query-class routing and the unused explicit-signal input |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/bm25.ts` | Modify | One fixed logistic midpoint replaces the query-length switch |
| `.skilled/bin/system-skill-advisor-launcher.cjs` | Modify | Two keys added to the child env allowlist |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` | Modify | Four boosts and two synonyms removed |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-outcome-rerank.mjs` | Delete | Imports a module that no longer exists |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md` | Modify | Script row removed, corpus row no longer names it |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts` | Modify | Consumer entry removed |
| `.skilled/skills/system-skill-advisor/runtime/tests/launcher-bootstrap.vitest.ts` | Modify | Case for the two forwarded keys |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/conflict-query-rerank.vitest.ts` | Modify | Query-class case and imports removed |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/projection-fallback-049-005.vitest.ts` | Modify | Two retired fixture columns removed |
| `.skilled/commands/doctor/scripts/tests/doctor-update-contract.test.cjs` | Modify | Case that runs both cleanup commands on a fixture checkout |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` and `.env.example` | Modify | Calibration override rows removed |
| `../spec.md` (016 parent) | Modify | Row 27 and its handoff row |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No documented advisor setting is silently dead: the calibration override is gone from code and docs, and the two location keys reach the daemon (findings 1 and 2) |
| REQ-002 | The doctor contract suite runs the YAML's report and apply commands and fails when the tool rejects them (finding 4) |
| REQ-003 | The advisor suite, the routing ratchets, the Python suite, the doctor suites and the residue gate pass on the final state, each read from its output and exit status |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The dead eval script and its three references are gone (finding 3) |
| REQ-005 | Query-class routing, the BM25 query-length switch and the unused scoring inputs are gone, with default scoring unchanged (findings 5 and 6) |
| REQ-006 | The Python fallback no longer boosts the retired memory database vocabulary (finding 7) |
| REQ-007 | The projection fixture and the primary checkout's `dist/` no longer carry lane leftovers |
| REQ-008 | The 016 phase map lists this packet as row 27 |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The advisor suite passes with the same skip count as the baseline, 4, and the scorer-eval, divergence and holdout ratchets pass unchanged.
- **SC-002**: The new contract case fails when the YAML apply command carries a flag the tool does not accept, and passes when restored.
- **SC-003**: `validate.sh --strict` prints `RESULT: PASSED` for 027 and for 016.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Removing scorer code shifts default routing | High | Every removed path was opt-in and off by default; the scorer-eval baseline ratchet must pass with no recapture |
| Risk | Dropping Python boosts shifts fallback routing | Med | The corpus ratchet, the divergence ratchet and the Python suite must pass unchanged |
| Risk | The new contract case touches real machine state | Med | Every location the tool reads points into a temp folder, location variables are removed from the child env, and the fixture checkout matches no running process |
| Dependency | The cleanup tool's `--db-dir` and `--socket-dir` flags | Low | The tool's own suite pins them |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The new contract case runs two short child processes and adds under one second to the doctor suite.
- **NFR-P02**: The scorer does less work per prompt, since the query classifier and the unused helper no longer run.

### Security
- **NFR-S01**: The launcher forwards only the two named keys. The existing filter test still proves an unlisted key such as `AWS_SECRET_ACCESS_KEY` is dropped.
- **NFR-S02**: The new contract case deletes nothing outside its temp folder.

### Reliability
- **NFR-R01**: The contract case cleans its temp folder in a `finally` block.
- **NFR-R02**: A cleanup command that exits non-zero fails the case with the tool's stderr in the message.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: an unset location key forwards nothing, and the daemon keeps its packaged default.
- Maximum input: the apply command's `[--shared-model delete|keep]` placeholder is bound to `keep`, the value a no answer gives.
- Failure path: a renamed or dropped tool flag makes the tool exit 2, and the case fails on that run.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | About 16 files, mostly deletions |
| Risk | 8/25 | Scorer code changes, all on paths that were off by default |
| Research | 3/20 | The review located each finding at file and line |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The operator chose deletion for the three dead settings and approved deleting the untracked build output.
<!-- /ANCHOR:questions -->

---
