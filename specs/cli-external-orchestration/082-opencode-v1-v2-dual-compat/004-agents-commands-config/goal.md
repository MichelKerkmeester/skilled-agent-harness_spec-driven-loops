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

- [ ] `node .opencode/bin/check-agent-mirror-sync.cjs` exits 0 and prints `agent-mirror-sync: 11 agent(s) checked`, as recorded in `scratch/mirror-check-after.txt`.
- [ ] `grep -l 'browser: deny' .skilled/agents/*.md` names ten agents, and `scratch/frontmatter-diff.txt` holds only `browser: deny` lines as frontmatter changes.
- [ ] `find .skilled/commands -name '*.md' | grep -E '/(scripts|assets|fixtures)/|README'` prints no line, and `scratch/command-listing-after.txt` names no path from `scratch/move-names.txt`.
- [ ] `scratch/contract-tests-after.txt` reports a pass count that matches `scratch/contract-tests-before.txt`, with no new failure.
- [ ] `opencode debug config` exits 0 on v1 1.19.3 with no error in `scratch/config-load-after.txt`, and `scratch/config-shape.txt` reports `# pass 2` and `# fail 0`.
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
| Changes, verification and review | Pending | Tasks T001 to T023 in `tasks.md` |

### Deviations and findings

| Item | Note |
|------|------|
| D2 conflict | D2 names a `mcp.servers` key as the v1 shape, and the repo uses `mcp.code_mode`. Research iteration 008 finding F3 names `mcp.servers` as the v2 shape. Task T003 decides which shape each host reads, before any edit to `opencode.json`. |
| Destination of moved files | The brief names no destination. The proposal is `.skilled/command-support/` with the subfolders kept, and task T003 confirms it. |
| `orchestrate.md` browser key | The file carries no `chrome_devtools` key, so the default leaves out its `browser` key. Task T003 decides. |
| Mirror folders | The mirror checker reads `.claude` and `.codex` only. Task T009 records how the `.pi`, `.cursor` and `.devin` copies stay in sync. |
<!-- /ANCHOR:log -->
