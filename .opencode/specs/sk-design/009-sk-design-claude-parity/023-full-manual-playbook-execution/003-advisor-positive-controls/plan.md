---
title: "Implementation Plan: Phase 003 - Advisor Positive Controls (Wave)"
description: "Plan for running the validated Gate-3-bypass dispatch recipe against AI-001-P1, P2, P3, P4, P6, sequentially, then grading each against AI-001's own Pass/Fail Criteria."
trigger_phrases:
  - "wave 003 plan"
  - "advisor positive controls dispatch plan"
importance_tier: "high"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/003-advisor-positive-controls"
    last_updated_at: "2026-07-07T18:45:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored plan.md"
    next_safe_action: "Author tasks.md and checklist.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "advisor-positive-controls-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Phase 003 - Advisor Positive Controls (Wave)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | `skill_advisor.py` deterministic local/native advisor scorer; `opencode run --model openai/gpt-5.5-fast --variant medium` real dispatch; JSON-lines transcript parsing |
| **Framework** | `manual_testing_playbook/advisor-integration/positive-design-controls.md` (`AI-001`) single-file 6-probe battery contract |
| **Storage** | `/tmp/skd-AI-001-P<n>-response.jsonl` transcripts; this wave's spec-folder docs |
| **Testing** | Manual grading against `AI-001`'s own "Pass/Fail Criteria" section |

### Overview

Ran the phase-parent's validated 4-step recipe once per assigned probe, strictly sequential (no backgrounding, per cli-opencode's one-dispatch-at-a-time rule): (1) advisor probe on the clean exact prompt, (2) real `opencode run` dispatch with the standalone-evaluation dispatch-note addendum appended, (3) capture full JSON-lines stdout, (4) grade against `AI-001`'s Pass/Fail Criteria. `P1`-`P4` each name a hypothetical local UI surface (onboarding page, analytics dashboard, modal, settings screen) and received the no-target clause. `P6` ("Wire Open Design's MCP server into opencode...") does not name a hypothetical local UI surface — it is an MCP-transport-wiring request — so it required the empty clause per the recipe's own decision rule. An initial `P6` dispatch mistakenly used the UI no-target clause; this was caught before grading and the probe was re-dispatched with the correct empty clause, whose transcript is the one graded.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Read `positive-design-controls.md` (`AI-001`) in full before any dispatch, including its own Probe-set table, expected-mode/packet/resource columns, and Pass/Fail Criteria
- [x] Confirmed the validated dispatch recipe verbatim from the orchestrating agent's instructions (smoke-tested 5x before phase 023 started)

### Definition of Done
- [x] 5/5 advisor probes run and recorded
- [x] 5/5 real `cli-opencode` dispatches completed and captured (6 raw transcripts produced; the erroneous `P6` first attempt was discarded before grading and the corrected re-run is what's captured at its final path)
- [x] 5/5 verdicts graded against `AI-001`'s own Pass/Fail Criteria, each citing the exact criterion line
- [x] Dispatch log written with one row per dispatch
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Sequential single-agent dispatch loop: probe -> dispatch -> capture -> grade, repeated 5 times. No parallelism within this wave (cli-opencode's own rule is one dispatch at a time per agent); the phase-parent's overall 10-wave structure is where the real parallelism lives (across sibling wave-agents, not within this one).

### Key Components

- **Advisor probe as independent ground truth**: `skill_advisor.py` was run as a standalone, non-orchestrator check before every real dispatch, so the wave has an external confirmation of skill-level routing confidence that doesn't depend on what the live orchestrator happens to do internally.
- **JSON-lines transcript parsing**: each dispatch's full stdout was parsed for `tool_use` parts (tool name + input, e.g. `skill` calls, `read`/`bash` calls) and `text` parts, to reconstruct the model's resolved mode, packet loads, resource citations, and final response without relying on the model's own self-report alone.
- **Internal-advisor-tool cross-check**: for probes where the live orchestrator itself called its own `mk_skill_advisor_advisor_recommend` tool (`P1`, `P3`, and attempted internally-ambiguous in `P6`'s corrected run it skipped this), the internal call's prompt text (which includes the dispatch-note addendum verbatim) sometimes surfaced `sk-doc` above `sk-design` — an artifact of the addendum's own "no repo documentation" wording leaking lexical signal toward `sk-doc`. This is a distinct phenomenon from the external clean-prompt probe (Recipe Step 1) that the scenario's Pass/Fail Criteria actually grades against, and is documented as an observation, not folded into the verdict.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `/tmp/skd-AI-001-P1-response.jsonl` .. `/tmp/skd-AI-001-P6-response.jsonl` | Real dispatch transcripts | Created (read-only evidence, except `P6`'s real Bash calls — see Risks) | Direct JSON parse per file |
| This wave's spec-folder docs | New Level-2 folder | Created | `validate.sh --strict` |
| `~/.config/opencode/opencode.json` (global, out-of-repo) | User's real OpenCode MCP config | Mutated by `P6`'s dispatch (not by this wave's own actions) | Read-only inspection after the fact; documented, not reverted |

Required inventories:
- Same-class producers: no other in-flight work touches `manual_testing_playbook/advisor-integration/` or this wave's spec folder concurrently.
- Consumers: the parent phase's `verdict-matrix.md` (to be built by the phase-parent agent after all 10 children complete) is the sole downstream consumer of this wave's 5 verdicts.
- Matrix axes: dispatch x {advisor top-1 + confidence, resolved mode, packet loaded, resources cited, tool surface, `AI-001`'s own PASS/FAIL/triage text} — the grading grid applied per dispatch.
- Algorithm invariant: every verdict traces to a directly-quoted criterion line from `AI-001`'s own `### Pass/Fail Criteria` section, never a generic bar.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Scenario Ground Truth
- [x] Read `positive-design-controls.md` (`AI-001`) in full, including all 6 probes' expected mode/packet/resources
- [x] Read sibling wave `001-mode-routing-core/`'s docs as the exact structural template

### Phase 2: Sequential Dispatch (5x)
- [x] AI-001-P1: advisor probe (`sk-design` 0.95) -> real dispatch -> capture -> grade `PASS`
- [x] AI-001-P2: advisor probe (`sk-design` 0.9231) -> real dispatch -> capture -> grade `PASS`
- [x] AI-001-P3: advisor probe (`sk-design` 0.8871) -> real dispatch -> capture -> grade `PASS`
- [x] AI-001-P4: advisor probe (`sk-design` 0.8367) -> real dispatch -> capture -> grade `PASS`
- [x] AI-001-P6: advisor probe (`sk-code` 0.9464 top-1, `sk-design` 0.8517 second) -> real dispatch (re-run after catching the wrong no-target-clause branch on the first attempt) -> capture -> grade `FAIL`

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
| Grading | Verdict traceability | Direct quote of `AI-001`'s own Pass/Fail Criteria line |
| Post-dispatch safety check | Confirm no unintended repo mutation | `git status --porcelain` scoped review after the wave |
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

- **Trigger**: A verdict is later found to be mis-graded against the wrong criterion line, or the `P6` global-config side effect needs undoing.
- **Procedure**: For grading — re-read `AI-001`'s Pass/Fail Criteria, re-derive the verdict from the already-captured `/tmp/skd-AI-001-P<n>-response.jsonl` transcript (no need to re-dispatch), and correct `dispatch-log.md` + `implementation-summary.md`. For the `P6` global config — the operator can remove or edit the `mcp.open-design` entry in `~/.config/opencode/opencode.json` directly; this wave intentionally did not attempt that revert itself (see Risks).
<!-- /ANCHOR:rollback -->
