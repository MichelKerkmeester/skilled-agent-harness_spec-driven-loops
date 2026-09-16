---
title: "Goal: rewrite the mechanical .opencode references to .skilled"
description: "The durable directive for the phase that rewrites mechanical path references in manifest-bound batches and closes on a rescan, leaving frozen records and generated files alone."
trigger_phrases:
  - "reference rewrite phase goal"
  - "skilled rewrite completion criteria"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite"
    last_updated_at: "2026-09-16T22:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored the phase directive"
    next_safe_action: "Wait for phase 008 to validate, then run setup tasks T001 to T010"
    blockers: []
    key_files:
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "041-009-goal"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: rewrite the mechanical .opencode references to .skilled

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Every mechanical `.opencode` path reference in tracked files outside `specs/` names `.skilled`, frozen records stay byte-identical and every decision row has an owner.

### Decisions

Frozen. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The rewrite set is the reconciled map: the mechanical rows of map C (2,936 once two generator outputs leave) and the 27 authored runtime files of map B, changed by one token-bounded rule whose moved list, keep-list and `.opencode/specs` target come from phase 004. A line on the keep-list is never rewritten. |
| D2 | DeepSeek V4.1 Flash at max on cli-pi through the LLM Gateway writes the phase scripts and runs the batches (62 on the pre-move map), one brief each, bound to the batch's file list. The orchestrator verifies every diff, handles the 39 manual rows and runs the rescan. GPT-5.6 on cli-codex reviews the scripts, the contract-adjacent batches (19 on the pre-move map) and the rescan count. |
| D3 | Frozen records (968 rows under three globs) and generated files are never text-edited. A generator whose input changed is re-run by its own command. |
| D4 | Of the 98 manual rows, 35 belong to 005, 18 to 006 and 3 to 010, 3 are generator output and 39 stay here. |

### Operator copy

A change here that alters a parent decision or criterion is applied to the parent first.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] The final rescan of tracked files outside `specs/` reports 0 unclassified `.opencode` occurrences and an independent recount agrees
- [ ] All 968 freeze paths are byte-identical to the phase base commit
- [ ] Every batch commit has a green suite record and a diff equal to its manifest
- [ ] All 39 manual rows kept here carry a recorded disposition and every generator check passes on the final tree
- [ ] The phase validates PASSED with every acceptance criterion Met
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Planning documents | Done | `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md`, authored 2026-09-16 from map counts re-derived over `728c4f3efc` |
| Execution | Pending | Waits on phases 003 to 008 |

### Deviations and findings

| Item | Note |
|------|------|
| Map B's 27 authored runtime files joined the rewrite set | They are neither links nor generated output, so phase 008's scope does not cover them. The handoff rescan fails without them |
| Five map rows are generator output | `generate-trigger-index.mjs:65-67` writes three of the recorded fixtures. `test_readme_verdict_parity.py --write` rebuilds the README verdict baseline. `derive-command-bridges.cjs:15` writes `command-bridges.generated.json` |
| Four retrieval fixtures are frozen evidence | `runtime/cli/retrieval/README.md:76-78` says they were captured once and have no runtime reader. Freeze is proposed and decided at T036 |
| 004's draft keep-list names lines inside the rewrite set | ADR-003 row K6 names three R1 path forms (`.opencode/plugins/README.md:16`, `cli-opencode/README.md:47`, `cli-opencode/SKILL.md:214`) and K8 names `.gitignore:7-10`. Keep-list lines now take precedence over every rule class |
| Producers and their tests must share a batch | A subarea-only partition split 195 of 342 import edges across batches, 183 of them from test files, so code batches follow import clusters |
| `specs/**` and the residue criterion | Settled 2026-09-16 by the orchestrator: spec folders are historical record under parent D4, frozen like changelogs and reports, so the final rescan excludes them. Generated spec metadata belongs to phase 008 |
<!-- /ANCHOR:log -->
