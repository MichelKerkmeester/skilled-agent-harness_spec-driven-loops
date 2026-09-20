---
title: "Tasks: sk-design Claude-Parity Review Remediation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "review remediation"
  - "phase 014 tasks"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/014-review-remediation"
    last_updated_at: "2026-07-06T18:20:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "All 27 tasks completed"
    next_safe_action: "Commit and push"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "review-remediation-014"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: sk-design Claude-Parity Review Remediation

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read extract.ts, guided-run.ts, report-gen.ts, preview-gen.ts, proof.ts in full
- [x] T007 Read build-write-prompt.ts, types.ts, cluster.ts in full
- [x] T012 Read report-gen.ts and preview-gen.ts CSS-interpolation call sites in full
- [x] T017 [P] Read css-analyzer.ts transition-parsing section in full
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Seam B - Output/Artifact Policy (P1-002, P1-005, overlaps P1-004)

- [x] T002 Create output-policy.ts with resolveOutputPath() (design-md-generator/backend/scripts/output-policy.ts)
- [x] T003 Wire extract.ts through resolveOutputPath() (extract.ts:258-273)
- [x] T004 Wire guided-run.ts through resolveOutputPath() for both output validation and extraction cwd (guided-run.ts runPreflight + runGuided)
- [x] T005 Wire report-gen.ts, preview-gen.ts, proof.ts through resolveOutputPath() with overwrite/--force semantics
- [x] T006 Write adversarial path tests (relative/absolute/traversal/sandbox/missing-spec-folder) - tests/output-policy.test.ts (13 tests)

### Seam A - Prompt Data / Component Facts (P1-001, P1-003)

- [x] T008 Add data-only encoder for extracted live-site strings (P1-003) - build-write-prompt.ts asDataBlock()
- [x] T009 Surface deterministic component facts through the encoder (P1-001) - build-write-prompt.ts componentFacts()
- [x] T010 [P] Write malicious-string prompt-injection test - tests/build-write-prompt.test.ts
- [x] T011 [P] Write component-facts-present test - tests/build-write-prompt.test.ts

### Seam C - Renderer CSS-Value Safety (P1-006, P1-008)

- [x] T013 Create render-safety.ts with property-specific sanitizers (color/length/font-weight/font-family/shadow)
- [x] T014 Wire report-gen.ts dark-mode CSS variable injection through render-safety.ts (P1-006) - report-gen.ts:544 renderVarRow, plus inferPreviewTokens/color-swatch/typo-row/shadow-row/radius-row
- [x] T015 Wire preview-gen.ts source-derived CSS token injection through render-safety.ts (P1-008) - preview-gen.ts top-level bgColor/textColor/primary/fontFamily plus typo-row/radius/shadow sites
- [x] T016 Write malformed-CSS-value fixture tests - tests/render-safety.test.ts (15 tests) + tests/report-preview-overwrite.test.ts integration check

### Seam D - Transition Parser Correctness (P1-007)

- [x] T018 [P] Replace value.split(',') with paren-depth-aware transition-list parsing (css-analyzer.ts splitTopLevelCommas + splitWhitespaceRespectingParens)
- [x] T019 [P] Write cubic-bezier/steps/multi-transition regression tests - tests/css-analyzer-transitions.test.ts (5 tests)

### Seam E + P2 Advisories (P1-004, P2-001, P2-002, P2-003)

- [x] T020 Align report-preview.md overwrite-behavior claim with implemented guard (P1-004) - report-preview.md Output paths section + Validation table
- [x] T021 Wire procedure-card schema lint into existing canon checker (P2-001) - shared/scripts/procedure-card-schema-check.mjs, verified 14/14 real cards pass + negative-case test catching 8 injected violations
- [x] T022 Resolve duplicate benchmark artifact naming in 012 decision-record.md (P2-002) - ADR-004 designates after-012-routing-rigor/ canonical, documents after-d3-proxy/ as named-deprecated (no deletion - out of scope for a closed phase)
- [x] T023 Add tests for focused extraction modules currently lacking coverage (P2-003) - tests/motion-extract.test.ts, tests/icon-detect.test.ts, tests/design-boundary-detect.test.ts (15 tests)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T024 Run full backend test suite, confirm all pass - 134/134 passing (`npx vitest run` in design-md-generator/backend)
- [x] T025 Run validate.sh --strict on the phase folder
- [x] T026 Update checklist.md with evidence
- [x] T027 Write implementation-summary.md
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Backend test suite passing (134/134)
- [x] validate.sh --strict passes
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source Review**: `.opencode/specs/sk-design/009-sk-design-claude-parity/review/review-report.md`
<!-- /ANCHOR:cross-refs -->
