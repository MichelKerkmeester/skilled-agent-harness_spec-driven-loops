---
title: "Tasks: Phase 10: hub-registration-and-routing"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "hub registration and routing tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 10: hub-registration-and-routing

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`H` is `.skilled/skills/cli-external-orchestration`. `CR` is `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration`. `ADV` is `.skilled/skills/system-skill-advisor/runtime`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm the mode packet from phase 005 exists (`H/cli-mistral-vibe/SKILL.md`). Verify: `ls H/cli-mistral-vibe/SKILL.md` prints the path.
- [ ] T002 Confirm the executor kind from phase 009 exists (`.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`). Verify: `rg -c 'cli-mistral-vibe' .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` prints at least 1.
- [ ] T003 [P] Record the routing baseline (`scratch/baseline.txt`). Verify: the file holds the modes count `7`, the `compiled-route-status.cjs` cause code and the advisor and scorer vitest summaries.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add the eighth mode entry and update the count wording (`H/mode-registry.json`). Verify: `node -e "console.log(require('./H/mode-registry.json').modes.length)"` prints 8.
- [ ] T005 Add `routerSignals` entries for aliases `mistral vibe`, `vibe -p` and `delegate to vibe`, and place the mode after `cli-deepseek-harness` in `routerPolicy.tieBreak` (`H/hub-router.json`). Verify: `rg -c 'cli-mistral-vibe' H/hub-router.json` prints at least 3 and `rg -c '"vibe"' H/hub-router.json` prints 0.
- [ ] T006 Add the `INTENT_SIGNALS` and `RESOURCE_MAP` rows with equal keys (`H/ROUTER.md`). Verify: `rg -c 'cli-mistral-vibe' H/ROUTER.md` prints at least 2.
- [ ] T007 Add the mode's vocabulary for stage one (`H/graph-metadata.json`). Verify: `rg -c 'mistral vibe' H/graph-metadata.json` prints at least 1.
- [ ] T008 Add the mode table row, keywords and count of eight (`H/SKILL.md`, `H/README.md`, `H/description.json`). Verify: `rg -n -i 'seven' H/SKILL.md H/README.md H/description.json` prints nothing.
- [ ] T009 Regenerate the leaf manifest and add the hub changelog entry (`H/leaf-manifest.json`, `H/changelog/`). Verify: `rg -c 'cli-mistral-vibe' H/leaf-manifest.json` prints at least 1.
- [ ] T010 Add the packet source entry and canaries for "delegate to vibe", "use cli-opencode with mistral deepseek-v4-1-flash-1017" and "give this landing page a calmer vibe" (`CR/harness/build-artifacts.cjs`, `CR/fixtures/canary-cases.v1.json`). Verify: `rg -c 'cli-mistral-vibe' CR/harness/build-artifacts.cjs` prints 1.
- [ ] T011 Add the packet to the card-sync list and regenerate the advisor graph (`ADV/scripts/check-prompt-quality-card-sync.sh`, `ADV/scripts/skill-graph.json`). Verify: `bash ADV/scripts/check-prompt-quality-card-sync.sh` exits 0.
- [ ] T012 Add selection and conflict cases and the scorer assertion (`ADV/tests/parity/fixtures/executor-delegation-cases.json`, `ADV/tests/scorer/executor-delegation.vitest.ts`). Verify: the executor-delegation vitest run reports 0 failed.
- [ ] T013 Add the model row, card row and executor table rows (`.skilled/skills/sk-prompt/SKILL.md`, `.skilled/skills/sk-prompt/assets/cli-prompt-quality-card.md`, `.skilled/agents/orchestrate.md`, `.skilled/agents/prompt-improver.md`). Verify: `rg -l 'cli-mistral-vibe'` over those four files lists all four.
- [ ] T014 Regenerate the agent mirrors with their generators (`.claude/agents/`, `.codex/agents/`, `.pi/agents/`, `.dsh/agents/`, `.vibe/agents/`). Verify: `node .skilled/bin/check-agent-mirror-sync.cjs --all` prints `all mirrors in sync`, and the phase 006 `.vibe/agents/` generator `--check` exits 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T015 Remint compiled routing (`CR/harness/build-artifacts.cjs`). Verify: `node CR/harness/build-artifacts.cjs`, `node .skilled/bin/compiled-route-sync.cjs` and its `--finalize` step exit 0, `node --test .skilled/bin/tests/compiled-route-manifest.test.cjs` prints `fail 0`, and `compiled-route-status.cjs --hub cli-external-orchestration` prints `"fresh":true`.
- [ ] T016 Run the per-hub gate with the hub path (`.skilled/commands/doctor/scripts/parent-skill-check.cjs`). Verify: `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/cli-external-orchestration` prints `INFO: Parent skill: .skilled/skills/cli-external-orchestration`, `declares 8 modes` and no hard failure.
- [ ] T017 Replay stage two for the handoff prompt and the stay-on-runtime prompt (`.skilled/bin/compiled-route.cjs`). Verify: "delegate to vibe" prints `"workflowMode":"cli-mistral-vibe"` and "use cli-opencode with mistral deepseek-v4-1-flash-1017" prints `"workflowMode":"cli-opencode"`.
- [ ] T018 Replay stage one for the handoff prompt (`ADV/scripts/skill_advisor.py`). Verify: `python3 ADV/scripts/skill_advisor.py "delegate to vibe" --threshold 0.5` names `cli-external-orchestration` with `"passes_threshold": true`.
- [ ] T019 Replay an out-of-domain phrase through both stages (`.skilled/bin/compiled-route.cjs`). Verify: `compiled-route.cjs --hub cli-external-orchestration --prompt "give this landing page a calmer vibe"` prints no `cli-mistral-vibe`.
- [ ] T020 Validate this phase folder (`spec.md`). Verify: `validate.sh <this folder> --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed: both stage replays for "delegate to vibe" recorded in `scratch/`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Routing rule**: `.skilled/repo-rules/skill-hub-routing.md`
<!-- /ANCHOR:cross-refs -->

---
