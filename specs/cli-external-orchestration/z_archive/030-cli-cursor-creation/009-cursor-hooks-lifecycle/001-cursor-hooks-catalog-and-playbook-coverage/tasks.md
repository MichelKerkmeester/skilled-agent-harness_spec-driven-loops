---
title: "Tasks: cli-cursor hooks feature-catalog + playbook coverage"
description: "Task breakdown for the cli-cursor hooks feature-catalog and playbook coverage phase."
trigger_phrases: ["cli-cursor hooks catalog tasks"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/009-cursor-hooks-lifecycle/001-cursor-hooks-catalog-and-playbook-coverage"
    last_updated_at: "2026-07-24T15:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "All 11 tasks complete; both LUNA dispatches independently verified"
    next_safe_action: "Run validate.sh --strict, commit"
    blockers: []
    key_files: ["spec.md", "plan.md", "checklist.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-hooks-catalog-implementation", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: cli-cursor hooks feature-catalog + playbook coverage

<!-- ANCHOR:notation -->
## Task Notation
`T### [P?] Description (file path)` - `[P]` marks tasks that could run in parallel.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 Re-read `spec-gate-prebind.mjs` fresh via `Read` — confirmed unchanged (same size 3261 bytes, same timestamp) and still uncommitted (`git status --porcelain` shows `??`) since the planning pass
- [x] T002 Decided: added a NEW `CU-020` scenario, documentation-only, SKIP-by-default (not extending `CU-013`/`CU-014` in place, to keep their focus and avoid asserting runtime behavior for an unreviewed file)
- [x] T003 Confirmed feature-catalog placement: hub-level `cli-external-orchestration/feature-catalog/`, new `cursor-hooks-and-spec-gate/` category, matching the existing 2 categories' shape exactly
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T004 Read `cli-codex/SKILL.md` in full (392 lines) before composing either dispatch prompt; confirmed auth via `codex login status` → "Logged in using ChatGPT"
- [x] T005 Dispatched `gpt-5.6-luna` (`cli-codex`, `-c model_reasoning_effort="xhigh" -c service_tier="fast"`, `--sandbox workspace-write`) to author the feature-catalog category + `cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md`, briefed on all 5 adapters' exact status including explicit hedging requirements for `spec-gate-prebind.mjs`
- [x] T006 Dispatched a second `gpt-5.6-luna` (same tier, sequential per single-dispatch discipline) to author `hooks/spec-gate-prebind-unreviewed.md` (CU-020) and update the root playbook's hooks summary + cross-reference index + scenario count (19→20)
- [x] T007 Independently re-verified both agents' output by direct file read (not trusting the self-reports): read `cursor-hooks-and-spec-gate.md` (7001 bytes) and `spec-gate-prebind-unreviewed.md` (8548 bytes) via the `Read` tool in full, confirming content quality and hedging-language accuracy for both
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T008 `validate_document.py` on `feature-catalog.md`, `cursor-hooks-and-spec-gate.md`, `manual-testing-playbook.md` (`--type reference`), and `spec-gate-prebind-unreviewed.md` → all 4 report `✅ VALID`, `Total issues: 0`
- [x] T009 Grep sweep: `grep -rn "spec-gate-prebind"` across both new docs → 21 hits, ALL carrying hedging language (`concurrent session`/`uncommitted`/`unreviewed`/`not yet reviewed`); a targeted regex for unhedged confirmed-working language near `spec-gate-prebind.mjs` → 0 matches. All 4 other adapter files (`session-start.ts`, `session-end.ts`, `spec-gate-enforce.mjs`, `spec-gate-classify.mjs`) confirmed present in both docs
- [x] T010 `bash validate.sh 030-cli-cursor-creation --recursive --strict` → `10 RESULT: PASSED` (all folders, including this new phase)
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
- [x] T011 `validate.sh 009-cursor-hooks-catalog-and-playbook-coverage --strict` passes 0/0; SC-001..SC-004 met; `implementation-summary.md` written
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
- Extends phase 004 (hook adapters) and phase 006 (manual-testing playbook).
- Authoring contracts: `sk-doc/create-feature-catalog/SKILL.md`, `sk-doc/create-manual-testing-playbook/SKILL.md`.
<!-- /ANCHOR:cross-refs -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `checklist.md`
