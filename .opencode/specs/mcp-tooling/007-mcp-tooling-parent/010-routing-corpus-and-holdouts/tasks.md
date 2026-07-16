---
title: "Tasks: Phase 10: routing-corpus-and-holdouts"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "routing corpus holdouts tasks"
  - "blind holdout tasks"
  - "scorer baseline tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/007-mcp-tooling-parent/010-routing-corpus-and-holdouts"
    last_updated_at: "2026-07-16T14:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All 11 tasks complete with evidence; no blocked tasks"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/manual_testing_playbook/hub_routing/holdout_agentic_browser.md"
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/labeled-prompts.jsonl"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "agent-010-routing-corpus-and-holdouts"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 10: routing-corpus-and-holdouts

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the existing holdout contract (MT-H01/MT-H02) and corpus row schema [evidence: new holdouts reproduce the `stage: holdout` + `blindToRouterKeywords: true` frontmatter keys; new rows reproduce the `skill_routing_prompts` JSON keys]
- [x] T002 Diagnose the pre-existing ratchet failure [evidence: July 10 hub-merge relabel of corpus rows landed without a baseline re-capture, so the fixture hash no longer matched `labeled-prompts.jsonl`; distinct from this phase's additions]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P] Author MT-H03 (.opencode/skills/mcp-tooling/manual_testing_playbook/hub_routing/holdout_task_tracking.md) [evidence: `id: MT-H03`, `expected_intent: mcp-click-up`, alias-free tracker prompt]
- [x] T004 [P] Author MT-H04 (.opencode/skills/mcp-tooling/manual_testing_playbook/hub_routing/holdout_agentic_browser.md) [evidence: `id: MT-H04`, `expected_intent: mcp-aside-devtools`, autonomous sign-in-and-do prompt; names chrome as the mode that must NOT win]
- [x] T005 [P] Author MT-H05 (.opencode/skills/mcp-tooling/manual_testing_playbook/hub_routing/holdout_web_design_reference.md) [evidence: `id: MT-H05`, `expected_intent: mcp-refero`, web-products-and-styles anchor; refero-vs-mobbin defer documented as tolerable secondary outcome]
- [x] T006 [P] Author MT-H06 (.opencode/skills/mcp-tooling/manual_testing_playbook/hub_routing/holdout_mobile_pattern_research.md) [evidence: `id: MT-H06`, `expected_intent: mcp-mobbin`, phone-apps first-run anchor]
- [x] T007 Add "Boundary (six-mode hub)" section to MT-H01 and bump version (.opencode/skills/mcp-tooling/manual_testing_playbook/hub_routing/holdout_browser_inspect.md) [evidence: `holdout_browser_inspect.md:10` `version: 1.1.0.0`; boundary section at line 17 names aside-or-defer here a regression]
- [x] T008 Append 7 labeled rows to the advisor corpus (.opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/labeled-prompts.jsonl) [evidence: ids `rr-hub6-201`..`rr-hub6-207` at lines 194-200, bucket `skill_routing_prompts`, `skill_top_1: "mcp-tooling"`; covers clickup/figma/aside x2/refero/mobbin x2 phrasings; `wc -l` = 200]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Re-capture the scorer baseline (`node scripts/routing-accuracy/capture-scorer-eval-baseline.mjs --write` from `mcp_server/`) [evidence: `scorer-eval-baseline.json` `capturedAt: 2026-07-16`, `capturedAtSha: 2146dee114`; metrics: full_corpus_top1 153/200 (0.765), holdout_top1 57/78 (0.7308), delegation bucket 10/11 (0.9091)]
- [x] T010 Run the ratchet gate (`npx vitest run tests/parity/scorer-eval-baseline-ratchet.vitest.ts`) [evidence: `Test Files 1 passed (1)`, `Tests 7 passed (7)`]
- [x] T011 Corpus integrity + spec child gates [evidence: JSON parse `lines: 200 invalid: 0`; generate-description.js + backfill-graph-metadata.js run; `validate.sh --strict --no-recursive` PASSED]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` [evidence: T001-T011 above, 11-of-11]
- [x] No `[B]` blocked tasks remaining [evidence: zero `[B]` markers in this file]
- [x] Manual verification passed [evidence: checklist.md all P0/P1 items verified]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
