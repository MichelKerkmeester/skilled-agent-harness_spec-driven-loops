---
title: "Implementation Plan: Phase 004 - Transform Verb make it Wave"
description: "Plan for dispatching TV-001's 4 variants + TV-002-V1 via cli-opencode and grading each against its scenario file's Pass/Fail Criteria."
trigger_phrases:
  - "phase 004 plan"
  - "transform verb make it dispatch plan"
importance_tier: "high"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/004-transform-verb-make-it"
    last_updated_at: "2026-07-07T17:05:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored plan.md"
    next_safe_action: "Author tasks.md and checklist.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "wave-004-transform-verb-make-it"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Phase 004 - Transform Verb make it Wave

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | `cli-opencode` dispatch (`openai/gpt-5.5-fast --variant medium --format json`); `skill_advisor.py` deterministic probe; sk-design's `mode-registry.json`/`hub-router.json` routing contract |
| **Framework** | `manual_testing_playbook` `{PREFIX}-NNN` scenario contract (`transform-verb-framing/`) |
| **Storage** | `/tmp/skd-TV00*-response.jsonl` (raw transcripts), this folder (graded evidence) |
| **Testing** | Real dispatch + manual grading against each scenario's own Pass/Fail Criteria section (no automated harness for this phase) |

### Overview

Ran the phase parent's validated dispatch recipe verbatim, one dispatch at a time, in the exact order `TV-001-V1 -> V2 -> V3 -> V4 -> TV-002-V1`. Each dispatch: (1) a deterministic advisor probe on the clean scenario prompt, (2) the real orchestrator dispatch with the standalone-evaluation addendum appended (empty no-target-clause, since none of these 5 prompts name a hypothetical local UI target — they use bare "it"/"the current hierarchy"), (3) a `git status --porcelain` safety check immediately after, (4) parsing the JSON-lines trace for resolved mode, packet loads, and resource citations, (5) grading against the scenario file's own criteria. `TV-001-V1`'s dispatch made a real, unintended edit to this repo's own `README.md`; it was caught by the safety check and reverted via `git restore` before continuing.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Read both constituent scenario files in full (`make-it-interface.md`, `should-it-be-audit.md`) before dispatching
- [x] Confirmed the phase parent's dispatch recipe and no-target-clause decision rule before running any dispatch

### Definition of Done
- [x] All 5 advisor probes run and recorded
- [x] All 5 real dispatches run sequentially, one at a time
- [x] All 5 transcripts parsed for resolved mode, packet loads, resource citations, and any file-mutating tool calls
- [x] `TV-001-V1`'s unintended `README.md` edit reverted and confirmed clean via `git status --porcelain`
- [x] Each dispatch graded against its scenario's own Pass/Fail Criteria, citing the specific line
- [x] `dispatch-log.md` written with one row per dispatch
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Sequential single-agent dispatch loop (not a parallel Workflow — `cli-opencode`'s own rule is one dispatch at a time per agent). For each of the 5 prompts: probe -> dispatch -> safety-check -> parse -> grade, in strict prompt order matching the scenario files' own variant tables.

### Key Components

- **Advisor probe vs. real-dispatch advisor call divergence**: the standalone `skill_advisor.py` probe on the bare prompt and the real dispatch's own internal `mk_skill_advisor_advisor_recommend` call (which the model enriches with its own paraphrase before calling) frequently disagreed — e.g. `TV-001-V1`'s clean probe returned no match (`[]`, nothing crossed the 0.8 threshold) while the real dispatch's internal advisor call ranked `sk-design` third behind `sk-doc` and `sk-code` and marked the result `"ambiguous": true`. `TV-001-V4`'s clean probe also returned `[]`, yet its real dispatch routed correctly to `interface`. The probe is a directional signal, not a substitute for reading the real dispatch's own internal tool calls.
- **No-target-clause absence exposed a real defect**: all 5 prompts use bare `it`/`the current hierarchy` framing with no named local UI surface, so per the phase parent's own decision rule the addendum's no-target clause was correctly omitted. Absent a named target, `TV-001-V1`'s dispatch searched this live repo for a plausible "product surface," settled on `README.md`, and applied a real multi-hunk edit via `apply_patch` — a genuine, reproducible side-effect this wave caught and reverted, not a hypothetical risk.
- **`foundations` vs. `interface` primary-mode language**: grading `TV-001-V2`/`V4` (interface stated as primary, foundations as a supporting constraint — matches scenario) against `TV-001-V3` (foundations stated as primary, "a light interface pass" as secondary — explicitly the scenario's own FAIL trigger) required reading each dispatch's own routing prose closely, not just checking which `skill` tool names were called (V3 called both `design-foundations` and `design-interface`, same as V2/V4 called both `design-interface` and `design-foundations` — the order and stated primacy is what differs).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `/tmp/skd-TV001-V1..V4-response.jsonl`, `/tmp/skd-TV002-V1-response.jsonl` | Raw dispatch transcripts | Created | `wc -l` + parsed via inline Python for tool calls and text parts |
| This repo's `README.md` | Unintended real edit target (`TV-001-V1` only) | Edited then reverted | `git diff -- README.md` showed the edit; `git restore -- README.md` + `git status --porcelain -- README.md` confirmed clean |
| `dispatch-log.md` (this folder) | New evidence table | Created | Manual read-back against each transcript |

Required inventories:
- Same-class producers: confirmed via live `ps aux` during dispatch that multiple sibling wave agents (001-009, 010) were running concurrent `opencode run` dispatches against this same repo at the same time — none targeted this wave's 5 prompts or `README.md`.
- Consumers of changed symbols: none — this wave produces evidence documents only; no runtime code or registry file was modified.
- Matrix axes: scenario x variant x {advisor-probe result, real-dispatch resolved mode, packet load, resource citations, file-mutation check} — the full grading grid applied per dispatch.
- Algorithm invariant: every verdict traces to a specific, quoted Pass/Fail Criteria line from the constituent scenario file — none is a generic "looks right" judgment.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Advisor Probes
- [x] 5 deterministic `skill_advisor.py` probes run, one per assigned prompt

### Phase 2: Real Dispatches (sequential, one at a time)
- [x] `TV-001-V1` dispatched; unintended `README.md` edit detected and reverted
- [x] `TV-001-V2` dispatched; no side effects
- [x] `TV-001-V3` dispatched; no side effects
- [x] `TV-001-V4` dispatched; no side effects
- [x] `TV-002-V1` dispatched; no side effects

### Phase 3: Grading
- [x] Each transcript parsed for resolved mode, packet loads, resource citations, file-mutating tool calls
- [x] Each dispatch graded against its scenario's own Pass/Fail Criteria, citing the specific line
- [x] `dispatch-log.md` written

### Phase 4: Final Verification
- [x] `git status --porcelain` confirmed clean of this wave's own stray edits
- [x] `generate-description.js` + `backfill-graph-metadata.js` + `validate.sh --strict` run
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Advisor probe | Deterministic top-1 skill + confidence per clean prompt | `skill_advisor.py --threshold 0.8` |
| Real dispatch | Full end-to-end orchestrator behavior | `opencode run --model openai/gpt-5.5-fast --variant medium --format json` |
| Transcript parsing | Resolved mode, packet loads, resource citations, file mutations | Inline Python JSON-lines parse of `tool_use`/`text` parts |
| Post-dispatch repo-safety check | Unintended real-repo edits | `git status --porcelain`, `git diff`, `git restore` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase parent's validated Gate-3-bypass dispatch recipe | Prerequisite | Available, used verbatim | Would need re-deriving and re-smoke-testing |
| `skill_advisor.py` | Verification tool | Available | Would need to infer advisor behavior from dispatch transcript alone |
| Open Design daemon (`http://127.0.0.1:7456`) | Optional, not running during this wave | Unavailable | `TV-001-V2/V3/V4` correctly reported the daemon as unreachable and asked for a target rather than fabricating one — a pass-relevant safe-failure behavior, not a blocker for this wave's grading |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Already exercised once — `TV-001-V1`'s dispatch made a real, unintended edit to `README.md`.
- **Procedure**: `git diff -- README.md` to confirm the change is exactly what the dispatch's `apply_patch` tool call produced (not a concurrent sibling agent's legitimate work), then `git restore -- README.md`, then re-confirm with `git status --porcelain -- README.md`. Applied and verified during this wave.
<!-- /ANCHOR:rollback -->
