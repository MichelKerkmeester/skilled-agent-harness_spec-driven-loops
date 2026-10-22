---
title: "Tasks: Phase 58: deepseek-v4-1-flash-1017-default"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "deepseek v4 1 flash 1017 default tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 58: deepseek-v4-1-flash-1017-default

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the gateway catalog the way the runtime would: the llmgateway listing by created date, `opencode models --refresh` on OpenCode 1 and `opencode2 models` on OpenCode 2, and confirm `deepseek-v4.1-flash-1017` is the 2026-10-17 release after the 2026-09-10 `deepseek-v4.1-flash` (`scratch/live/llmgateway-deepseek-by-created.txt`)
- [x] T002 Record what the older id's retirement means: llmgateway's docs list DeepSeek's own provider route for `deepseek-v4.1-flash` as "Deactivating on Oct 24, 2026", while the `llmgateway` route this repo dispatches keeps serving it, so the older literal stays a pin rather than a default (`scratch/live/`)
- [x] T003 Baseline the four defaults and the roster counts before the edit, so the change reads as a delta: one shared `llmgateway/deepseek-v4.1-flash` default behind Pi, Hermes and both OpenCode versions (`.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`, `opencode.json`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the literal and move the two bare defaults: `deepseek-v4.1-flash-1017` joins `PI_SUPPORTED_MODELS` and `HERMES_SUPPORTED_MODELS`, `PI_DEFAULT_MODEL` and `HERMES_DEFAULT_MODEL` name it, and the max-pin regex accepts it while still matching the older literal (`.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`)
- [x] T005 Mirror the same change in the fan-out script: both allowlists, `PI_MODEL_PROVIDERS`, `PI_DEFAULT_MODEL`, `HERMES_DEFAULT_MODEL`, `OPENCODE_DEFAULT_MODEL` and the plain duplicated max-pin function, which is written twice because the command builders are synchronous (`.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`)
- [x] T006 Move the repository config: the top-level `model` and both `agent.build` and `agent.plan` models name `llmgateway/deepseek-v4.1-flash-1017`, each agent keeping `variant: max` (`opencode.json`)
- [x] T007 Register the new id with Pi: a `llmgateway` entry mirroring the older one's context window, output limit, cost, thinking-level map and `supportsDeveloperRole: false` compat block, and the qualified name added to `enabledModels`; `defaultModel` stays `gpt-6-luna` at this step and moves in T024 (`.pi/models.json`, `.pi/settings.json`)
- [x] T008 Update the cli-opencode roster and docs: the default row, the older id as a non-default row with its release date and deactivation note, and every dispatch shape at `--variant max` on OpenCode 1 and `#max` on OpenCode 2 (`.skilled/skills/cli-external-orchestration/cli-opencode/`)
- [x] T009 Update the cli-pi and cli-hermes rosters and docs: the new default row, the older release row, the seven-id closed roster for Hermes and the qualified and bare literals in every example (`.skilled/skills/cli-external-orchestration/cli-pi/`, `.skilled/skills/cli-external-orchestration/cli-hermes/`, `.skilled/skills/cli-external-orchestration/README.md`)
- [x] T010 Update the Pi provider doc so it describes four llmgateway models, the new default route, the older release as a pin, and the compat block on both DeepSeek entries (`.pi/custom-providers.md`)
- [x] T011 Update the docs and assets that present the default model: the prompt-improver agent and its mirrors, sk-prompt, the deep research and review presentations and their compiled contracts, the council seat doc, and the playbook scenario runner (`.skilled/agents/prompt-improver.md`, `.pi/agents/prompt-improver.md`, `.claude/agents/prompt-improver.md`, `.codex/agents/prompt-improver.toml`, `.skilled/skills/sk-prompt/SKILL.md`, `.skilled/commands/deep/assets/`, `.skilled/skills/system-deep-loop/deep-ai-council/references/patterns/seat-diversity-patterns.md`, `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh`)
- [x] T012 Regenerate the Hermes skill mirrors from the `.skilled` tree rather than editing them by hand (`.hermes/skills/cli-opencode/SKILL.md`, `.hermes/skills/cli-hermes/SKILL.md`, `.hermes/skills/sk-prompt/SKILL.md`, `.hermes/skills/agent-prompt-improver/SKILL.md`)
- [x] T013 Add the assertions, one per held value: the rosters and both defaults, `.pi/models.json` registering the default and keeping the older id, the -1017 id max-pinned, the fan-out mapping it to llmgateway, the older literal still building `llmgateway/deepseek-v4.1-flash`, `opencode.json` naming the default in every model field, and the roster keeping the older id as a non-default row (`.skilled/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts`, `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts`, `.skilled/skills/system-deep-loop/runtime/tests/unit/opencode-dual-dispatch.vitest.ts`, `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/default-model-id.test.cjs`)
- [x] T014 Prove each new assertion with a revert: put the old value back, read the specific failure, restore it, and record all eight first-pass proofs; each proof failed only on the value it reverted, and T026 adds four more for the widened scope (`scratch/revert-proofs.txt`)
- [x] T015 Rebase onto main and keep its retirements: the Cline provider and MiMo v2.6 removals from `b1f6c78482`, `aee462fe02` and `b7b3dec9de` stay, neither id comes back into a roster, provider map or doc, and the rosters read 10 cli-pi ids and 7 cli-hermes ids (`.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`, `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Prove Pi live: `--thinking max` and `--thinking high` with `--model llmgateway/deepseek-v4.1-flash-1017` each exit 0 and reply, the JSON names model `deepseek-v4.1-flash-1017`, provider `llmgateway` and thinking level `max` and `high`, and `pi --list-models` lists the id (`scratch/live/`)
- [x] T017 Prove OpenCode 1 live: a pinned `--variant max` dispatch and an unpinned one both exit 0 and reply, and the session export shows modelID `deepseek-v4.1-flash-1017` with providerID `llmgateway` (`scratch/live/`)
- [x] T018 Prove OpenCode 2 live: `--standalone -m llmgateway/deepseek-v4.1-flash-1017#max` exits 0 and replies, and the capture proxy records the request model as `deepseek-v4.1-flash-1017` on both versions (`scratch/live/`)
- [x] T019 Prove the fan-out builds the id on every host: an unpinned dispatch on Pi, OpenCode 1, OpenCode 2 and Hermes each builds the -1017 id and exits 0 (`scratch/live/`)
- [x] T020 Run the four touched suites and record the counts; the numbers are pending the final rerun before the push (`scratch/`)
- [x] T021 Fill this phase's four docs and add the parent map and handoff rows for 058 (`spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `../spec.md`)
- [ ] T022 Push to main (`spec.md`)
- [ ] T023 Record CI on the pushed commit (`implementation-summary.md`)
- [x] T024 Widen Pi's own default on the operator's scope: `defaultModel` moves from `gpt-6-luna` to `deepseek-v4.1-flash-1017` and `llmgateway/deepseek-v4.1-flash-1017` takes the first `enabledModels` slot, every earlier entry kept; `defaultProvider` stays `llmgateway` and `defaultThinkingLevel` stays `xhigh`, which the -1017 thinking-level map marks `null` so Pi's `clampThinkingLevel` rounds a no-model run up to `max` (`.pi/settings.json`)
- [x] T025 Move the pi-blackhole worker model with it: `openai` / `gpt-6-luna` / `medium` becomes `llmgateway` / `deepseek-v4.1-flash-1017` / `high`, and `high` maps to `high` in the -1017 thinking-level map (`.pi/pi-blackhole-config.json`)
- [x] T026 Hold both with two assertions and prove each by a revert: the settings default provider, default model and `enabledModels[0]`, and the blackhole model plus `thinkingLevelMap.high`; the four revert proofs each read one failed and 107 passed (`.skilled/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts`, `scratch/revert-proofs.txt`)
- [x] T027 Update the docs for the widened default: both DeepSeek effort rows gain the note that Pi rounds `xhigh` up to `max`, the stale blackhole compaction sentence and the `pi-tools.md` dispatch default that still named `google` are fixed, and the Hermes cli-pi mirror is regenerated (`.pi/custom-providers.md`, `.skilled/skills/cli-external-orchestration/cli-pi/SKILL.md`, `references/providers-and-models.md`, `references/pi-tools.md`, `.hermes/skills/cli-pi/SKILL.md`)
- [x] T028 Prove the new Pi default live: `pi -ne -p "Reply with exactly: OK" --mode text --offline` with no `--model` replies OK and exits 0, and the JSON run names provider `llmgateway`, model `deepseek-v4.1-flash-1017` and thinking level `max` (`scratch/live/pi-nomodel.*`)
- [x] T029 Prove the blackhole path live: with `PI_BLACKHOLE_PASSIVE` unset and only `PI_BLACKHOLE_OBSERVE_AFTER_TOKENS=1000`, the capture proxy records six session requests at model `deepseek-v4.1-flash-1017` with `reasoning_effort` `max` and the observation-agent request at the same model with `high` (`scratch/live/pi-blackhole-active.*`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Every task marked `[x]`: T022 and T023 stay open until the commit is on main and CI has run on it
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: every host built and answered the -1017 id at the max tier, Pi answered with no model named and ran its blackhole workers on the same id, the older literal still built its own selector, and the twelve revert proofs failed on the reverted values
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Revert proofs**: See `scratch/revert-proofs.txt`
- **Live runs**: See `scratch/live/`
- **The gateway catalog evidence**: See `scratch/live/llmgateway-deepseek-by-created.txt`
<!-- /ANCHOR:cross-refs -->

---
