---
title: "Goal: Phase 4: agents-commands-config"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "agents commands config goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "scaffold/004-agents-commands-config"
    last_updated_at: "2026-10-18T12:45:04Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-agents-commands-config"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 4: agents-commands-config

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give both OpenCode versions one set of agents, commands and config by adding the `browser` deny key, making delegation wording runtime-neutral, moving the twelve non-command files out of the command folder and guarding the shape of `opencode.json`.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| L1 | Each agent keeps its permissions. The `browser: deny` key is the only frontmatter change, and it sits beside `chrome_devtools: deny` on the ten agents that carry that key. |
| L2 | Each moved file moves with its sibling files, and every link between them stays relative. |
| L3 | Each mirror copy comes from the repo's own sync command, and no mirror copy is edited by hand. |
| L4 | `opencode.json` keeps its current shape until the orchestrator settles the D2 conflict, and the config shape test writes only to a temporary copy. |
| L5 | Each delegation wording change keeps prohibitions as prohibitions and named runtime examples as examples, so no runtime-only name becomes the universal name. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node .opencode/bin/check-agent-mirror-sync.cjs` exits 0 and prints `agent-mirror-sync: 11 agent(s) checked`, as recorded in `scratch/mirror-check-after.txt`. Evidence: `scratch/mirror-check-after.txt:2-3`, and all five checks exit 0 at `:1-15`.
- [x] `grep -l 'browser: deny' .skilled/agents/*.md` names ten agents, and `scratch/frontmatter-diff.txt` holds only `browser: deny` lines as frontmatter changes. Evidence: `scratch/browser-key-check.txt:12` (`count=10`) and `scratch/frontmatter-diff.txt:2-12`.
- [x] `find .skilled/commands -name '*.md' | grep -E '/(scripts|assets|fixtures)/|README'` prints no line, and `scratch/command-listing-after.txt` names no path from `scratch/move-names.txt`. Evidence: the v1 listing at `scratch/command-listing-after.txt:1` (39 commands, none moved), the twelve renames at `scratch/scope-check.txt:65-76`, and 0 moved-file paths at `scratch/stale-paths.txt:24`. The worktree's v2 listing still shows the twelve because v2 merges the ancestor main checkout above this nested worktree, and the isolated copy lists 41 with none moved (`scratch/v2-command-isolated.txt:2-3`, decision 13).
- [x] `scratch/contract-tests-after.txt` reports a pass count that matches `scratch/contract-tests-before.txt`, with no new failure. Evidence: 55 of 55 at `scratch/contract-tests-after.txt:5-6` and `scratch/contract-tests-before.txt:5-6`.
- [x] `opencode debug config` exits 0 on v1 1.19.3 with no error in `scratch/config-load-after.txt`, and `scratch/config-shape.txt` reports `# pass 2` and `# fail 0`. Evidence: `scratch/config-load-after.txt:2-3` (`exit=0`, 0 stderr lines) and `scratch/config-shape.txt:5-6` (`pass 2`, `fail 0`, from the symbol reporter).
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
| Planning documents filled | Done | `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `goal.md` and `implementation-summary.md` in this folder |
| Baselines | Done | `scratch/status-before.txt:1-2`, `scratch/command-listing-before.txt:1` (v1 51) and `:53` (v2 53), `scratch/contract-tests-before.txt:5-6` (55 of 55), `scratch/mirror-check-before.txt` (all five checks pass) |
| Browser keys | Done | `scratch/browser-key-check.txt:12` (ten files) and `scratch/frontmatter-diff.txt:2-12` (only `browser: deny`), with `orchestrate.md` unchanged at `:10` |
| Wording edits | Done | 23 lines in `ai-council.md`, `debug.md` and `orchestrate.md` per `scratch/decisions.txt:19-22`, and the three runtime names at `scratch/runtime-tool-names.txt:3-4`, `:11` and `:16` |
| Mirror sync | Done | `scratch/regenerate.txt:1-9` and `:22-31`, `scratch/claude-sync.txt:11-13`, and all five checks exit 0 at `scratch/mirror-check-after.txt:1-15` |
| The move and its consumers | Done | `scratch/move-map.txt:1-12`, `scratch/scope-check.txt:25-32` and `:65-76` |
| Recompiled contracts | Done | `scratch/regenerate.txt:10-21` (the three recompiles) and `:35-37` (drift OK), with 55 of 55 at `scratch/contract-tests-after.txt:5-6` |
| README manifests | Done | `scratch/skdoc-manifest-before.txt:3-6` (the phase 5 regression) and `scratch/skdoc-manifest-after.txt:4` (reproducible again) |
| Config decision and shape test | Done | `scratch/v2-config-view.txt:6-8` and `scratch/v2-mcp-probe.txt:1` (decision 2), with `scratch/config-shape.txt:5-6` (2 of 2) and `scratch/config-load-after.txt:2-3` |
| Verification captures | Done | `scratch/command-listing-after.txt:1`, `scratch/v2-command-isolated.txt:2-3`, `scratch/gate3-after.txt:18-21`, `scratch/stale-paths.txt:24-26`, `scratch/drift-after.txt:44` and `scratch/deep-loop-suite-after.txt:48-49` |
| Review and its two P2 fixes | Done | `scratch/review-004.txt:2`, `:12-13` and `:43`, with the fixes at `scratch/decisions.txt:29-31` |
| Closure docs | Done | The completion criteria above, `acceptance-criteria.md`, `tasks.md` and `implementation-summary.md` in this folder |

### Deviations and findings

| Item | Note |
|------|------|
| Phase 5 manifest regression (decision 0) | The README manifest was already failing at the phase start, and the phase 5 gates missed it. Its refresh joined this phase because the manifest is in the file list (`scratch/skdoc-manifest-before.txt:3-6`). |
| Hermes copies and the crosswalk join the file list (decisions 4 and 10) | The generated Hermes skill copies are a mirror tree like `.codex` and `.pi`, and the crosswalk joins for the one change that names `browser` beside `chrome_devtools` (`scratch/decisions.txt:14`, `:24`). |
| The manifest path stays (decision 7) | The render step's `manifest.jsonl` keeps its path because it is a generated file and not a command candidate, and `.gitignore` ignores it there (`scratch/decisions.txt:18`). |
| The `.claude` copies synced by patch (decision 11) | The crosswalk names no generator for `.claude`, so each source body diff was applied as a patch. This amends the no-hand-edit rule for mirror copies (`scratch/claude-sync.txt:11-13`). |
| Nested-worktree listing (decision 13) | The worktree's v2 listing still shows the twelve because v2 merges the ancestor main checkout's `.opencode` folder. An isolated copy lists 41 with none moved. Carried forward to phases 7 and 10 (`scratch/decisions.txt:27-28`). |
| v2 probe must boot first (decision 14) | A first request to /api/agent can return an empty list while the agent and provider services start. Carried forward to phase 8 (`scratch/decisions.txt:32`). |
| Two P2s fixed (decision 14) | The `ai-council.md` Tools cell shape and the re-derived v2 after capture, neither blocking closure (`scratch/review-004.txt:15-21`, `scratch/decisions.txt:29-31`). |
| The browser keys are defensive on 2.0.32 (decision 3) | Every agent already ends with a trailing `browser: deny` rule on that version, so the ten keys keep the denial and add the enforced name (`scratch/decisions.txt:8`). |
<!-- /ANCHOR:log -->
