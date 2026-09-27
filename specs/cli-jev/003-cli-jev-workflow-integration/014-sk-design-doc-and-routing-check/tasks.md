---
title: "Tasks: Phase 14: sk-design-doc-and-routing-check"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 14: sk-design-doc-and-routing-check

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Rerun `node .skilled/bin/compiled-route.cjs --hub sk-design` for "make a bar chart of monthly revenue" and "generate a DESIGN.md from this website", and once with `SPECKIT_COMPILED_ROUTING=0`. Save stdout and exit codes (`scratch/baseline-routes.txt`)
- [ ] T002 [P] Run `node .skilled/bin/compiled-route-admission.cjs --hub sk-design --json` and save it (`scratch/baseline-admission.json`)
- [ ] T003 [P] Run `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-design` and save it as the baseline (`scratch/baseline-parent-check.txt`)
- [ ] T004 [P] Run the same-class inventory `rg -n 'isPass[^A-Za-z]|>= ?80' -g '*.md' .skilled/skills/sk-design/sk-design-md-generator` and save it (`scratch/baseline-gate-inventory.txt`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Rewrite rule 6 to match T001: on a route, tell the reader to take the mode from the front door and fall back to the routing section on a legacy sentinel or an error. On a sentinel, keep rule 6 and record the finding (`.skilled/skills/sk-design/SKILL.md:202-203`)
- [ ] T006 [B] Record the owner's gate choice, date and name. Blocked on the owner (`spec.md` section 10)
- [ ] T007 [B] Option A: rewrite each line T004 lists to say the gate passes on zero hard failures in `target`, `schema` and `provenance`, and turn `claims >= 80` expected signals into `failures: []`. Blocked on T006 (the 11 md-generator files in `spec.md` section 3)
- [ ] T008 [B] Option B instead of T007: after the operator's yes to the install, change `isValidationPass` and add one vitest case on each side of the rule. Blocked on T006 (`backend/scripts/validate.ts:699-701`, `backend/tests/validate.test.ts`)
- [ ] T009 Copy T002's output into the run folder (`.skilled/skills/sk-design/benchmark/reports/<run-label>/raw/admission.json`)
- [ ] T010 Write the run script with one `probe` per mode scenario, its prompt copied verbatim from the `Real user request:` bullet or the `Exact Prompt` cell, and run it into `raw/mode-routing.txt` (`.skilled/skills/sk-design/benchmark/reports/<run-label>/raw/mode-routing-run.sh`)
- [ ] T011 Write the report: run identity, the N of M figure over 53 scenarios, one row per scenario with its gold and routed mode, every n/a and every miss named, SD-007 recorded as found (`.skilled/skills/sk-design/benchmark/reports/<run-label>/skill-benchmark-report.md`)
- [ ] T012 Add the run's row to section 2 (`.skilled/skills/sk-design/benchmark/README.md`)
- [ ] T019 After T009 to T011 record the baseline, diagnose SD-007: read the scenario and its gold, its compiled route and the keywords `hub-router.json` gives chart and diagram, and write the cause into the report (`manual-testing-playbook/unknown-fallback/ambiguous-multi-intent.md`, `hub-router.json`)
- [ ] T020 [B] Put the smallest fix, a vocabulary change or a gold correction, to the sk-design owner and record the yes. Blocked on the owner (`spec.md` section 10)
- [ ] T021 [B] Apply the approved fix. Under the vocabulary option, re-mint sk-design's activation manifest with the routing owner's tool and confirm `compiled-route-status.cjs --hub sk-design` reports `compiled-serving`. Blocked on T020 (`hub-router.json` or the SD-007 frontmatter, `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-design/manifest.json`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Happy path: `grep -c "not in the compiled closure" .skilled/skills/sk-design/SKILL.md` prints 0 and the live route still prints `"action":"route"`
- [ ] T014 Edge cases: the kill-switch run prints the legacy sentinel and the new rule 6 names that case. The report's N and M match a count of the `raw/` captures
- [ ] T015 Gate check for the chosen option: the `rg` returns no match (A) or backend `npm test` exits 0 (B)
- [ ] T016 Scope: `git status --porcelain` lists only `.skilled/skills/sk-design/`, this phase folder and, under the SD-007 vocabulary option, sk-design's activation manifest
- [ ] T017 Rerun `parent-skill-check.cjs` and compare with T003. No new failure. The `12-lib` failure is the worktree provisioning fault phase 018 plans, not an sk-design fault
- [ ] T022 After T021: `compiled-route-admission.cjs --hub sk-design` prints 4 pass and exits 0, and a rerun of T010's script into a second capture shows no scenario that matched its gold in the baseline and misses now
- [ ] T018 Update `implementation-summary.md`, `acceptance-criteria.md` and `goal.md` with evidence, then run `validate.sh --strict` on this phase
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings
- [ ] CHK-012 [P1] Error handling implemented
- [ ] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual testing complete
- [ ] CHK-022 [P1] Edge cases tested
- [ ] CHK-023 [P1] Error scenarios validated
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented
- [ ] CHK-032 [P1] Auth/authz working correctly
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate
- [ ] CHK-042 [P2] README updated (if applicable)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Not yet verified. The phase is Planned.
<!-- /ANCHOR:summary -->

---
