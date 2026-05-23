---
title: "Tasks: Packet 124 deep-agent-improvement correctness fixes"
description: "Task ledger for Level 3 packet 124 implementation and verification."
trigger_phrases:
  - "packet 124 tasks"
  - "DAI tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-deep-skill-evolution/005-deep-agent-improvement/004-correctness-fixes"
    recent_action: "Tracked packet 124 implementation and validation tasks."
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "codex"
    next_safe_action: "Finish validation tasks and mark completion evidence."
---
# Tasks: Packet 124 deep-agent-improvement correctness fixes

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Marker | Meaning |
| --- | --- |
| `[ ]` | Pending |
| `[x]` | Complete |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

Task format: `T### [P?] Description (path) [finding]`.

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read packet 123 research synthesis (`123.../research-report.md`) [context].
- [x] T002 Read packet 123 improvement roadmap (`123.../improvement-roadmap.md`) [context].
- [x] T003 Read packet 123 applicability table (`123.../applicability-table.md`) [context].
- [x] T004 Read `deep-agent-improvement` skill source and relevant references (`.opencode/skills/deep-agent-improvement/`) [context].
- [x] T005 Read `cli-guards.cjs` typed exit-code pattern (`.opencode/skills/deep-loop-runtime/scripts/lib/cli-guards.cjs`) [DAI-009].
- [x] T006 Read Level 3 templates (`.opencode/skills/system-spec-kit/templates/examples/level_3/`) [docs].

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Add typed error helper (`.opencode/skills/deep-agent-improvement/scripts/lib/typed-errors.cjs`) [DAI-009].
- [x] T011 Wire typed profile-generation errors (`generate-profile.cjs`) [DAI-009].
- [x] T012 Preserve child profile error types in scorer (`score-candidate.cjs`) [DAI-009].
- [x] T013 Replace zero-check perfect scoring with null dimensions (`score-candidate.cjs`) [DAI-010].
- [x] T014 Align plateau documentation to shipped enum (`SKILL.md`, `README.md`) [DAI-013].
- [x] T015 Bump skill version to highest changelog entry (`SKILL.md`) [DAI-017].
- [x] T016 Replace v1.4.0.0 placeholder content (`changelog/v1.4.0.0.md`) [DAI-018].
- [x] T017 Add promotion mirror sync TODO and flag (`promote-candidate.cjs`) [DAI-021].
- [x] T018 Fix manifest filename mismatch (`improve_deep-agent-improvement_*.yaml`, `improvement_config.json`) [DAI-014].
- [x] T019 Fix singular OpenCode paths in scanner (`scan-integration.cjs`) [DAI-016].
- [x] T020 Author Level 3 packet docs (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`) [docs].

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T030 Run `node --check` for modified `.cjs` scripts [syntax].
- [x] T031 Run targeted missing-profile behavior check [DAI-009].
- [x] T032 Run real-agent scoring smoke check [DAI-010].
- [x] T033 Run integration scanner smoke check [DAI-016].
- [x] T034 Run existing `deep-agent-improvement` tests if available [tests].
  - Evidence: Five Vitest files exist; `npx --no-install vitest run ...` attempted but failed because Vitest is not installed locally and npm registry DNS is blocked.
- [x] T035 Run OpenCode alignment verifier [alignment].
  - Evidence: `verify_alignment_drift.py --root .opencode/skills/deep-agent-improvement` passed with 0 findings.
- [x] T036 Generate `description.json` and `graph-metadata.json` [metadata].
  - Evidence: `generate-description.js` and `backfill-graph-metadata.js` completed.
- [x] T037 Run strict Level 3 spec validation [docs].
  - Evidence: `validate.sh ... --strict --verbose` passed with Errors: 0, Warnings: 0.
- [x] T038 Patch any validation fallout [docs].
  - Evidence: Header, ADR anchor, and frontmatter issues were patched and revalidated.

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] T100 Confirm all 5 P0 findings are closed.
- [x] T101 Confirm all 3 P1 findings are closed.
- [x] T102 Update `checklist.md` with final evidence.
- [x] T103 Update `implementation-summary.md` with final validation evidence and Commit Handoff.
- [x] T104 Provide final required output line.

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

| Finding | Tasks |
| --- | --- |
| DAI-009 | T005, T010, T011, T012, T031 |
| DAI-010 | T013, T032 |
| DAI-013 | T014 |
| DAI-014 | T018 |
| DAI-016 | T019, T033 |
| DAI-017 | T015 |
| DAI-018 | T016 |
| DAI-021 | T017 |

<!-- /ANCHOR:cross-refs -->

---

<!-- ANCHOR:architecture-tasks -->
## Architecture Tasks

- [x] A001 Capture error taxonomy, null scoring policy, and mirror sync policy in ADR-001.
- [x] A002 Keep typed error helper local to `deep-agent-improvement` rather than modifying `deep-loop-runtime`.
- [x] A003 Keep runtime mirror sync as an opt-in packet-124 mechanism with packet-127 TODO.
- [x] A004 Verify Level 3 ADR anchors pass strict validation.

<!-- /ANCHOR:architecture-tasks -->
