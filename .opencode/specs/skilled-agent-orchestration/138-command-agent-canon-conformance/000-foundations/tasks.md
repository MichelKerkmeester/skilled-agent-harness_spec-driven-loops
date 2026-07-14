---
title: "Tasks: foundations — deep-alignment lane-config authoring + live sk-doc adapter confirmation"
description: "Task breakdown for freezing BASE + census, authoring/resolving the deep-alignment lane-config, and confirming the sk-doc adapter returns real validate_document.py-keyed findings."
trigger_phrases:
  - "deep-alignment lane config tasks"
  - "canon conformance foundations tasks"
  - "sk-doc adapter confirmation tasks"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/138-command-agent-canon-conformance/000-foundations"
    last_updated_at: "2026-07-14T18:10:00Z"
    last_updated_by: "claude"
    recent_action: "Authored foundations task breakdown; all child gate tasks complete"
    next_safe_action: "Downstream phase 001 consumes the confirmed lane findings"
    blockers: []
    key_files:
      - "000-foundations/lane-config.json"
      - "000-foundations/alignment/deltas/iter-001.jsonl"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: foundations — deep-alignment lane-config authoring + live sk-doc adapter confirmation

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

_Freeze the immutable BASE + census._

- [x] T001 Pin the immutable pre-138 BASE commit; evidence: BASE = merge commit `9c1c523165` (recorded in `implementation-summary.md`).
- [x] T002 Record the command/agent census; evidence: 37 OpenCode command docs; 13 agents × 2 markdown runtimes (`.opencode/agents/` + `.claude/agents/` = 26 `.md`) + 13 `.codex/agents/*.toml`; Codex command prompts 0 → 37 (built in phase 003) (`implementation-summary.md` "What Was Built").
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

_Author the deep-alignment lane-config and resolve it via scoping.cjs._

- [x] T003 Author `lane-config.json` with the two sk-doc/docs lanes (`000-foundations/lane-config.json`); evidence: file holds 2 objects, both `authority: sk-doc` / `artifactClass: docs`; lane 1 command-docs globs (`create/design/doctor/memory/speckit/*.md` + `prompt-improve.md` + `goal_opencode.md`), lane 2 agent-docs globs (`.opencode/agents/*.md` + `.claude/agents/*.md`).
- [x] T004 Resolve the config via `scoping.cjs --lane-config` (REQ-001); evidence: `scoping.cjs --lane-config` exit 0, exactly 2 lanes resolved.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

_Live deep-alignment audit + real-finding confirmation._

- [x] T005 Run the live deep-alignment sk-doc audit with the frozen executor `openai/gpt-5.6-luna-fast --variant xhigh`; evidence: `alignment/deltas/iter-001.jsonl` iteration row `status: complete`, `findingsCount: 20`.
- [x] T006 Confirm the delta stream carries real `validate_document.py`-keyed findings (REQ-002); evidence: 20 P1 `missing_recommended_router_section` findings (router_contract / mode_routing / execution_targets / workflow_summary across 5 command docs), each `sourceTool: validate_document.py`, `validatorExitCode: 0` — disproving blanket `could-not-validate`.
- [x] T007 Persist the deep-alignment run artifacts in the child folder (REQ-004); evidence: `alignment/deep-alignment-state.jsonl`, `alignment/deltas/iter-001.jsonl`, `alignment/deep-alignment-config.json`, `alignment/deep-alignment-corpus.json`, `alignment/prompts/`, `alignment/iterations/` all present.
- [B] T008 Confirm loop convergence — reducer rolls deltas into `alignment/alignment-report.md`; evidence: report shows `NOT_APPLICABLE` / 0 iterations / 0 findings. BLOCKED by the headless reducer gap; documented deviation, deferred to `system-deep-loop/059-deep-alignment-mode/015-headless-model-matrix-hardening` (Phase B/C). REQ-002 satisfied by the raw delta stream instead.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 requirement gates (REQ-001, REQ-002) marked complete with evidence in `checklist.md` / `implementation-summary.md`.
- [x] P1 gates (REQ-003 census/BASE, REQ-004 artifacts persisted) complete with evidence.
- [x] P2 gate (REQ-005 executor frozen) recorded.
- [x] REQ-002 confirmed via the raw delta stream; the reducer-gap deviation is documented, not hidden.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Parent**: `../spec.md` (phase-parent 138)
<!-- /ANCHOR:cross-refs -->
