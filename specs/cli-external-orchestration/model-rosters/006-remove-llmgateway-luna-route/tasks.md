---
title: "Tasks: Remove the llmgateway GPT-6 Luna route from Pi, OpenCode and Hermes rosters"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "remove llmgateway luna route tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Remove the llmgateway GPT-6 Luna route from Pi, OpenCode and Hermes rosters

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

`R` is `.skilled/skills/system-deep-loop/runtime`. `H` is `.skilled/skills/cli-external-orchestration/cli-hermes`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the baseline Pi listing (`spec.md` Measured Behavior). Verify: `pi --list-models gpt-6` prints an `llmgateway gpt-6-luna` row.
- [x] T002 Record the baseline test count (`R/tests/unit`). Verify: `npx vitest run --no-coverage tests/unit/executor-config.vitest.ts tests/unit/fanout-run.vitest.ts` prints `Tests  281 passed (281)`.
- [x] T003 Confirm the code mapping (`R/scripts/fanout-run.cjs`). Verify: `rg -n "'gpt-6-luna'" R/scripts/fanout-run.cjs` shows Pi mapping to `openai` and a Hermes allowlist entry under the fixed `llmgateway` provider.
- [x] T020 Record the Sol baseline and classify every Sol hit (repository outside `specs/`). Verify: `rg -n -i 'gpt-6-sol|gpt-6\.0-sol|6-sol' --hidden -g '!specs/**' -g '!.worktrees/**' -g '!node_modules/**'` shows the only gateway Sol route is the Hermes pair, and the T002 command prints `Tests  281 passed (281)`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Remove the Luna object from the llmgateway block (`.pi/models.json`). Verify: `node -e "JSON.parse(require('fs').readFileSync('.pi/models.json','utf8'))"` exits 0 and `rg -c gpt-6-luna .pi/models.json` prints nothing.
- [x] T005 Remove `llmgateway/gpt-6-luna` from `enabledModels` (`.pi/settings.json`). Verify: `rg -n 'llmgateway/gpt-6-luna' .pi/settings.json` prints nothing and `openai/gpt-6-luna` stays.
- [x] T006 Rewrite the DevPass section for two models (`.pi/custom-providers.md`). Verify: `rg -n -i 'luna' .pi/custom-providers.md` prints only `openai` route lines.
- [x] T007 Drop the DevPass Luna row and prose (`cli-pi/references/providers-and-models.md`). Verify: `rg -n 'llmgateway/gpt-6-luna' <file>` prints nothing.
- [x] T008 [P] Scrub the gateway Luna mentions (`cli-pi/changelog/v1.5.7.0.md`, `v1.5.8.0.md`). Verify: `rg -n -i 'llmgateway/gpt-6-luna|DevPass.*luna' <files>` prints nothing.
- [x] T009 Remove `gpt-6-luna` from the Hermes allowlist and its mirror (`R/lib/deep-loop/executor-config.ts`, `R/scripts/fanout-run.cjs`). Verify: both lists hold six ids.
- [x] T010 Update the Hermes roster assertions (`R/tests/unit/executor-config.vitest.ts`). Verify: the roster test expects six ids and asserts `isHermesModelAllowed('gpt-6-luna')` is false.
- [x] T011 Rewrite the Hermes roster docs from seven ids to six (`H/SKILL.md`, `H/README.md`, `H/references/providers-and-models.md`, `H/assets/prompt-quality-card.md`, `H/feature-catalog/`, `H/manual-testing-playbook/`, `H/changelog/v1.0.2.0.md`). Verify: `rg -n 'gpt-6-luna' H` prints nothing.
- [x] T012 [P] Point the Hermes launch examples at `deepseek-v4.1-flash-1017` (`.skilled/hooks/session-relaunch/README.md`, `session-relaunch-command-runtimes.md`). Verify: `rg -n 'llmgateway.*gpt-6-luna' <files>` prints nothing.
- [x] T013 [P] Drop the Pi gateway Luna default sentences (`.skilled/changelog/skilled/v4.0.0.1.md`). Verify: `rg -n -i 'gateway route to luna|llmgateway/gpt-6-luna' <file>` prints nothing.
- [x] T014 Regenerate the Hermes skill mirror (`.hermes/skills/cli-hermes/SKILL.md`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` reports no drift.
- [x] T015 Regenerate the trigger index and fixtures (`.skilled/skills/system-spec-kit/runtime/data/trigger-index.json`). Verify: the generator exits 0 and `--check` passes.
- [x] T021 Remove `gpt-6-sol` from the Hermes allowlist and its mirror (`R/lib/deep-loop/executor-config.ts`, `R/scripts/fanout-run.cjs`). Verify: both lists hold five ids.
- [x] T022 Update the Hermes roster assertions for Sol (`R/tests/unit/executor-config.vitest.ts`). Verify: the roster test expects five ids and asserts `isHermesModelAllowed('gpt-6-sol')` is false.
- [x] T023 Rewrite the Hermes roster docs from six ids to five and drop the Sol row (`H/SKILL.md`, `H/README.md`, `H/references/providers-and-models.md`, `H/assets/prompt-quality-card.md`, `H/feature-catalog/`, `H/manual-testing-playbook/`, `cli-external-orchestration/README.md`, `cli-external-orchestration/graph-metadata.json`). Verify: `rg -n 'gpt-6-sol' H -g '!benchmark/**'` prints nothing.
- [x] T024 Scrub the gateway Sol mention from the released note (`H/changelog/v1.0.2.0.md`). Verify: `rg -n -i 'gpt-6-sol|gpt-6 sol' <file>` prints nothing.
- [x] T025 Regenerate the Hermes skill mirror and the trigger index after the Sol edits. Verify: `sync-skills-hermes.cjs --check` prints `PASS` and `generate-trigger-index.mjs --check` exits 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Run the residue search (repository outside `specs/`). Verify: `rg -n --hidden -g '!.git' -g '!node_modules' -g '!specs/**' -g '!.worktrees/**' -i 'llmgateway' . | rg -i 'luna'` prints only lines that name Luna on the `openai` route, in a keyword list or in a `none is Luna` note, plus index and fixture rows sourced from `specs/` docs.
- [x] T017 Re-list Pi's GPT-6 models (`.pi/models.json`). Verify: `pi --list-models gpt-6` prints `openai gpt-6-luna` and no `llmgateway gpt-6-luna`.
- [x] T018 Rerun the affected tests (`R/tests/unit`). Verify: the T002 command prints `Test Files  2 passed (2)` and no failure.
- [x] T019 Validate the packet (`spec.md`). Verify: `validate.sh <packet> --strict --quiet` prints `RESULT: PASSED`.
- [x] T026 Rerun the Sol residue search (repository outside `specs/`). Verify: the T020 command prints no llmgateway or DevPass Sol route.
- [x] T027 Re-list Pi's GPT-6 models. Verify: `pi --list-models gpt-6` prints `openai gpt-6-sol` and no `llmgateway gpt-6-sol`.
- [x] T028 Rerun the affected tests and the typecheck (`R`). Verify: the T002 command prints `Test Files  2 passed (2)` and `npm run typecheck` exits 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: `pi --list-models gpt-6` shows no `llmgateway gpt-6-luna` or `llmgateway gpt-6-sol` row
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
