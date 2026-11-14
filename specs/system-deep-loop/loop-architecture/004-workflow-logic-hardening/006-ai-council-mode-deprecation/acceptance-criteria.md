---
title: "Acceptance Criteria: Phase 6: ai-council-mode-deprecation"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "ai council mode deprecation acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/004-workflow-logic-hardening/006-ai-council-mode-deprecation"
    last_updated_at: "2026-11-14T11:56:22Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-ai-council-mode-deprecation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 6: ai-council-mode-deprecation

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 004-workflow-logic-hardening/006-ai-council-mode-deprecation
**Level:** 2
**Status:** Draft
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the final tree, When the registry modes are printed, Then only research and review remain | `node -e 'console.log(require("./.skilled/skills/system-deep-loop/mode-registry.json").modes.map(m=>m.workflowMode).join(" "))'` prints `research review` | Unmet | - |
| AC-002 | REQ-002 | Given the hub router and root router, When they are searched for the council, Then the tieBreak is research and review and no stage-two key names the council | `rg -n -i 'council' .skilled/skills/system-deep-loop/hub-router.json` prints nothing and `rg -n 'AI_COUNCIL' .skilled/skills/system-deep-loop/ROUTER.md` prints nothing | Unmet | - |
| AC-003 | REQ-003 | Given the final tree, When the per-hub gate runs with the hub path, Then its subject line names the hub, it counts 2 modes and it passes | `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/system-deep-loop` prints `INFO: Parent skill: .skilled/skills/system-deep-loop`, `declares 2 modes` and `OK: parent-skill-check` | Unmet | - |
| AC-004 | REQ-004 | Given the prompt "convene an ai council to compare three migration plans", When both routing stages replay it, Then neither stage selects the council, research or review | `python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "<prompt>" --threshold 0.5 \| rg -c '"mode": "(ai-council\|research\|review)"'` prints 0 and `node .skilled/bin/compiled-route.cjs --hub system-deep-loop --prompt "<prompt>" \| rg -c '"packetId":"deep-'` prints 0 | Unmet | - |
| AC-005 | REQ-005 | Given one research and one review prompt, When both stages replay them, Then each routes to its own mode | Task T081 output logged in `goal.md`, with mode `research` and `packetId` `deep-research` for the first and mode `review` and `packetId` `deep-review` for the second | Unmet | - |
| AC-006 | REQ-006 | Given the final tree, When the divergent pivot tests run, Then they pass with the one kept council file | `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/integration/divergent-pivot.vitest.ts tests/council/multi-seat-dispatch.vitest.ts` exits 0 | Unmet | - |
| AC-007 | REQ-007 | Given the rewritten agent, When every agent mirror checker runs, Then the agent is present and equal in all eight folders | `node .skilled/bin/check-agent-mirror-sync.cjs --all`, `node .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs` and the Codex, Pi and DSH `sync-agents` scripts with `--check` exit 0 | Unmet | - |
| AC-008 | REQ-008 | Given the two authored agent files, When they are searched for deep-loop dependencies, Then none remain | `rg -n 'system-deep-loop\|deep-ai-council\|/deep:ai-council\|append-mode-event\|persist-artifacts\|node ' .skilled/agents/ai-council.md .claude/agents/ai-council.md` prints nothing | Unmet | - |
| AC-009 | REQ-009 | Given the `D3 decision:` line in `goal.md`, When the command tree, its mirrors and the advisor are checked, Then option B shows one council command with one workflow file and one presentation file in all six runtime folders and the advisor offers it, and option A shows no council command | `rg -n '^D3 decision: option [AB]$' goal.md` prints 1 line. Under option B, `ls .skilled/commands/speckit/assets/speckit-ai-council*.yaml \| wc -l` prints 1, the T017 `find -L` count prints 6 and `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"convene an ai council to compare three migration plans"}' --format json \| rg -c '"command": "/speckit:ai-council"'` prints at least 1 | Unmet | - |
| AC-010 | REQ-010 | Given the final tree, When the deep command set and its mirrors are listed, Then none exist and the mirror checkers pass | `git ls-files .skilled/commands/deep/ai-council.md` prints nothing, and `validate-command-tree-parity.sh` plus the Codex, Pi and DSH prompt generators with `--check` exit 0 | Unmet | - |
| AC-011 | REQ-011 | Given the final tree, When the packet and council libraries are listed, Then they are gone except the dispatch file the pivot reads | `git ls-files .skilled/skills/system-deep-loop/deep-ai-council` prints nothing and `ls .skilled/skills/system-deep-loop/runtime/lib/council` prints `README.md` and `multi-seat-dispatch.cjs` only | Unmet | - |
| AC-012 | REQ-012 | Given each removed runtime file, When its caller check runs, Then no live caller remains | The caller checks in tasks T039 to T045 each print nothing | Unmet | - |
| AC-013 | REQ-013 | Given the final tree, When convergence is asked for the council loop type and the runtime suite runs, Then the type is rejected and the suite passes | `node .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs --spec-folder <this folder> --session-id probe --loop-type council` prints an `INPUT_VALIDATION` error starting `loopType must be` that does not name `council`, and `cd .skilled/skills/system-deep-loop/runtime && npm test && npm run typecheck` exits 0 | Unmet | - |
| AC-014 | REQ-014 | Given the advisor with two deep modes, When its suite, typecheck and drift guard run, Then they pass or match the baseline and any recaptured corpus keeps its thresholds | `cd .skilled/skills/system-skill-advisor/runtime && npm test && npm run typecheck` exits 0 and `npx vitest run tests/routing-registry-drift-guard.vitest.ts` exits 0, with deltas in `goal.md` | Unmet | - |
| AC-015 | REQ-015 | Given the vocabulary sweep, When it runs outside `specs/`, Then it finds only allowlisted history files | Task T086 output matches `scratch/exceptions.md` | Unmet | - |
| AC-016 | REQ-016 | Given the start SHA, When the diff of spec-folder council artifacts is listed, Then nothing changed and the plan names the revert path | `git diff --name-only <start-sha> -- 'specs/**/ai-council/**'` prints nothing and `rg -n 'git revert' plan.md` prints at least 1 line | Unmet | - |
| AC-017 | REQ-017 | Given the parent folder, When the start condition is checked, Then phases 004 and 005 are Complete | `rg -l -F '\| **Status** \| Complete' ../004-*/spec.md ../005-*/spec.md \| wc -l` prints 2 | Unmet | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** No

Implementation has not started, so every criterion is still Unmet.
<!-- /ANCHOR:closure -->
