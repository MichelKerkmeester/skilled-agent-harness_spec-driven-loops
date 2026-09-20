---
title: "Implementation Plan: Wave 006 - Excluded Aliases & Shared Reference Base"
description: "Plan for the validated advisor-probe + live-orchestrator dispatch recipe run sequentially across TV-005, SR-002 (3-probe battery), and SR-003."
trigger_phrases:
  - "wave 006 plan"
  - "excluded aliases shared base dispatch plan"
importance_tier: "high"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/006-excluded-aliases-and-shared-base"
    last_updated_at: "2026-07-07T15:15:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored plan.md"
    next_safe_action: "Author tasks.md and checklist.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "wave-006-excluded-aliases-shared-base"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Wave 006 - Excluded Aliases & Shared Reference Base

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | `skill_advisor.py` deterministic CLI probe; `opencode run` CLI live orchestrator dispatch; markdown playbook scenario contracts |
| **Framework** | Existing `manual_testing_playbook` `{PREFIX}-NNN` scenario contract shape |
| **Storage** | `.opencode/skills/sk-design/manual_testing_playbook/transform-verb-framing/`, `.opencode/skills/sk-design/manual_testing_playbook/shared-reference-base/` |
| **Testing** | `python3 skill_advisor.py "<prompt>" --threshold 0.8` + `opencode run --model openai/gpt-5.5-fast --variant medium --format json` |

### Overview

Ran the validated 4-step dispatch recipe sequentially across 5 dispatches: for each, (1) ran the deterministic advisor probe with the clean scenario prompt, (2) dispatched the real orchestrator with the same clean prompt plus the standard evaluation-call addendum (with or without the no-target clause depending on whether the prompt names a hypothetical local UI surface), (3) captured full JSON-lines stdout, and (4) graded the transcript strictly against the owning scenario file's own Pass/Fail Criteria section. No dispatches were backgrounded or parallelized; each ran to completion before the next started.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Read all 3 constituent scenario files in full (`audit-excluded-aliases.md`, `reference-base-backend-modes.md`, `shared-base-not-workflow.md`) before running any dispatch
- [x] Confirmed the validated dispatch recipe's exact invocation shape (advisor probe, then `opencode run` with addendum, `</dev/null` required)

### Definition of Done
- [x] `TV-005` dispatched, transcript captured, graded
- [x] `SR-002-P1` dispatched, transcript captured, graded
- [x] `SR-002-P2` dispatched, transcript captured, graded
- [x] `SR-002-P3` dispatched, transcript captured, graded
- [x] `SR-003` dispatched, transcript captured, graded
- [x] `dispatch-log.md` written with one row per dispatch
- [x] `description.json` + `graph-metadata.json` generated
- [x] `validate.sh --strict` passes with Errors:0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Sequential single-agent dispatch loop: read scenario -> decide the no-target-clause branch by inspecting the scenario's own exact prompt text -> advisor probe -> live orchestrator dispatch -> parse JSON-lines (`type":"text"` and `type":"tool"` events) -> grade against the scenario's own Pass/Fail Criteria -> next dispatch. No Workflow/parallel fan-out was used; the wave's own instructions require dispatches to run one at a time.

### Key Components

- **No-target-clause decision**: `TV-005` ("this card"), `SR-002-P1` ("this product dashboard"), `SR-002-P2` ("this onboarding flow"), and `SR-002-P3` ("this page") all name a hypothetical local UI surface with no literal repo target, so each got the non-empty no-target clause appended. `SR-003` is a hub-intake premise question about the shared reference base itself, naming no UI surface, so it got the empty clause.
- **Advisor-vs-orchestrator divergence handling**: for `TV-005` and `SR-002-P3` the deterministic advisor script's own top-1 was `sk-code`, not `sk-design`, diverging from the scenario's "Expected advisor behavior" prose. Per the scenario's own Pass/Fail Criteria (which grades live orchestrator mode resolution, not the standalone script), this was recorded as an observation in `dispatch-log.md` and did not by itself change the verdict, since the live orchestrator dispatch (the actual test) still correctly routed to `sk-design` and the expected mode in both cases.
- **JSON-lines parsing**: each transcript was parsed for `tool_use` events (to confirm which skills/packets loaded and which tool surface was exercised — confirming read-only `skill` tool calls only, no `Write`/`Edit`/`Bash`, for the 4 read-only modes) and `text` events (to confirm the model's own stated mode resolution and final answer content).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sk-design` orchestrator (via `opencode run`) | System under test | Dispatched, not modified | 5 saved JSON-lines transcripts |
| `skill_advisor.py` | Deterministic probe | Invoked read-only | 5 saved advisor outputs |
| This spec folder | New evidence artifact | Created | `validate.sh --strict` |

Required inventories:
- Same-class producers: sibling waves (`001`-`005`, `007`-`010`) run their own independent dispatches against the same `sk-design` skill concurrently in the parent Workflow; this wave's dispatches are read-only against the skill and do not mutate any shared state.
- Consumers of changed symbols: none — no `sk-design` source file was edited by this wave.
- Matrix axes: dispatch ID x {advisor top-1/confidence, resolved mode, resolved packet, cited shared resources, tool surface, verdict} — the grid `dispatch-log.md` records per row.
- Algorithm invariant: every verdict traces to a specific quoted line from its owning scenario's own Pass/Fail Criteria section, never a generic bar.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Scenario Intake
- [x] Read `audit-excluded-aliases.md`, `reference-base-backend-modes.md`, `shared-base-not-workflow.md` in full

### Phase 2: Sequential Dispatch Execution
- [x] `TV-005`: advisor probe -> orchestrator dispatch (no-target clause) -> transcript -> grade
- [x] `SR-002-P1`: advisor probe -> orchestrator dispatch (no-target clause) -> transcript -> grade
- [x] `SR-002-P2`: advisor probe -> orchestrator dispatch (no-target clause) -> transcript -> grade
- [x] `SR-002-P3`: advisor probe -> orchestrator dispatch (no-target clause) -> transcript -> grade
- [x] `SR-003`: advisor probe -> orchestrator dispatch (empty clause, hub-intake premise question) -> transcript -> grade

### Phase 3: Documentation & Verification
- [x] Write `dispatch-log.md` (one row per dispatch)
- [x] Write this phase's own `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`
- [x] Generate `description.json` + `graph-metadata.json`, run `validate.sh --strict`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Advisor probe | Deterministic top-1 skill + confidence per clean prompt | `skill_advisor.py --threshold 0.8` |
| Live orchestrator dispatch | Real mode resolution, packet loads, tool surface, final answer | `opencode run --model openai/gpt-5.5-fast --variant medium --format json` |
| Transcript grading | Strict match against each scenario's own Pass/Fail Criteria | Manual JSON-lines parse (`tool_use`/`text` events) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `system-skill-advisor/mcp_server/scripts/skill_advisor.py` | Probe tool | Available | Advisor step could not run; would need to skip to orchestrator-only grading |
| `opencode` CLI (`cli-opencode` executor) | Dispatch tool | Available | Real orchestrator dispatch step could not run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A saved transcript is later found to be corrupted, incomplete, or misgraded on a real re-review.
- **Procedure**: Re-run the single affected dispatch using the same validated recipe, overwrite the transcript file and the corresponding `dispatch-log.md` row; no other file in this wave depends on the specific transcript content, since verdicts are already captured as prose evidence.
<!-- /ANCHOR:rollback -->
