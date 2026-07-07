---
title: "Implementation Plan: Wave 008 - Parity-Proof and Fallback-Start"
description: "Plan for running PB-006, PB-007, and the FR-001 foundations/interface/motion trio through the validated advisor-probe-then-orchestrator-dispatch recipe, sequentially, then grading strictly against each scenario's own criteria."
trigger_phrases:
  - "wave 008 plan"
  - "parity proof fallback start plan"
importance_tier: "high"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/008-parity-proof-and-fallback-start"
    last_updated_at: "2026-07-07T17:05:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored plan.md"
    next_safe_action: "Author tasks.md and checklist.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pb-fr-wave-008"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Wave 008 - Parity-Proof and Fallback-Start

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | `python3 skill_advisor.py` (deterministic advisor probe); `opencode run` CLI (real orchestrator dispatch); JSON-lines transcript parsing |
| **Framework** | `manual_testing_playbook` scenario contract shape; the validated 4-step dispatch recipe (probe, dispatch, capture, grade) |
| **Storage** | `.opencode/skills/sk-design/manual_testing_playbook/`, `/tmp/skd-*-response.jsonl` (scratch transcripts) |
| **Testing** | Strict per-scenario grading against each file's own `Pass/Fail Criteria` section |

### Overview

Read all three scenario source files in full first (ground truth for exact prompts and criteria), then ran the five assigned dispatches strictly one at a time: `PB-006`, `PB-007`, `FR-001-foundations` used their exact prompt text verbatim; `FR-001-interface` and `FR-001-motion` used narrow advisory prompts authored to the foundations case's own pattern, since the source file only ships one exact prompt for the trio. Each dispatch ran the deterministic advisor probe first, then the real `opencode run` dispatch with the standalone-evaluation addendum and the correct `NO_TARGET_CLAUSE` form decided per-prompt. Every transcript was parsed for its final text answer and full tool-call sequence before grading.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Read `shared-polish-gate-selection-proof.md`, `interface-variation-set-selection-proof.md`, and `no-card-matches-fallback.md` in full before dispatching anything
- [x] Read `polish_gate_orchestration.md`, `design-interface/SKILL.md`'s Procedure Card Selection table, and `design-motion/SKILL.md`'s Procedure Card Selection table to confirm each prompt's `NO_TARGET_CLAUSE` decision and card-trigger avoidance before authoring the two non-verbatim `FR-001` prompts

### Definition of Done
- [x] `PB-006` dispatched and graded against its own Pass/Fail Criteria
- [x] `PB-007` dispatched and graded against its own Pass/Fail Criteria
- [x] `FR-001-foundations` dispatched and graded against `no-card-matches-fallback.md`'s Pass/Fail Criteria
- [x] `FR-001-interface` authored-to-pattern, dispatched, and graded
- [x] `FR-001-motion` authored-to-pattern, dispatched, and graded
- [x] `dispatch-log.md` written with one row per dispatch, each verdict citing a specific criterion line
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Sequential single-agent execution of the validated 4-step recipe (advisor probe -> real orchestrator dispatch -> transcript capture -> strict per-file grading), run one dispatch at a time per the cli-opencode one-dispatch-per-agent rule. No parallelization or backgrounding was used for this agent's own 5 dispatches.

### Key Components

- **`NO_TARGET_CLAUSE` decision per prompt**: `PB-006`'s "this nearly finished checkout UI" and `PB-007`'s "this fintech onboarding flow" both name a hypothetical local UI target that does not exist in this repo, so the non-empty `No literal target file exists...` clause applied to both. `FR-001-foundations`'s "this existing neutral token name" is a token-naming question with no UI page/component target at all, so the empty clause applied. The two authored `FR-001` prompts ("this existing card component", "this existing modal") both name a hypothetical local UI element matching the rule's own example list (`"this modal"` is explicitly listed), so the non-empty clause applied to both.
- **Card-trigger avoidance for the two authored `FR-001` prompts**: `FR-001-interface`'s corner-radius question avoids every row in `design-interface/SKILL.md`'s Procedure Card Selection table (no missing-facts, greenfield-direction, wireframe, multi-direction, prototype, deck, or final-polish language). `FR-001-motion`'s entrance-duration question avoids `design-motion/SKILL.md`'s single trigger row (hover/active/focus/disabled/loading/selected/navigation/forms/custom-widgets/missing-feedback) and avoids final-polish language, so neither `interaction_states_pass.md` nor `polish_gate_orchestration.md` should fire.
- **Strict-criteria grading over generic-bar grading**: `PB-007`'s response independently satisfied every disjunctive PASS element except one (never naming "seed of thought" or citing `variation_diversity.md` in its final text, despite reading the file as a tool call), which is also one of the file's own explicitly disjunctive FAIL triggers — graded `PARTIAL`, not rounded up to `PASS` on the strength of the rest of the response.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sk-design` orchestrator dispatches (via `opencode run`) | Live evaluation target | 5 standalone, read-only evaluation calls | Full JSON-lines transcript captured per dispatch, tool-call sequence inspected for mutating-tool absence |
| `.opencode/skills/sk-design/manual_testing_playbook/06--parity-behavior/`, `07--fallback-and-resilience/` | Scenario source of truth | Read only, not edited | Confirmed via `git status` showing no changes under these paths from this wave's work |

Required inventories:
- Same-class producers: no other in-flight work in this session touches `sk-design`'s skill files during this wave's dispatches; each dispatch is a standalone evaluation call per the addendum text.
- Consumers of changed symbols: none — this wave produces no source-code or skill-file changes, only spec-folder documentation and scratch transcripts.
- Matrix axes: scenario x {advisor probe, orchestrator dispatch, transcript capture, strict grading} — every one of the 5 assigned dispatches passed through all four steps.
- Algorithm invariant: every verdict traces to one specific, cited line from that scenario file's own Pass/Fail Criteria section, never a generic pass/fail bar.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Ground Truth Reading
- [x] Read `shared-polish-gate-selection-proof.md`, `interface-variation-set-selection-proof.md`, `no-card-matches-fallback.md` in full
- [x] Read the Level 2 structural template from `../022-benchmark-rerun-and-coverage-fill/`

### Phase 2: Dispatch Execution (sequential, one at a time)
- [x] `PB-006`: advisor probe -> `opencode run` dispatch -> transcript captured at `/tmp/skd-PB006-response.jsonl`
- [x] `PB-007`: advisor probe -> `opencode run` dispatch -> transcript captured at `/tmp/skd-PB007-response.jsonl`
- [x] `FR-001-foundations`: advisor probe -> `opencode run` dispatch -> transcript captured at `/tmp/skd-FR001-foundations-response.jsonl`
- [x] `FR-001-interface` (authored-to-pattern): advisor probe -> `opencode run` dispatch -> transcript captured at `/tmp/skd-FR001-interface-response.jsonl`
- [x] `FR-001-motion` (authored-to-pattern): advisor probe -> `opencode run` dispatch -> transcript captured at `/tmp/skd-FR001-motion-response.jsonl`

### Phase 3: Grading and Documentation
- [x] Parsed each transcript's final text answer and tool-call sequence
- [x] Read `polish_gate_orchestration.md`, `design-interface/SKILL.md`, `design-motion/SKILL.md` to verify grading claims against real source, not memory
- [x] Graded each dispatch PASS/PARTIAL/FAIL with a cited criterion line
- [x] Wrote `dispatch-log.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Advisor probe | Deterministic top-1 skill + confidence for each of the 5 clean prompts | `skill_advisor.py --threshold 0.8` |
| Real orchestrator dispatch | Actual `sk-design` routing, mode resolution, procedure-card selection, and tool-surface behavior | `opencode run --model openai/gpt-5.5-fast --variant medium --format json` |
| Transcript inspection | Confirm no `Write`/`Edit`/`Bash` mutating tool calls occurred in any of the 5 read-only-mode dispatches | Manual JSON-lines parse of `type: tool_use` entries |
| Criteria-line grading | Confirm each verdict traces to the scenario file's own Pass/Fail Criteria wording | Manual cross-reference against the 3 source scenario files |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `skill_advisor.py` runnable from repo root | Prerequisite | Available | Would lose the deterministic advisor-confidence half of the evidence for each dispatch |
| `opencode run` CLI reachable with `--dir` pointed at this repo | Prerequisite | Available | Would block the real-dispatch half of the recipe entirely |
| Scenario source files unchanged since read | Prerequisite | Confirmed unchanged (read-only wave) | Grading would rest on stale criteria |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A future re-read of the scenario source files shows this wave's grading rested on stale or misquoted criteria.
- **Procedure**: Re-run the affected dispatch(es) via the same validated recipe and correct the verdict row in `dispatch-log.md` and `implementation-summary.md`; no source-code rollback is needed since this wave made no `sk-design` code changes.
<!-- /ANCHOR:rollback -->
