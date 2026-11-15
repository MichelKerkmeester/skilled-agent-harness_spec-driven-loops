---
title: "Goal: Phase 12: playbook-docs-and-closeout"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "playbook docs and closeout goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/012-playbook-docs-and-closeout"
    last_updated_at: "2026-11-14T14:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Wrote the Vibe playbook, catalog and docs"
    next_safe_action: "Operator: commit the worktree and settle child 003"
    blockers: []
    key_files:
      - ".skilled/skills/cli-external-orchestration/cli-deepseek-harness/manual-testing-playbook/manual-testing-playbook.md"
      - ".skilled/CROSS-CLI.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mistral-support-2026-11-14"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 12: playbook-docs-and-closeout

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Prove the cli-mistral-vibe mode end to end with a recorded playbook, name it in every runtime list and close the parent packet.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The playbook lives in the mode packet, and `.vibe/manual-testing-playbook` links to it, as `.dsh/manual-testing-playbook` does for DeepSeek Harness |
| D2 | No playbook scenario for a deferred item: ACP supervisor, session relaunch, turn-stopping guards or sandbox mode |
| D3 | Env docs carry variable names only, never values |
| D4 | No default model changes. DevPass stays the default |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `validate.sh specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation --strict --recursive --quiet` prints `RESULT: PASSED`
- [x] `rg -l -i 'result: pending' .skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook` prints nothing
- [x] `rg -c 'cli-mistral-vibe' .skilled/skills/cli-external-orchestration/feature-catalog/feature-catalog.md` prints at least 1
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
| Baseline | Done | No playbook, no doc names `cli-mistral-vibe` or `.vibe/`, catalog says seven, no env doc names `MISTRAL_API_KEY` (`spec.md` Measured Behavior) |
| Playbook | Done | Index, eight category folders and `stress/` with 14 files; every scenario carries a dated verdict; `rg -l -i 'result: pending'` prints nothing; `.vibe/manual-testing-playbook` resolves |
| Catalog and docs | Done | Catalog entry and index row, count eight; seven sibling READMEs, CROSS-CLI (3 `.vibe/` lines), AGENTS, README, README.txt, ENV-REFERENCE and the dotenv example name the mode or variables; changelog `cli-mistral-vibe/changelog/v1.0.0.0.md` extended |
| Regenerated | Done | agents-md manifest `--write` then `--check` PASS; durable-directory manifest `--write` then reproducible; README verdict parity diff 0; trigger index rebuilt |
| Hub routing | Done | Re-minted: both activation manifests pinned to `8afacc3f...`, sync promoted 62 files, finalize exit 0, manifest tests 48/48, status `compiled-serving`, "delegate to vibe" routes to `cli-mistral-vibe` |
| Hub gates | Done | parent-skill-check OK, 8 packets, 0 warnings; agent mirrors in sync; three Vibe sync `--check` exit 0; sk-skill-check PASS |

### Deviations and findings

| Item | Note |
|------|------|
| Hub playbook | The hub `manual-testing-playbook.md` names no per-mode playbook today, so this phase adds no hub playbook row |
| Ninth folder | T004 asks for eight category folders. The playbook also has `stress/`, because the stress matrix names 14 `cli-mistral-vibe/manual-testing-playbook/stress/<slug>.md` paths; none is named for ACP, relaunch, turn-stopping guards or sandbox |
| Stale routing manifest | The phase 010 pin went stale once the mode's docs changed, and the front door served `legacy` with `stale-manifest`. The fix needs both activation manifests pinned, the runtime one and the authored one in the spec archive; pinning only the runtime copy made the sync fail its move simulation |
| Playbook validator | `validate-playbook-package.cjs` reports `missing-test` for all 126 cells on main and here: `vitest list` now prefixes `[serial] `, which its `startsWith` check misses. Not fixed here; the Vibe `missing-playbook` rows went from 14 to 0 |
| Dotenv check | T011's `rg -n 'MISTRAL_API_KEY=.+'` matches the commented template line, whose tail is spaces and a comment, not a value, as on the `LLMGATEWAY_API_KEY` row |
| Live scenarios | `cli-invocation` and `model-dispatch` cite the keyed runs recorded in phases 009 and 011 rather than new keyed runs |
| Child 003 | Stays In Progress: its keyed proof waits on the dsh release question, so the parent stays In Progress |


Answered: the categories are the eight built surfaces plus the stress matrix's `stress/` folder.
<!-- /ANCHOR:log -->
