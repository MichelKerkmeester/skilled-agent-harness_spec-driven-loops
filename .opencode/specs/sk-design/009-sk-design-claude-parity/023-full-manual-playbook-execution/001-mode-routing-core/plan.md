---
title: "Implementation Plan: Phase 001 - Mode Routing Core (Wave)"
description: "Plan for running the validated Gate-3-bypass dispatch recipe against MR-001, MR-002, MR-003, MR-004, MR-006, sequentially, then grading each against its own scenario file's Pass/Fail Criteria."
trigger_phrases:
  - "wave 001 plan"
  - "mode routing dispatch plan"
importance_tier: "high"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/001-mode-routing-core"
    last_updated_at: "2026-07-07T17:05:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored plan.md"
    next_safe_action: "Author tasks.md and checklist.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mode-routing-core-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Phase 001 - Mode Routing Core (Wave)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | `skill_advisor.py` deterministic local/native advisor scorer; `opencode run --model openai/gpt-5.5-fast --variant medium` real dispatch; JSON-lines transcript parsing |
| **Framework** | `manual_testing_playbook/01--mode-routing/*.md` scenario contract shape |
| **Storage** | `/tmp/skd-<id>-response.jsonl` transcripts; this wave's spec-folder docs |
| **Testing** | Manual grading against each scenario file's own "Pass/Fail Criteria" section |

### Overview

Ran the phase-parent's validated 4-step recipe once per assigned dispatch, strictly sequential (no backgrounding, per cli-opencode's one-dispatch-at-a-time rule): (1) advisor probe on the clean exact prompt, (2) real `opencode run` dispatch with the standalone-evaluation dispatch-note addendum appended, (3) capture full JSON-lines stdout, (4) grade against the scenario's own criteria. 4 of 5 dispatches applied the no-target clause (each names a hypothetical local UI surface — pricing page, dashboard, command menu, checkout UI, menu — that doesn't exist in this repo); none of the 5 needed the empty-clause branch since none targets a real external URL, a seeded fixture, or a non-UI-surface request.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Read all 5 assigned scenario files (plus MR-005/MR-007, which belong to other waves, were not read) in full before any dispatch
- [x] Confirmed the validated dispatch recipe verbatim from the orchestrating agent's instructions (smoke-tested 5x before phase 023 started)

### Definition of Done
- [x] 5/5 advisor probes run and recorded
- [x] 5/5 real `cli-opencode` dispatches completed and captured
- [x] 5/5 verdicts graded against scenario-specific Pass/Fail Criteria, each citing the exact criterion line
- [x] Dispatch log written with one row per dispatch
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Sequential single-agent dispatch loop: probe -> dispatch -> capture -> grade, repeated 5 times. No parallelism within this wave (cli-opencode's own rule is one dispatch at a time per agent); the phase-parent's overall 10-wave structure is where the real parallelism lives (across sibling wave-agents, not within this one).

### Key Components

- **Advisor probe as independent ground truth**: `skill_advisor.py` was run as a standalone, non-orchestrator check before every real dispatch, so the wave has an external confirmation of skill-level routing confidence that doesn't depend on what the live orchestrator happens to do internally.
- **JSON-lines transcript parsing**: each dispatch's full stdout was parsed for `tool_use` parts (tool name + input, e.g. `skill` calls, `read` calls with file paths) and `text` parts, to reconstruct the model's resolved mode, packet loads, resource citations, and final response without relying on the model's own self-report alone.
- **Resource-citation verification**: for scenarios where the model called the `skill` tool (which returns the full `SKILL.md` content inline as `<skill_content>`), resource-path coverage was verified by substring search against that returned blob rather than assumed from the model's prose alone — catching cases (`MR-002`, `MR-004`) where required resources were cited within the packet's own `RESOURCE_MAP` even though no separate `read` tool call touched them individually.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `/tmp/skd-MR001-response.jsonl` .. `/tmp/skd-MR006-response.jsonl` | Real dispatch transcripts | Created (read-only evidence) | Direct JSON parse per file |
| This wave's spec-folder docs | New Level-2 folder | Created | `validate.sh --strict` |

Required inventories:
- Same-class producers: no other in-flight work touches `manual_testing_playbook/01--mode-routing/` or this wave's spec folder concurrently.
- Consumers: the parent phase's `verdict-matrix.md` (to be built by the phase-parent agent after all 10 children complete) is the sole downstream consumer of this wave's 5 verdicts.
- Matrix axes: dispatch x {advisor top-1 + confidence, resolved mode, packet loaded, resources cited, tool surface, scenario's own PASS/FAIL/triage text} — the grading grid applied per dispatch.
- Algorithm invariant: every verdict traces to a directly-quoted criterion line from that scenario's own `### Pass/Fail Criteria` section, never a cross-scenario or generic bar.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Scenario Ground Truth
- [x] Read `interface-mode.md`, `foundations-mode.md`, `motion-mode.md`, `audit-mode.md`, `mode-hint-motion.md` in full
- [x] Read sibling phase `022`'s `spec.md`/`plan.md`/`tasks.md`/`checklist.md`/`implementation-summary.md` as the exact structural template

### Phase 2: Sequential Dispatch (5x)
- [x] MR-001: advisor probe (sk-design 0.95) -> real dispatch -> capture -> grade `PASS`
- [x] MR-002: advisor probe (sk-design 0.9441) -> real dispatch -> capture -> grade `PASS`
- [x] MR-003: advisor probe (sk-design 0.9404) -> real dispatch -> capture -> grade `PASS`
- [x] MR-004: advisor probe (sk-code 0.872 top-1, sk-design 0.8486 second) -> real dispatch -> capture -> grade `PARTIAL`
- [x] MR-006: advisor probe (sk-design 0.82) -> real dispatch -> capture -> grade `PASS`

### Phase 3: Documentation
- [x] Write `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `dispatch-log.md`
- [x] Generate `description.json` and `graph-metadata.json`
- [x] `validate.sh --strict`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Advisor probe | Skill-level routing confidence, independent of live orchestrator | `skill_advisor.py --threshold 0.8` |
| Real dispatch | End-to-end mode resolution, packet load, resource citation, tool surface | `opencode run --model openai/gpt-5.5-fast --variant medium --format json` |
| Transcript verification | Confirm claimed behavior against raw tool-call evidence, not model self-report | Direct JSON-lines parse of `tool_use` and `text` parts |
| Grading | Verdict traceability | Direct quote of the scenario file's own Pass/Fail Criteria line |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Validated Gate-3-bypass dispatch recipe | Prerequisite | Confirmed working (smoke-tested 5x pre-phase) | Dispatches would hang on the repo's own spec-folder gate question instead of doing real design work |
| `skill_advisor.py` | Verification tool | Available, both native and local-fallback scorer paths exercised across the 5 dispatches | Would need to rely on live-orchestrator self-report alone for routing confidence |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A verdict is later found to be mis-graded against the wrong criterion line.
- **Procedure**: Re-read the scenario file's Pass/Fail Criteria, re-derive the verdict from the already-captured `/tmp/skd-<id>-response.jsonl` transcript (no need to re-dispatch), and correct `dispatch-log.md` + `implementation-summary.md`.
<!-- /ANCHOR:rollback -->
