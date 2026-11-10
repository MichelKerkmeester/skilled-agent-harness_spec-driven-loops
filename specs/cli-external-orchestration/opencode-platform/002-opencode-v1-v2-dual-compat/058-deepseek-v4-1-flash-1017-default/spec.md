---
title: "Feature Specification: Phase 58: deepseek-v4-1-flash-1017-default"
description: "LLM Gateway lists deepseek-v4.1-flash-1017, the 2026-10-17 DeepSeek V4.1 Flash release, as its newest flash id, and DeepSeek's own provider route for deepseek-v4.1-flash is listed as deactivating on 2026-10-24. This phase moves the DeepSeek default on cli-pi, cli-hermes and both OpenCode versions to the newer id through llmgateway, keeps the older literal pinnable for the 2026-09-10 build, and re-proves every default with tests, revert proofs and live dispatches on each host."
trigger_phrases:
  - "deepseek v4 1 flash 1017 default"
  - "phase 58 deepseek v4 1 flash 1017 default"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 58: deepseek-v4-1-flash-1017-default

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-22 |
| **Branch** | `worktrees/203-deepseek-v4-1-flash-1017-default` |
| **Parent Spec** | ../spec.md |
| **Phase** | 58 of 59 |
| **Predecessor** | 057-v4-0-0-13-reliability-fixes |
| **Successor** | 059-cross-cli-map-refresh |
| **Handoff Criteria** | The operator approved the switch on 2026-10-22; the tests and revert proofs hold every default and registration, and live dispatches on Pi, OpenCode 1, OpenCode 2 and Hermes built and answered `deepseek-v4.1-flash-1017` at the max tier while the older literal stayed pinnable (`scratch/live/`, `scratch/revert-proofs.txt`) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 58** of the OpenCode v1 and v2 dual compatibility packet. It moves the DeepSeek default onto a newer release of the same model, so no provider, adapter or dispatch shape changes.

**Scope Boundary**: the model ids the runtime defaults to and allows, the four config files that name them, the rosters and docs of the three CLI skills, the mirrors that copy those docs, the tests that hold the defaults, and the live proof on each host. One literal names one model: the new id is its own literal and its own `llmgateway` route, and the older literal keeps the route it already had. No plugin, hook, command, agent shape or dispatch argument changes, and dated records keep the id they used.

**Dependencies**:
- `../052-v1-default-llmgateway/` and `../043-v2-default-model-and-follow-ups/`, which made `llmgateway/deepseek-v4.1-flash` the single shared default this phase moves rather than replaces.
- The LLM Gateway catalog, `opencode models --refresh` on OpenCode 1 and `opencode2 models` on OpenCode 2, which is how the new id was found and confirmed.
- Main's retirement of the Cline provider and MiMo v2.6 (`b1f6c78482`, `aee462fe02`, `b7b3dec9de`), which this phase was rebased onto and keeps.

**Deliverables**:
- The runtime rosters, provider map, both defaults and the max-pin regex in `executor-config.ts` and `fanout-run.cjs`.
- `opencode.json` on the new id in every model field, `.pi/models.json` with a `llmgateway` entry for the new id, `.pi/settings.json` with `defaultModel` on the new id and that id first in `enabledModels`, and `.pi/pi-blackhole-config.json` running its workers on the same id at `high`.
- The cli-opencode, cli-pi and cli-hermes rosters and docs, `.pi/custom-providers.md`, the prompt-improver agent and its mirrors, sk-prompt, the deep research and review presentations and their compiled contracts, the council seat doc, and the playbook scenario runner.
- Four updated test files with the new assertions, plus the revert proofs in `scratch/revert-proofs.txt`.
- The live runs in `scratch/live/` on Pi, OpenCode 1, OpenCode 2 and Hermes.

**Changelog**:
- Not this phase's to edit. The v4.0.0.13 notes are owned by the changelog rewrite packet beside this one, and the release line picks this user-visible change up there.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
LLM Gateway lists `deepseek-v4.1-flash-1017` (created 2026-10-17) as its newest DeepSeek flash, after `deepseek-v4.1-flash` (2026-09-10), `deepseek-v4-flash` and `deepseek-v4-pro` (2026-04-24) and `deepseek-v3.2` (2025-09-29). llmgateway's docs show DeepSeek's own provider route for the older id as "Deactivating on Oct 24, 2026". Every default in this repo still named the older id: Pi and Hermes through the bare literal, both OpenCode versions through `llmgateway/deepseek-v4.1-flash`.

### Purpose
Make the 2026-10-17 release the DeepSeek default on all four hosts while the older literal stays pinned to its own route, so a run can still reproduce the 2026-09-10 build and no default goes dark when the older provider route retires.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One new bare literal, `deepseek-v4.1-flash-1017`, mapped to `llmgateway`, and the defaults that name it: both runtime rosters, both OpenCode versions, Pi's own `.pi/settings.json` default and the pi-blackhole worker model.
- The cli-opencode default in its own syntax: `llmgateway/deepseek-v4.1-flash-1017` with `--variant max` on OpenCode 1 and `#max` on OpenCode 2.
- The older literal `deepseek-v4.1-flash`, kept selectable, pinnable and documented as the 2026-09-10 release.
- Both literals pinned to the max tier, in the runtime regex and in the mirrored plain function.
- The rosters, docs, mirrors, tests and live proof that name or hold any of the above.

### Out of Scope
- Every provider besides `llmgateway`, and every other model on the rosters. Only the DeepSeek flash rows move.
- The Cline provider and MiMo v2.6 retirements that landed on main during this phase. This phase was rebased onto them, keeps those removals, and re-adds neither.
- Dated records, which keep the id they used at the time they were written.
- Any change to dispatch arguments, plugin behaviour or agent shape. The model id is the whole change.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modify | Both DeepSeek rosters, `PI_DEFAULT_MODEL`, `HERMES_DEFAULT_MODEL` and the max-pin regex |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | The mirrored rosters, `PI_MODEL_PROVIDERS`, both defaults and the mirrored max-pin function |
| `opencode.json` | Modify | The top-level `model` and both `agent.*.model` fields |
| `.pi/models.json` | Modify | A `llmgateway` entry for the new id, mirroring the older entry's context, cost and compat block |
| `.pi/settings.json` | Modify | `defaultModel` moves from `gpt-6-luna` to `deepseek-v4.1-flash-1017` and that id takes the first `enabledModels` slot, every earlier entry kept; `defaultProvider` stays `llmgateway` and `defaultThinkingLevel` stays `xhigh` |
| `.pi/pi-blackhole-config.json` | Modify | `model` moves from `openai` / `gpt-6-luna` / `medium` to `llmgateway` / `deepseek-v4.1-flash-1017` / `high`, and `high` maps to `high` in the -1017 thinking-level map |
| `.pi/custom-providers.md` | Modify | Four llmgateway models instead of three, the new default route and the pin guidance for the older one |
| `.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md`, `README.md`, `references/providers-and-models.md`, `references/cli-reference.md`, `references/install-and-versions.md` | Modify | The default id in every dispatch shape, the roster rows and the version notes |
| `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/**` | Modify | The scenario commands and the plugin scenario runner |
| `.skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md`, `references/pi-tools.md`, `manual-testing-playbook/model-dispatch/supported-model-allowlist-smoke.md` | Modify | The new default row, the older release row, the dispatch default in `pi-tools.md` that used to name `google`, and the allowlist smoke command |
| `.skilled/skills/cli-external-orchestration/cli-hermes/SKILL.md`, `README.md`, `references/providers-and-models.md`, `feature-catalog/**`, `manual-testing-playbook/**`, `assets/**` | Modify | The closed roster at seven ids, the new default and the dispatch examples |
| `.skilled/skills/cli-external-orchestration/README.md`, `graph-metadata.json` | Modify | The packet's own summary line and trigger text |
| `.skilled/agents/prompt-improver.md`, `.pi/agents/prompt-improver.md`, `.claude/agents/prompt-improver.md`, `.codex/agents/prompt-improver.toml` | Modify | The model the prompt-improver agent pins |
| `.skilled/skills/sk-prompt/SKILL.md` | Modify | The model its dispatch examples name |
| `.skilled/commands/deep/assets/deep-research-presentation.txt`, `deep-review-presentation.txt`, `compiled/*.contract.markdown` | Modify | The presented default model and the compiled contracts that carry it |
| `.skilled/skills/system-deep-loop/deep-ai-council/references/patterns/seat-diversity-patterns.md` | Modify | The council seat's model row |
| `.hermes/skills/cli-opencode/SKILL.md`, `.hermes/skills/cli-hermes/SKILL.md`, `.hermes/skills/sk-prompt/SKILL.md`, `.hermes/skills/agent-prompt-improver/SKILL.md` | Modify | The regenerated Hermes mirrors |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts` | Modify | The roster and default assertions, the models.json registration test and the max-pin cases |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modify | The provider map, both defaults, the max-pin expectation and the older-literal case |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/opencode-dual-dispatch.vitest.ts` | Modify | The default id it expects in a built dispatch |
| `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/default-model-id.test.cjs` | Modify | `opencode.json` held to the default in every model field, and the older id held as a non-default roster row |
| `scratch/revert-proofs.txt`, `scratch/live/` | Create | The revert proofs and the live runs on each host |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Modify | This phase's packet, filled from the scaffold |
| `../spec.md` | Modify | The phase map row for 058 and the handoff row for 058 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The new bare literal `deepseek-v4.1-flash-1017` maps to `llmgateway` and is the default for cli-pi and cli-hermes, and cli-opencode defaults to `llmgateway/deepseek-v4.1-flash-1017` on both versions. | `fanout-run` builds the -1017 id with no model pinned on each host, and `opencode.json` names it in the top-level and both agent model fields. |
| REQ-002 | The old literal `deepseek-v4.1-flash` stays selectable and pinnable for the 2026-09-10 release, on its own route. | The old literal is still on both rosters as a non-default row, its `llmgateway` entry still exists, and a fan-out with it pinned builds `llmgateway/deepseek-v4.1-flash`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Both literals are pinned to the max tier. | `isFlashMaxPinnedModel` and its mirrored plain function match `deepseek-v4.1-flash-1017` as well as `deepseek-v4.1-flash`, and `pinReasoningEffortForModel('deepseek-v4.1-flash-1017', 'high')` returns `max`. |
| REQ-004 | The tests hold every default and registration, and each new assertion fails when its value is reverted. | The four updated test files pass, and the twelve revert proofs in `scratch/revert-proofs.txt` each fail on the reverted value. |
| REQ-005 | Every host builds and answers the new id live at the max tier. | Pi at `--thinking max` and `high`, OpenCode 1 pinned and unpinned, OpenCode 2 standalone, and an unpinned Hermes fan-out each exit 0 and reply; the capture proxy records request model `deepseek-v4.1-flash-1017`. |
| REQ-006 | The rebase keeps main's Cline and MiMo retirements, and the rosters read 10 cli-pi ids and 7 cli-hermes ids. | Neither retired provider is back in a roster, provider map or doc, and the roster assertions pass at those counts. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A run with no model pinned on any host reaches the 2026-10-17 DeepSeek release through llmgateway at the max tier.
- **SC-002**: A run that pins `deepseek-v4.1-flash` still reaches the 2026-09-10 release, so the move costs no reproducibility.
- **SC-003**: No test regressed, and every new assertion is proved by a revert proof rather than by a green run alone.
- **SC-004**: The rosters and docs agree on seven cli-hermes ids and ten cli-pi ids, with the new id default and the older one a non-default row.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The LLM Gateway catalog carrying the new id | High | Confirmed on both hosts before any edit: the catalog row, `opencode models --refresh` on OpenCode 1 and `opencode2 models` on OpenCode 2, recorded in `scratch/live/llmgateway-deepseek-by-created.txt` |
| Dependency | DeepSeek's own provider route for the older id retiring on 2026-10-24 | High | The older id is kept only as a pin on the `llmgateway` route, which is what this repo dispatches, and the docs name the deactivation date beside it |
| Risk | A worktree run reads the main checkout's `.pi/models.json` through a symlink, so the new id looks absent locally | High | The live Pi trials used a scratch `PI_CODING_AGENT_DIR` that links every entry back to `~/.pi/agent` except `models.json`; the limitation is recorded rather than worked around in the tree |
| Risk | The rebase re-adds the Cline provider or MiMo v2.6 that main retired | High | The rebase resolved by keeping main's removals, and the roster assertions fail if either id returns |
| Risk | The dispatch guard forbids an ad-hoc unpinned `opencode run`, so a bare config-default run cannot be taken | Med | OpenCode 2's config default was proved through the fan-out runtime and the capture proxy instead, and the limitation is recorded |
| Risk | A doc keeps the old id in a command a reader copies | Med | The cli-opencode default-model test scans the roster, `SKILL.md`, the Hermes mirror and `opencode.json`, and fails on a stale default |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None for this phase. The operator approved the switch on 2026-10-22, and the catalog evidence settled which id is newest. The three limitations recorded at close are environmental, not decisions left open.
<!-- /ANCHOR:questions -->

---
