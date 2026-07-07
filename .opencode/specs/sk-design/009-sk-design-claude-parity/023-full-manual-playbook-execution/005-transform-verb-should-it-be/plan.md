---
title: "Implementation Plan: Wave 005 - Transform Verb 'should it be' Framing"
description: "Plan for running the validated advisor-probe-then-live-dispatch recipe against 5 assigned dispatches and grading each against its scenario file's own Pass/Fail Criteria."
trigger_phrases:
  - "wave 005 plan"
  - "should it be dispatch plan"
importance_tier: "high"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/005-transform-verb-should-it-be"
    last_updated_at: "2026-07-07T17:12:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored plan.md"
    next_safe_action: "Author tasks.md and checklist.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "wave-005-should-it-be"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Wave 005 - Transform Verb "should it be" Framing

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | `skill_advisor.py` CLI probe; `opencode run` CLI live dispatch; manual-playbook markdown scenario contracts |
| **Framework** | Existing `manual_testing_playbook` `{PREFIX}-NNN(-VN)` scenario contract shape |
| **Storage** | `.opencode/skills/sk-design/manual_testing_playbook/03--transform-verb-framing/`; transcripts under `/tmp/skd-*` |
| **Testing** | Advisor probe (`--threshold 0.8`) + live `opencode run --format json` dispatch, one at a time, graded against each scenario's own criteria |

### Overview

Read the three constituent scenario files in full first (`should-it-be-audit.md`, `clarify-alias-only.md`, `foundations-excluded-aliases.md`) to get their exact prompts, expected mode resolutions, and Pass/Fail Criteria verbatim. Ran the 5 assigned dispatches sequentially (TV-002-V2, TV-002-V3, TV-002-V4, TV-003, TV-004), each as an advisor probe followed by a live orchestrator dispatch with the standard dispatch-note addendum. Parsed each JSON-lines transcript for `skill` tool calls (resolved mode/packet) and final `text` output (response nature), then graded PASS/FAIL by directly matching the transcript evidence against the scenario's own stated criteria line.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Read all 3 constituent scenario files in full (not paraphrased from memory)
- [x] Confirmed the advisor-probe script and `opencode run` CLI both work via a sanity dispatch (TV-002-V1 advisor probe) before running the 5 assigned dispatches

### Definition of Done
- [x] All 5 assigned dispatches ran through advisor probe + live dispatch
- [x] Every transcript saved under `/tmp/skd-<dispatch-id>-response.jsonl`
- [x] Every dispatch graded PASS/FAIL with a cited criterion line
- [x] `dispatch-log.md` written with all 5 rows plus a summary and cross-cutting finding
- [x] Level 2 spec-folder docs authored, mirroring `../022-benchmark-rerun-and-coverage-fill/`'s shape
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Sequential single-agent execution (no sub-dispatch fan-out within this wave): for each of the 5 assigned dispatches, run the advisor probe first (deterministic, fast, clean prompt only), then the live dispatch (the addendum-wrapped prompt through the real orchestrator), then parse and grade immediately before moving to the next dispatch. This kept each grading decision anchored to a freshly-read transcript rather than batching all 5 dispatches and grading from memory afterward.

### Key Components

- **Advisor probe**: `python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "<clean prompt>" --threshold 0.8`, run from repo root. Returned `[]` (empty JSON array) for TV-002-V2, TV-002-V3, and TV-002-V4 — i.e. the standalone CLI advisor lost (no candidate cleared the dual-threshold gate) on all three "should it be [quieter/distill/delight]" variants, despite the scenario's own "Expected advisor behavior: win... >= 0.80" assertion. TV-003 and TV-004 both won cleanly (`0.8835` and `0.82` respectively).
- **Live dispatch**: `timeout 300 opencode run --model openai/gpt-5.5-fast --variant medium --format json --dir <repo> "<prompt + addendum>" </dev/null`, output redirected to `/tmp/skd-<id>-response.jsonl`. Parsed with a small inline Python script filtering `type == "tool_use"` (tool name + input) and `type == "text"` (response body) to reconstruct the model's routing decision and answer without re-reading raw escaped JSON by eye.
- **NO_TARGET_CLAUSE decision**: applied only to TV-003 (`"this hero section"` is a named hypothetical local UI target with no repo file); left empty for TV-002-V2/V3/V4 (no named local target at all — abstract "should it be" questions) and TV-004 (`"it"` is a bare pronoun, not a named target like "this dashboard"). TV-004's live dispatch independently confirmed this was the right call: the model tried to resolve a real target via the Open Design transport before asking the user for one, which is itself informative (no target fabrication) and didn't block capturing the mode-resolution evidence needed for grading.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `005-transform-verb-should-it-be/` | New Level 2 spec-folder wave | Create all 5 docs + `dispatch-log.md` | `validate.sh --strict` |
| `/tmp/skd-TV002-V2-response.jsonl`, `/tmp/skd-TV002-V3-response.jsonl`, `/tmp/skd-TV002-V4-response.jsonl`, `/tmp/skd-TV003-response.jsonl`, `/tmp/skd-TV004-response.jsonl` | Raw dispatch transcripts (ground truth) | Create (ephemeral, `/tmp`) | Read + parsed inline during grading |

Required inventories:
- Same-class producers: sibling waves (`001`-`004`, `006`-`010`) run concurrently in the same parallel Workflow, each targeting a disjoint dispatch-id set and a disjoint wave folder — no file-path collision.
- Consumers of changed symbols: none — this wave only reads scenario files and writes its own spec-folder docs; it does not modify `mode-registry.json`, `hub-router.json`, or any `SKILL.md`.
- Matrix axes: dispatch x {advisor-probe result, live-dispatch resolved mode, live-dispatch loaded packet, response nature} — the grading grid every row in `dispatch-log.md` is scored against.
- Algorithm invariant: every verdict traces to one specific, quoted criterion line from the scenario file's own "Pass/Fail Criteria" section — none is a generic "looks about right" judgment.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Scenario Intake
- [x] Read `should-it-be-audit.md`, `clarify-alias-only.md`, `foundations-excluded-aliases.md` in full
- [x] Confirmed assigned dispatch set: TV-002-V2, TV-002-V3, TV-002-V4, TV-003, TV-004
- [x] Checked sibling wave folders in `023-full-manual-playbook-execution/` for prior content (all empty — no collision)

### Phase 2: Sequential Dispatch Execution
- [x] TV-002-V2: advisor probe (`[]`) -> live dispatch -> `audit` resolved, `design-audit` loaded -> **PASS**
- [x] TV-002-V3: advisor probe (`[]`) -> live dispatch -> `audit` resolved (explicit `SKILL ROUTING:` line), `design-audit` loaded -> **PASS**
- [x] TV-002-V4: advisor probe (`[]`) -> live dispatch -> no skill tool call at all, generic copywriting answer -> **FAIL**
- [x] TV-003: advisor probe (`0.8835` win) -> live dispatch -> `foundations` resolved (not `interface`), `design-foundations` loaded -> **FAIL**
- [x] TV-004: advisor probe (`0.82` win) -> live dispatch -> `interface + foundations` bundle resolved, `design-foundations` loaded -> **FAIL**

### Phase 3: Documentation
- [x] `dispatch-log.md` with all 5 rows, summary, and cross-cutting finding
- [x] Level 2 spec-folder docs (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`)
- [x] `generate-description.js` + `backfill-graph-metadata.js` + `validate.sh --strict`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Advisor probe | Deterministic top-1 skill + confidence per clean prompt | `skill_advisor.py --threshold 0.8` |
| Live dispatch | Real orchestrator routing + packet loads + response, one call per dispatch | `opencode run --format json` |
| Grading | Transcript evidence matched against scenario's own Pass/Fail Criteria wording | Manual criterion citation in `dispatch-log.md` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `skill_advisor.py` reachable from repo root | Prerequisite | Available, confirmed working (returned wins on TV-002-V1/TV-003/TV-004 sanity checks) | Would need to fall back to live-dispatch-only grading, losing the probe-vs-live comparison |
| `opencode run` CLI with `openai/gpt-5.5-fast` model access | Prerequisite | Available; all 5 dispatches completed within the 300s timeout | Dispatches would hang or fail; recipe explicitly requires `</dev/null` to avoid the stdin-hang failure mode |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A re-run of any dispatch produces a materially different transcript that contradicts this wave's recorded verdict (model non-determinism).
- **Procedure**: This wave's docs are additive evaluation records, not runtime changes — no rollback needed for the repo itself. A contradicting re-run would be documented as a new evidence row or a follow-up wave, not by silently editing this wave's already-graded verdicts.
<!-- /ANCHOR:rollback -->
