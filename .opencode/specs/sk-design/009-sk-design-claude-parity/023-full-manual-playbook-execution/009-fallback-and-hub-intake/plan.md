---
title: "Implementation Plan: Wave 009 - Fallback & Hub-Manager Intake Dispatches"
description: "Plan for the 6 sequential opencode-run dispatches (FR-001-audit, FR-002-motion, HM-001..HM-004) and their criteria-cited grading."
trigger_phrases:
  - "wave 009 plan"
  - "fallback hub intake dispatch plan"
importance_tier: "high"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/009-fallback-and-hub-intake"
    last_updated_at: "2026-07-07T17:25:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored plan.md"
    next_safe_action: "Author tasks.md and checklist.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "wave-009-fallback-hub-intake"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Wave 009 - Fallback & Hub-Manager Intake Dispatches

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | `opencode run` CLI (real executor: `openai/gpt-5.5-fast`, `--variant medium`, `--format json`); `skill_advisor.py` deterministic probe script |
| **Framework** | `manual_testing_playbook` `{PREFIX}-NNN` scenario contract shape; the validated dispatch recipe shared across all `023-full-manual-playbook-execution` waves |
| **Storage** | `/tmp/skd-<dispatch-id>-response.jsonl` transcripts; this spec folder's own documentation |
| **Testing** | Manual grading against each scenario file's own Pass/Fail Criteria section |

### Overview

Six dispatches, run strictly one at a time per the cli-opencode single-dispatch-per-agent rule: two fallback/resilience scenarios (`FR-001`'s `audit` variant, `FR-002`'s `motion` variant) and four hub-manager-intake scenarios (`HM-001` through `HM-004`). Each dispatch followed the same 4-step recipe: deterministic advisor probe on the clean exact prompt, real `opencode run` dispatch with the standard evaluation addendum (and the hypothetical-local-target clause only where the scenario names a hypothetical local UI surface), full JSON-lines transcript capture, and a verdict graded strictly against the scenario file's own Pass/Fail Criteria.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Read all 6 constituent scenario files in full (`no-card-matches-fallback.md`, `direct-fallback-without-subagents.md`, `context-first-intake.md`, `visible-plan-before-build.md`, `verifier-cadence-pause.md`, `design-mode-pairing-before-run.md`)
- [x] Located the Level 2 documentation template shape from `../../022-benchmark-rerun-and-coverage-fill/`
- [x] Read the relevant hub `SKILL.md` sections (`Manager Intake Before Routing`, `Visible Plan Before Design or Build Work`, `Proof Gates and Verifier Cadence`, `Transports and Consumers`) and `design-motion`/`design-audit`/`design-mcp-open-design` `SKILL.md` sections needed to grade accurately

### Definition of Done
- [x] All 6 dispatches executed sequentially, each with a captured JSON-lines transcript
- [x] Each dispatch graded PASS/PARTIAL/FAIL/SKIP citing the scenario file's own criterion line
- [x] `dispatch-log.md` written with one row per dispatch
- [x] `description.json` and `graph-metadata.json` generated
- [x] `validate.sh --strict` clean (Errors: 0)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Sequential single-dispatch execution: advisor probe (deterministic, `--threshold 0.8`) -> real orchestrator dispatch (`timeout 300 opencode run ... </dev/null`, capturing JSON-lines stdout) -> parse `type:"text"`/`type:"tool_use"` lines to reconstruct the model's reasoning, resolved mode/packet loads, and tool-call sequence -> grade against the scenario file's own Pass/Fail Criteria, citing the exact line.

### Key Components

- **`FR-001-audit` authored-prompt gap**: the scenario file (`no-card-matches-fallback.md`) gives only the `foundations` exact prompt verbatim; the `interface`/`motion`/`audit`/`md-generator` variants are described only by their expected fallback-line text, not an exact prompt string. Authored an `audit`-mode narrow-advisory prompt following the same structural pattern (mode-hint prefix, narrow single-property advisory question, explicit "state whether a procedure card applies" instruction), deliberately avoiding every `design-audit` procedure-card trigger word (`accessibility`, `WCAG`, `contrast`, `keyboard`, `focus`, `form`, `release-readiness`, `AI-template`, `slop`, `model-tell`, `full pre-delivery polish`) so the no-card-fallback path is the one actually exercised.
- **Advisor-probe instability observed and documented, not corrected**: several standalone `skill_advisor.py` probes returned noisy or off-target results (native daemon intermittently down, falling back to a keyword-heavy local scorer that occasionally surfaced `sk-code`, `memory:save`, or `mcp-figma` ahead of `sk-design`). Per the recipe, these were recorded as observed, not treated as failures — the real dispatch's own internal `advisor_recommend` tool call (visible inside each transcript) is the signal actually graded where the scenario's criteria reference advisor confidence (`HM-004`).
- **`HM-004` real external side effect**: the live Open Design MCP daemon was actually running in this environment (the task brief flagged a possible SKIP/timeout as an acceptable outcome, but that branch did not occur); the dispatch created a real project (`linear-grounded-settings-page`) and started a real generation run (`b8362f10-b306-4254-83d7-2bfc343183dc`). Graded the dispatch's pairing/ordering behavior per `HM-004`'s own criteria (unaffected by daemon liveness) and separately flagged the side effect for operator awareness.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/sk-design/manual_testing_playbook/07--fallback-and-resilience/` | Scenario source | Read-only, no edits | Full-file reads before dispatching |
| `.opencode/skills/sk-design/manual_testing_playbook/08--hub-manager-intake/` | Scenario source | Read-only, no edits | Full-file reads before dispatching |
| `.opencode/skills/sk-design/SKILL.md`, `design-motion/SKILL.md`, `design-audit/SKILL.md`, `design-mcp-open-design/SKILL.md` | Grading references | Read-only, no edits | Grep + targeted reads of the exact contract sections cited by each scenario's Pass/Fail Criteria |
| Live Open Design MCP daemon | External system | `HM-004` dispatch created 1 project + started 1 run | Confirmed via the dispatch's own `open-design_create_project`/`open-design_start_run` tool-call outputs in the captured transcript |

Required inventories:
- Same-class producers: other `023-full-manual-playbook-execution` waves running concurrently in parallel sessions (confirmed via `/tmp/skd-*-response.jsonl` listing showing other waves' in-flight transcripts) — no file-path collisions since each wave owns a distinct dispatch-id prefix and its own spec-folder path.
- Consumers of changed symbols: none — this wave produces no source-file or playbook-file changes, only spec-folder documentation.
- Matrix axes: dispatch-id x {advisor probe result, real dispatch transcript, scenario's own Pass/Fail Criteria, verdict} — the grading grid every dispatch in `dispatch-log.md` follows.
- Algorithm invariant: every verdict cites the exact scenario-file criterion line it rests on; no verdict is asserted against a generic bar.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Scenario Reading & Recipe Setup
- [x] Read all 6 constituent scenario files in full
- [x] Read hub/mode `SKILL.md` sections needed to grade each scenario's contract-specific claims

### Phase 2: Sequential Dispatch Execution
- [x] `FR-001-audit`: advisor probe -> authored-prompt real dispatch -> transcript -> grade
- [x] `FR-002-motion`: advisor probe -> exact-prompt real dispatch -> transcript -> grade
- [x] `HM-001`: advisor probe -> exact-prompt real dispatch -> transcript -> grade
- [x] `HM-002`: advisor probe -> exact-prompt real dispatch -> transcript -> grade
- [x] `HM-003`: advisor probe -> exact-prompt real dispatch -> transcript -> grade
- [x] `HM-004`: advisor probe -> exact-prompt real dispatch -> transcript -> grade

### Phase 3: Documentation & Verification
- [x] Write `dispatch-log.md` with one row per dispatch
- [x] Write this wave's Level 2 spec-folder documentation
- [x] Generate `description.json` and `graph-metadata.json`
- [x] Run `validate.sh --strict` and fix anything that fails
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Advisor probe | Deterministic top-1 skill + confidence per clean exact prompt | `skill_advisor.py --threshold 0.8` |
| Real dispatch | Full orchestrator behavior (routing text, tool calls, resolved mode/packet, final response) | `opencode run --model openai/gpt-5.5-fast --variant medium --format json` |
| Criteria-cited grading | Each dispatch's transcript vs. its scenario file's own Pass/Fail Criteria | Manual line-by-line comparison, citing the exact criterion |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Live `opencode run` executor (`openai/gpt-5.5-fast`) | Verification tool | Available, all 6 dispatches completed within timeout | Would need router-mode-only grading, a weaker signal |
| Live Open Design MCP daemon | External system (only exercised by `HM-004`) | Unexpectedly live; real project/run created | None — the task brief treated a SKIP/timeout as an equally valid, gradeable outcome |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A verdict in `dispatch-log.md` turns out to be miscited against the wrong criterion on a later re-read.
- **Procedure**: `git restore` this spec folder's docs; no source-code or playbook file was touched, so no other rollback surface exists. The one live side effect (`HM-004`'s Open Design project/run) is external to this repo and not reversible by a `git` operation; it is an operator cleanup decision (see `spec.md` Open Questions).
<!-- /ANCHOR:rollback -->
