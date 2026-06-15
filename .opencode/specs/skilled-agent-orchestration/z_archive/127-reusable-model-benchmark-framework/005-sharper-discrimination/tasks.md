---
title: "Tasks: Sharper discrimination — harder non-saturating fixtures + n=5 CI-certified M3-vs-MiMo margin"
description: "Task Format: T### [P?] Description (file path) — mapped 1:1 to REQ-001..004 / SC-001..004"
trigger_phrases:
  - "sharper discrimination tasks"
  - "harder fixtures tasks"
  - "n=5 ci-certified run"
  - "anti-saturation tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/127-reusable-model-benchmark-framework/005-sharper-discrimination"
    last_updated_at: "2026-06-02T10:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "De-risk gate fired: 3 computational fixtures saturated; pivoted to validation (006)"
    next_safe_action: "Continue in 006 — de-risk + run the validation-heavy fixture pack"
    blockers: []
    key_files:
      - ".opencode/skills/deep-improvement/assets/model-benchmark/benchmark-fixtures"
      - ".opencode/skills/deep-improvement/assets/model-benchmark/benchmark-profiles/capability-m3-vs-mimo-v2.json"
      - ".opencode/skills/deep-improvement/scripts/model-benchmark/tests/sweep-isolation.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "tasks-127-005"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions: []
---
# Tasks: Sharper discrimination

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

Requirement mapping: Phase 1 → REQ-002 (validated oracles) + REQ-001 (non-saturating fixture pack scaffold); Phase 2 → REQ-002 (oracle validation) + SC-001 (fixtures parse + ≥18 oracle cases); Phase 3 → REQ-003 (sharper verdict) + REQ-004 (repo safety + honest verdict) + SC-002/SC-003/SC-004.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Create `harder-semver-compare.json` — semverCompare, 24 adversarial oracle cases (semver.org §11 precedence + pre-release identifiers + build-metadata-ignored), "return ONLY the function source as text; do NOT write files" (`.opencode/skills/deep-improvement/assets/model-benchmark/benchmark-fixtures/harder-semver-compare.json`) [REQ-001]
- [x] T002 Create `harder-normalize-path.json` — normalizePath, 24 oracle cases (Unix `..` beyond root, `.`, multi-slash, trailing-slash, empty) (`benchmark-fixtures/harder-normalize-path.json`) [REQ-001]
- [x] T003 Create `harder-int-to-words.json` — intToWords, 24 oracle cases (non-negative integer → American-English words: hyphenation, no "and", scale words, zero) (`benchmark-fixtures/harder-int-to-words.json`) [REQ-001]
- [x] T004 Create sharper profile `capability-m3-vs-mimo-v2.json` — fixtures [harder-semver-compare, harder-normalize-path, harder-int-to-words, hard-roman-to-int], models MiniMax-M3 + mimo-v2.5-pro (cli-opencode, variant high), `sampling.samplesPerCell: 5`, correctness gate 1.0, `reporting.groupBy: model` (`.opencode/skills/deep-improvement/assets/model-benchmark/benchmark-profiles/capability-m3-vs-mimo-v2.json`) [REQ-003]
- [x] T005 Validate the profile — `profile-validator.cjs` → valid (`benchmark-profiles/capability-m3-vs-mimo-v2.json`) [REQ-003]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Validate `harder-semver-compare` oracle through the real `code-task-scorer.cjs`: reference impl 1.0, deliberately-wrong impl 0.33 (`code-task-scorer.cjs`) [REQ-002]
- [x] T007 Validate `harder-normalize-path` oracle through the real `code-task-scorer.cjs`: reference impl 1.0, deliberately-wrong impl 0.79 (`code-task-scorer.cjs`) [REQ-002]
- [x] T008 Validate `harder-int-to-words` oracle through the real `code-task-scorer.cjs`: reference impl 1.0, deliberately-wrong impl 0.42 (`code-task-scorer.cjs`) [REQ-002]
- [x] T009 [P] Extend fixture-shape coverage for the new harder pack (`.opencode/skills/deep-improvement/scripts/model-benchmark/tests/sweep-isolation.vitest.ts`) [SC-001]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run full suite — `cd .opencode/skills/deep-improvement/scripts && npx vitest run model-benchmark/tests/` → 153 passed, exit 0 (new fixtures parse + carry 24 oracle cases each) [SC-001]
- [x] T011 Ran the de-risk sweep (n=2, 16 cells, 0 pollution/orphans) — result: all 3 computational fixtures SATURATED (both models 1.0); only kept `hard-roman-to-int` showed MiMo's 0.94 slip [REQ-001, SC-002]
- [~] T012 Full n=5 sweep — SUPERSEDED: de-risk gate (saturation) → did not fire the foregone-tie run; the n=5 validation run lives in 006 [REQ-003, SC-003 → 006]
- [~] T013 `eval/synthesis.md` — SUPERSEDED: the negative-result synthesis is in `implementation-summary.md`; the CI-certified verdict is carried by 006 [REQ-003/004, SC-003/004 → 006]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks resolved (T001–T011 done; T012–T013 superseded by 006 per the de-risk gate)
- [x] No `[B]` blocked tasks remaining
- [x] Build verification passed — profile valid; oracles validated (1.0 vs 0.33/0.79/0.42); suite 153 passed exit 0

**Outcome:** the de-risk gate worked as intended — saturation on the 3 computational fixtures (both models 1.0) stopped the full run, and the effort iterated to validation-heavy fixtures (006) instead of spending ~100 min on a foregone tie. The discriminating signal for this model pair is input-validation strictness, not computational difficulty.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md` (REQ-001..004, SC-001..004)
- **Plan**: See `plan.md`
- **Verification**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
