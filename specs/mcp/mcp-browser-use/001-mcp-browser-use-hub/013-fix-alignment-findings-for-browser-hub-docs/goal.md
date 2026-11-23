---
title: "Goal: Phase 13: fix-alignment-findings-for-browser-hub-docs"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "fix alignment findings for browser hub docs goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "mcp/mcp-browser-use/001-mcp-browser-use-hub/013-fix-alignment-findings-for-browser-hub-docs"
    last_updated_at: "2026-11-23T20:52:17Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "587eb5dd-b522-4898-9ee2-a03a0563e3ad"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 13: fix-alignment-findings-for-browser-hub-docs

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Fix every finding from phase 012's two browser-hub alignment runs, so each command, script and routing claim the hub makes works as written against bdg 0.6.10, Code Mode and the live advisor.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | bdg 0.6.10's installed source is the truth for every bdg command and output shape the docs quote. |
| D2 | Aside's `examples/repl-evidence-capture.sh` stays open until a live signed-in Aside run can verify it. Its docs are fixed. |
| D3 | No new feature-catalog leaf for the port defect. The chrome-devtools catalog keeps 31 features. |
| D4 | Defects outside the topic scope are recorded in `implementation-summary.md`, not fixed here. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] run-probes.cjs on the P03 probe file prints pass=9 fail=0, and advisor_recommend returns no recommendation for "Inspect the signed-in dashboard and explain the revenue drop."
- [x] rg for a bdg cdp call with positional JSON over the topic scope and the mcp-browser-use hub root prints no match
- [x] The fixed install.sh finds Chrome on macOS and logs CDP domains available: 53 for bdg 0.6.10
- [x] The doc-run recheck prints still_open=0, and the skilled-run recheck shows both failing battery rows passing
- [x] validate.sh --strict --recursive on the hub packet prints RESULT: PASSED for every folder
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Literal fixes | Done | `apply-fixes.cjs` printed `applied=45` |
| Judgment fixes | Done | Four opus-medium subagents, each edit checked against bdg's source |
| Routing lift | Done | `run-probes.cjs` printed `pass=9 fail=0`, was `pass=7 fail=2` |
| Scripts | Done | `install.sh` logs `CDP domains available: 53`, the old copy warned |
| Rechecks | Done | Doc run `resolved=39 still_open=0`, skilled run `resolved=4` with both battery rows passing |

### Deviations and findings

| Item | Note |
|------|------|
| D-2's proposed metadata fix was wrong | The miss came from the read-only explainer floor in `fusion.ts`, so the fix is a lift there |
| D-3 fixed at the shared predicate | The recheck reads it as open because its literal text is unchanged. The panel prints `ZOMBIE: none` |
| `/local-doc-alignment` has no `--recheck` | The skilled `recheck.cjs` checked the doc run's literal findings instead |
| Expected 245 fan-out tests | The new Devin model joined an existing test's list, so the count stays 244 |
<!-- /ANCHOR:log -->
