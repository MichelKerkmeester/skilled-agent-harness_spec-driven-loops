---
title: "Implementation Plan: Phase 002 - Transport and Negative-Control Dispatches"
description: "Plan for running the advisor-probe-then-real-dispatch recipe across MR-007, AI-002, AI-003, AI-004, SR-001 and grading each strictly against its own scenario file."
trigger_phrases:
  - "phase 002 plan"
  - "transport negative control dispatch plan"
importance_tier: "high"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/002-transport-and-negative-controls"
    last_updated_at: "2026-07-07T15:20:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored plan.md"
    next_safe_action: "Author tasks.md and checklist.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "playbook-wave-002-transport-negative"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Phase 002 - Transport and Negative-Control Dispatches

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | `skill_advisor.py` deterministic probe; `opencode run --model openai/gpt-5.5-fast --variant medium --format json` real dispatch; JSON-lines transcript parsing via inline `python3` |
| **Framework** | `manual_testing_playbook` `{PREFIX}-NNN` scenario contract; phase-023 parent's validated dispatch recipe |
| **Storage** | `.opencode/specs/sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/002-transport-and-negative-controls/`; ephemeral `/tmp/skd-*` artifacts |
| **Testing** | Manual transcript inspection against each scenario file's own Pass/Fail Criteria |

### Overview

Five scenarios in two families: one transport-mode routing proof (`MR-007`) and four advisor-integration boundary proofs (`AI-002` pure code, `AI-003` documentation write, `AI-004` code-correctness review, `SR-001` shared-reference-base loading). Ran the advisor probe first for every scenario (all 5, since they are cheap and independent), then ran the real `cli-opencode` dispatch for each sequentially, one at a time, parsing the JSON-lines transcript's `tool_use` and `text` parts to reconstruct the model's actual skill-routing decision, packet loads, and any mutating tool calls. Two dispatches (`MR-007`, `AI-002`) produced real, unrequested side effects that required detection and a remediation decision before this wave could be documented as clean.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Read all 5 scenario files in full (not paraphrased) to establish exact prompts and Pass/Fail Criteria before any dispatch
- [x] Read a sibling phase's (`022`) Level 2 doc set as the exact structural template

### Definition of Done
- [x] 5/5 advisor probes run and saved
- [x] 5/5 real dispatches run sequentially and transcripts captured
- [x] 5/5 verdicts graded strictly against each scenario's own Pass/Fail Criteria, citing the specific line
- [x] Unintended in-repo mutation (`AI-002`) detected and reverted; confirmed clean via `git status --short`
- [x] Unintended out-of-repo mutation (`MR-007`) detected and documented with exact diff and rollback path
- [x] `dispatch-log.md` written with one row per dispatch
- [x] `description.json` + `graph-metadata.json` generated, `validate.sh --strict` passes
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Two-step-per-scenario dispatch: (1) deterministic `skill_advisor.py` probe against the clean exact prompt, recording top-1 skill + confidence; (2) real `opencode run` dispatch with the phase-023 parent's standalone-evaluation addendum appended, capturing the full JSON-lines transcript. Grading reads the transcript's `tool_use` parts (tool name + input, in call order) and `text` parts (the model's own stated routing rationale) against the scenario file's own Pass/Fail Criteria section verbatim, never a generic bar.

### Key Components

- **Advisor probe vs. in-dispatch advisor call divergence**: for `MR-007`, the standalone `skill_advisor.py` probe and the orchestrator's own internal `mk_skill_advisor_advisor_recommend` tool call (run mid-dispatch, with the addendum text folded into the prompt) both independently ranked `sk-code` above `sk-design` — confirming this is a real scoring pattern, not a one-off nondeterministic fluke of the standalone script.
- **NO_TARGET_CLAUSE decision per prompt**: included only for `SR-001` ("this landing page" — a hypothetical local UI target that does not exist in this repo); omitted for the other 4, whose targets are either non-UI (`AI-002` TypeScript function, `AI-004` backend API handler), pure prose (`AI-003` README section), or infrastructure wiring with a real, discoverable local target (`MR-007` Open Design's actually-installed CLI/daemon).
- **Side-effect detection discipline**: ran `git status --short` (scoped where useful) after every dispatch that used a mutating-capable tool, not just the two dispatches the phase-023 parent's own `REQ-004` names — this caught `AI-002`'s unrequested code mutation, which was not one of the parent's two flagged "live-extraction" dispatches.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts` + its vitest | Unrelated production code, out of this wave's scope | `AI-002`'s dispatch mutated it; reverted via `git restore` | `git status --short` on the two paths returned empty after revert |
| `~/.config/opencode/opencode.json` (outside repo) | User's real global OpenCode MCP config | `MR-007`'s dispatch added an `open-design` MCP server entry via `apply_patch` | Diff captured in `dispatch-log.md`; left in place, flagged as an open question for operator review (no git safety net outside the repo, and the change may be genuinely wanted) |

Required inventories:
- Same-class producers: no other in-flight work in this session touches `deep-loop-runtime/lib/deep-loop/executor-config.ts` or the global OpenCode config; confirmed via targeted `git status --short` immediately before and after the revert.
- Consumers of changed symbols: N/A — this wave makes no lasting code changes; the one real code mutation was reverted in full.
- Matrix axes: scenario x {advisor-probe top-1, in-dispatch routing decision, packet/resource loads, mutating tool calls, verdict} — the grading grid every dispatch was scored against.
- Algorithm invariant: every verdict traces to one specific, quoted Pass/Fail Criteria line from the scenario's own file — none is a generic "looked fine" judgment.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Advisor Probes (all 5, deterministic)
- [x] `MR-007` probe: `sk-code` top-1 0.95 (tied with `mcp-figma`/`cli-opencode`/`mcp-chrome-devtools`); `sk-design` 6th at 0.90
- [x] `AI-002` probe: `sk-code` top-1 0.9126; `sk-design` absent
- [x] `AI-003` probe: `sk-doc` top-1 0.9185; `sk-design` 2nd at 0.9062
- [x] `AI-004` probe: `sk-code` top-1 0.8985; `sk-design` 2nd at 0.82
- [x] `SR-001` probe: `sk-design` top-1 0.82 (only result above threshold)

### Phase 2: Real Dispatches (sequential, one at a time)
- [x] `MR-007` dispatched (backgrounded automatically by the harness at ~120s in-flight; awaited via `Monitor` until the transcript file was populated)
- [x] `AI-002` dispatched; detected + reverted an unintended in-repo code mutation
- [x] `AI-003` dispatched; no mutation
- [x] `AI-004` dispatched; no mutation, correctly reported the absent checkout-API target without fabricating findings
- [x] `SR-001` dispatched; no mutation, correct mode/register substance but an incomplete mandatory shared-resource load

### Phase 3: Grading + Documentation
- [x] Each transcript parsed for `tool_use` (tool + input) and `text` parts in call order
- [x] Each verdict traces to a quoted Pass/Fail Criteria line
- [x] `dispatch-log.md` written (one row per dispatch)
- [x] This wave's own Level 2 doc set authored
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Advisor probe | Deterministic top-1/confidence per prompt | `skill_advisor.py --threshold 0.8` |
| Real dispatch | Full sk-design skill + hub router, real dispatch | `opencode run --model openai/gpt-5.5-fast --variant medium --format json` |
| Transcript grading | `tool_use`/`text` parts vs. scenario's own Pass/Fail Criteria | Inline `python3` JSON-lines parsing |
| Side-effect safety check | Confirm no unintended repo drift survives this wave | `git status --short` scoped to touched paths, before and after any revert |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase-023 parent's validated dispatch recipe (smoke-tested 5x) | Prerequisite | Complete | This wave would need to re-derive the Gate-3-bypass addendum from scratch |
| `opencode` CLI + `openai/gpt-5.5-fast` model access | Runtime | Available | Dispatches would not be executable; only advisor probes could run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A future re-run of this wave finds different results and this wave's docs need superseding.
- **Procedure**: `git restore` this folder's docs; the two remediated side effects (`executor-config.ts`/test already reverted; `~/.config/opencode/opencode.json` documented but not reverted) are independent of this folder's own content and unaffected by restoring it.
<!-- /ANCHOR:rollback -->
