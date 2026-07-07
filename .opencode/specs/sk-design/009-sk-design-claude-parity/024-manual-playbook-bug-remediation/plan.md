---
title: "Implementation Plan: Phase 024 - Manual Playbook Bug Remediation"
description: "Plan for fixing the 8 real bugs phase 023 surfaced, verified via live re-dispatch across 3 remediation rounds."
trigger_phrases:
  - "phase 024 plan"
  - "manual playbook remediation workflow plan"
importance_tier: "high"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/024-manual-playbook-bug-remediation"
    last_updated_at: "2026-07-07T19:20:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored plan.md"
    next_safe_action: "Author tasks.md and checklist.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "manual-playbook-remediation-024"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Phase 024 - Manual Playbook Bug Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown SKILL.md prose rules, Python advisor-scorer weight tables, JSON graph-metadata/description sync |
| **Framework** | Same `cli-opencode` real-dispatch + strict-criteria-grading discipline established in phase 023 |
| **Storage** | `.opencode/skills/sk-design/`, `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` |
| **Testing** | Live re-dispatch of the exact scenario per bug, graded against that scenario's own Pass/Fail Criteria |

### Overview

Fixed each of phase 023's 8 catalogued bugs at what live re-verification proved was the actual root cause, iterating per-bug where the first fix proved insufficient. Round 1 addressed all 8 bugs' most direct symptom (advisor keyword weights for Open Design misroute; SKILL.md routing-precedence prose for the interface/foundations conflicts; resource-loading and intake-ordering rules). Re-verifying all 12 constituent dispatches against Round 1's fixes found 8 clean and 4 still broken (`TV-002-V4`, `SR-001`, `HM-001`, `MG-004`). Round 2 targeted those 4 with sharper, more specific rules. Re-verification found 3 of 4 fully resolved and 1 (`MG-004`) still failing — and Round 2's own fix had targeted the wrong invariant (it tried to make brief-value labeling more thorough, when the scenario's actual contract requires zero Tokens-table output at all on a brief-only request). Round 3 re-read the scenario's own Pass/Fail Criteria and the boundary doc the model actually consults, then rewrote both to forbid the artifact itself rather than just unlabeled values inside it. Final re-verification confirmed 12/12 PASS.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Read `023-full-manual-playbook-execution/verdict-matrix.md`'s full "Real bugs found" section as the authoritative bug list
- [x] Re-confirmed each bug's root cause against the actual source files (not the verdict-matrix summary alone) before writing a fix

### Definition of Done
- [x] Round 1 fixes applied across 5 files for all 8 bugs
- [x] Round 1 re-verification: 8/12 constituent dispatches confirmed PASS
- [x] Round 2 fixes applied for the 4 still-failing dispatches
- [x] Round 2 re-verification: 3/4 confirmed PASS (`TV-002-V4`, `SR-001`, `HM-001`); `MG-004` still FAIL
- [x] Round 3 fix applied for `MG-004`, correcting the invariant Round 2 targeted incorrectly
- [x] Round 3 re-verification: `MG-004` confirmed PASS
- [x] `opencode.json` checked for the known `open-design` mutation after every dispatch round — clean throughout this phase
- [x] `verdict-matrix.md` updated with the post-remediation state
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Fix -> live re-dispatch -> strict grep-based grading against the scenario's own criteria -> repeat only for what still fails. No fix was accepted on the strength of its prose alone; every one of the 8 bugs required at least one real `cli-opencode` dispatch confirming the actual model behavior changed, reusing phase 023's validated dispatch recipe (advisor probe -> real dispatch with the standalone-evaluation addendum -> `</dev/null` redirect -> raw `tool_use` grep, not narration).

### Key Components

- **Two separate advisor-scoring layers, fixed independently**: `skill_advisor.py`'s Python `PHRASE_INTENT_BOOSTERS` dict (read by the standalone CLI probe) and the live orchestrator's TS-based scorer (reads `graph-metadata.json`/`description.json`). The Open Design misroute (`MR-007`/`AI-001`-P6) and the weak-signal transform-verb miss (`TV-002`-V4) both needed the Python layer's keyword-weight table extended — prose-only SKILL.md fixes do not touch this scorer at all.
- **Root-cause correction on `MG-004`**: Round 2's fix assumed the scenario wanted Origin-labeled brief values inside the Tokens tables (propagated to all 4 tables, not just Colors). Re-reading `MG-004`'s actual Pass/Fail Criteria and `authoring_boundary.md` Section 5 in Round 3 showed the real contract is stricter: zero Tokens-table output at all on a brief-only, no-live-URL request. The fix was rewritten from "make labeling consistent" to "forbid the artifact entirely, require both boundary docs cited by path in the response text" — a structurally different fix, not a stronger version of the same one.
- **Citation-vs-tool-call gap** (`SR-001`, and partially `MG-004`): a SKILL.md rule that says "load resource X" doesn't compel the model to also *name* X in its visible response. `SR-001`'s Round 2 fix added an explicit citation-required clause; the scenario's actual grading bar (a genuine tool-call load, confirmed via raw JSONL grep) was independently met even though the specific citation phrasing still doesn't reliably fire — accepted as a known, non-blocking imperfection since the literal FAIL clause never trips.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `system-skill-advisor/mcp_server/scripts/skill_advisor.py` | Standalone advisor CLI scorer | `PHRASE_INTENT_BOOSTERS` additions (Round 1 + Round 2) | Standalone probe re-run per affected scenario |
| `sk-design/SKILL.md` | Parent hub routing rules | Mode-vocabulary-guardrail exception, intake-ordering + anti-hedge-bundling rules (Round 1 + Round 2) | `HM-001` live re-dispatch |
| `design-interface/SKILL.md` | Interface mode contract | Transform-verb-precedence exception, `context_loading_contract.md` citation clause (Round 1 + Round 2) | `TV-001`-V3, `TV-003`, `SR-001` live re-dispatch |
| `design-md-generator/SKILL.md` | md-generator mode contract | Router-precedence narrowing (Round 1); ALWAYS #10 / NEVER #6 rewritten for a zero-artifact boundary stop (Round 3) | `MG-004` live re-dispatch, 3 rounds |
| `design-md-generator/references/authoring_boundary.md` | Boundary doc the model actually reads | Section 5 + Quick Boundary Check rewritten (Round 3) | `MG-004` Round 3 confirmed the model now cites both docs by path and produces zero tables |
| `sk-design/graph-metadata.json`, `sk-design/description.json` | Advisor identity metadata (TS-scorer layer) | `intent_signals`/`trigger_phrases`/`keywords` additions | `MR-007`/`AI-001`-P6 live re-dispatch |

Required inventories:
- Same-class producers: no other in-flight work touches `sk-design/` or `system-skill-advisor/` concurrently for these specific files (confirmed via scoped `git status` before each round).
- Consumers of changed symbols: `skill_advisor.py`'s standalone CLI and the live orchestrator's `mk_skill_advisor_advisor_recommend` tool call are the only two consumers of the routing-weight changes; both were independently re-dispatched per fix.
- Matrix axes: bug x {root-cause layer (advisor-weight vs. prose-rule vs. structural-contract), fix round, constituent dispatch(es)} — tracked per-bug in `implementation-summary.md`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Round 1 Fixes (all 8 bugs, first attempt)
- [x] `skill_advisor.py` `PHRASE_INTENT_BOOSTERS`: 6 Open Design phrase entries
- [x] `sk-design/SKILL.md`: mode-vocabulary-guardrail exception + intake-ordering paragraph
- [x] `design-interface/SKILL.md`: transform-verb exception + ALWAYS rule renumber/insert
- [x] `design-md-generator/SKILL.md`: router-precedence narrowing
- [x] `sk-design/graph-metadata.json` + `description.json`: sync additions

### Phase 2: Round 1 Re-Verification
- [x] 8/12 constituent dispatches confirmed PASS: `MR-007`, `AI-001-P6`, `TV-001-V1`, `TV-001-V3`, `TV-003`, `TV-004`, `MG-002`, `MG-003`
- [x] 4/12 still failing: `TV-002-V4` (weak/no signal), `SR-001` (resource not loaded), `HM-001` (hedge-bundling), `MG-004` (PARTIAL, unlabeled values)

### Phase 3: Round 2 Fixes (4 remaining bugs)
- [x] `skill_advisor.py` `PHRASE_INTENT_BOOSTERS`: 6 more weak-signal transform-verb phrase entries
- [x] `design-interface/SKILL.md`: citation-required clause on `context_loading_contract.md`
- [x] `sk-design/SKILL.md`: anti-hedge-bundling paragraph + ordering-enforcement strengthening
- [x] `design-md-generator/SKILL.md`: ALWAYS #10 (URL-or-out-of-scope) + NEVER #6 (no unlabeled brief values), first version

### Phase 4: Round 2 Re-Verification
- [x] 3/4 confirmed PASS: `TV-002-V4`, `SR-001` (on-criteria; citation mechanism imperfect, accepted), `HM-001`
- [x] `MG-004` still FAIL — worse table coverage than Round 1, no URL-ask/refusal, no visible citation of either boundary doc

### Phase 5: Round 3 Fix (`MG-004` only, corrected root cause)
- [x] Re-read `MG-004`'s own Pass/Fail Criteria and `authoring_boundary.md` in full
- [x] `design-md-generator/SKILL.md`: ALWAYS #10 and NEVER #6 rewritten — forbid any Tokens-table output on a brief-only request, require both boundary docs cited by path in the response text
- [x] `design-md-generator/references/authoring_boundary.md`: Section 5 closing paragraph + Quick Boundary Check item 5 rewritten to match

### Phase 6: Round 3 Re-Verification and Close-Out
- [x] `MG-004` confirmed PASS: zero Tokens-table content, both docs cited by path, explicit out-of-scope + URL-ask
- [x] `opencode.json` confirmed clean after every round (no `mcp` key)
- [x] `verdict-matrix.md` updated with final per-bug verdicts
- [x] This phase's own spec/plan/tasks/checklist/implementation-summary authored
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Standalone advisor probe | Routing-weight fixes (Open Design, weak-signal transform-verb) | `skill_advisor.py <prompt> --threshold 0.8` |
| Live re-dispatch | All 12 constituent dispatches, 1-3 rounds each | `opencode run --model openai/gpt-5.5-fast --variant medium`, raw JSONL `tool_use` grep |
| Side-effect check | Every dispatch round | `~/.config/opencode/opencode.json` key inspection, `git status --porcelain` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 023's dispatch recipe + grading discipline | Prerequisite | Complete, committed `9207bd3454` | This phase's entire verification method depends on it |
| `openai/gpt-5.5-fast` model availability via `cli-opencode` | External | Available throughout | A dispatch failure would need to be distinguished from a genuine behavior regression |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A future re-run shows one of the 12 confirmed-PASS dispatches has regressed (e.g. an unrelated later edit to a shared file changes routing weights again).
- **Procedure**: `git blame`/`git log` the specific rule block added in this phase, `git revert` or re-tune the specific `PHRASE_INTENT_BOOSTERS` entry or SKILL.md paragraph; re-dispatch the affected scenario to confirm.
<!-- /ANCHOR:rollback -->
