# Tasks: sk-code--opencode Alignment Hardening

<!-- SPECKIT_LEVEL: 3 -->
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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Capture baseline command/output artifact (`853` scanned, `354` violations) (`.opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py`)
- [ ] T002 Define fixture matrix for all known defects (`.opencode/skill/sk-code--opencode/tests/fixtures/alignment_drift/`)
- [ ] T003 [P] Add fixture: noise directories (`z_archive`, `context`, `scratch`, `memory`, `research`, `asset`, `test`) (`.opencode/skill/sk-code--opencode/tests/fixtures/alignment_drift/noise/`)
- [ ] T004 [P] Add fixture: overlapping and repeated roots (`.opencode/skill/sk-code--opencode/tests/fixtures/alignment_drift/roots/`)
- [ ] T005 [P] Add fixture: TS production vs test/asset applicability (`.opencode/skill/sk-code--opencode/tests/fixtures/alignment_drift/typescript/`)
- [ ] T006 [P] Add fixture: `.mts` coverage (`.opencode/skill/sk-code--opencode/tests/fixtures/alignment_drift/typescript/`)
- [ ] T007 [P] Add fixture: JSONC line-mapping and `tsconfig` comments (`.opencode/skill/sk-code--opencode/tests/fixtures/alignment_drift/jsonc/`)
- [ ] T008 Author failing regression tests mapped to REQ-002..REQ-007 (`.opencode/skill/sk-code--opencode/tests/test_verify_alignment_drift.py`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T009 Implement normalized root deduplication (`.opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py`)
- [ ] T010 Implement file-level dedupe to prevent overlap double scans (`.opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py`)
- [ ] T011 Implement directory noise exclusion policy (`.opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py`)
- [ ] T012 Add `.mts` to supported extension map and routing (`.opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py`)
- [ ] T013 Implement TS module-header applicability policy (exclude tests/assets, keep production modules) (`.opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py`)
- [ ] T014 Make JSONC block-comment stripping line-preserving (`.opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py`)
- [ ] T015 Resolve `tsconfig` comment false-positive behavior (`.opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py`)
- [ ] T016 [P] Refactor helpers for policy and dedupe readability (`.opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py`)
- [ ] T017 [P] Update tests for passing expectations and line assertions (`.opencode/skill/sk-code--opencode/tests/test_verify_alignment_drift.py`)
- [ ] T018 [P] Update verifier documentation with policy rules and constraints (`.opencode/skill/sk-code--opencode/README.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T019 Run verifier unit/integration tests (`python3 -m pytest .opencode/skill/sk-code--opencode/tests/test_verify_alignment_drift.py -q`)
- [ ] T020 Run baseline comparison command using same roots pre/post (`python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root .`)
- [ ] T021 Validate success criteria SC-001..SC-005 with captured evidence (`spec.md`, `checklist.md`)
- [ ] T022 Update checklist evidence and mark completed items (`checklist.md`)
- [ ] T023 Finalize implementation summary for completed state (`implementation-summary.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Baseline delta and rule distribution evidence captured
- [ ] All P0 checklist items verified
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification**: See `checklist.md`
- **Architecture Decisions**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
